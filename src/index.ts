import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { GraphQLClient } from "graphql-request";
import type { Job } from "./graphql/client/generated/graphql";
import { SubmitDocument } from "./graphql/client/generated/graphql";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import type { Credit, MetaScheduler } from "./contracts";
import { Contract } from "ethers";
import creditAbi from "./abi/Credit.json";
import metaSchedulerAbi from "./abi/MetaScheduler.json";
import { GRPCService } from "./grpc/service";
import { createLoggerClient } from "./grpc/client";
import { ILoggerAPIClient } from "./grpc/generated/logger/v1alpha1/log.client";
import AsyncLock from 'async-lock';
import type {
  JobCostStructOutput,
  JobDefinitionStructOutput,
  JobTimeStructOutput,
} from "./contracts/MetaScheduler";
import type { ReadResponse } from "./grpc/generated/logger/v1alpha1/log";
import { formatBytes32String, parseUnits } from "ethers/lib/utils";

export default class DeepSquareClient {
  private readonly wallet: Wallet;

  private readonly graphqlClient: GraphQLClient;

  private readonly metaScheduler: MetaScheduler;

  private readonly credit: Credit;

  private readonly provider: JsonRpcProvider;

  private lock: AsyncLock;

  private nonce: number;

  /**
   * @param privateKey {string} Web3 wallet private that will be used for credit billing
   * @param metaschedulerAddr {string} Address of the metascheduler smart contract
   * @param creditAddr {string} Address of the credit smart contract
   * @param sbatchServiceEndpoint {string} Endpoint of the sbatch service
   */
  constructor(
    privateKey: string,
    metaschedulerAddr = "0xB95a74d32Fa5C95984406Ca82653cBD6570cb523",
    creditAddr = '0x2FE7ED7941E569697fF856736a88467B8fd569f0',
    sbatchServiceEndpoint = "https://sbatch.deepsquare.run/graphql",
    private loggerClientFactory: () => ILoggerAPIClient = createLoggerClient
  ) {
    this.provider = new JsonRpcProvider("https://testnet.deepsquare.run/rpc", {
      name: "DeepSquare Testnet",
      chainId: 179188,
    });
    this.lock = new AsyncLock();

    this.nonce = -1;

    this.wallet = new Wallet(privateKey, this.provider);

    this.graphqlClient = new GraphQLClient(sbatchServiceEndpoint);

    this.metaScheduler = new Contract(metaschedulerAddr, metaSchedulerAbi, this.provider).connect(
      this.wallet
    ) as MetaScheduler;

    this.credit = new Contract(creditAddr, creditAbi, this.provider).connect(this.wallet) as Credit

  }

  /**
   * Allow DeepSquare Grid to use $amount of credits to pay for jobs.
   * @param amount The amount to setAllowance.
   */
  async setAllowance(amount: BigNumber) {
    await this.credit.approve(this.metaScheduler.address, parseUnits(amount.toString(), 'ether'))
  }

  /**
   * Submit a job to the DeepSquare Grid
   * @param job The definition of job to send, including storage, environment variables, resources and computing steps. Check the package documentation for further details on the Job type
   * @param jobName The name of the job, limited to 32 characters.
   * @returns {string} The id of the job on the Grid
   */
  async submitJob(job: Job, jobName: string, maxAmount = 1e3): Promise<string> {
    if (jobName.length > 32) throw new Error("Job name exceeds 32 characters");
    const hash = await this.graphqlClient.request(SubmitDocument, { job });
    return this.lock.acquire('submitJob', async () => {
      const job_output = (
        await (
          await this.metaScheduler.requestNewJob(
            {
              ntasks: job.resources.tasks,
              gpuPerTask: job.resources.gpusPerTask,
              cpuPerTask: job.resources.cpusPerTask,
              memPerCpu: job.resources.memPerCpu,
              storageType: job.output
                ? job.output.s3
                  ? 2
                  : job.output.http
                    ? job.output.http.url === "https://transfer.deepsquare.run/"
                      ? 0
                      : 1
                    : 4
                : 4,
              batchLocationHash: hash.submit,
            },
            parseUnits((maxAmount).toString(), "ether"),
            formatBytes32String(jobName),
            true,
          )
        ).wait()
      )
      //console.log(job_output.events as [])
      //console.log(job_output.events![1] as {})
      const event = job_output.events!.filter(event => event.event === 'NewJobRequestEvent')![0];
      return event.args![0] as string;
    })
  }

  /**
   *  Get the job information from smarts contracts by id
   * @param jobId {string} The job id to fetch.
   */
  async getJob(jobId: string): Promise<{
    jobId: string;
    status: number;
    customerAddr: string;
    providerAddr: string;
    definition: JobDefinitionStructOutput;
    valid: boolean;
    cost: JobCostStructOutput;
    time: JobTimeStructOutput;
    jobName: string;
    hasCancelRequest: boolean;
  }> {
    return await this.metaScheduler.jobs(jobId);
  }

  /**
   *  Cancel a job by id
   * @param jobId {string} The job id to cancel.
   */
  async cancel(jobId: string) {
    return await this.metaScheduler.cancelJob(jobId)
  }

  /**
   * Get the iterable containing the live logs of given job. Make sure to close the stream with the second function returned once you're done with it.
   * @param jobId {string} The job id from which getting the job
   */
  getLogsMethods(jobId: string): {
    fetchLogs: () => Promise<[AsyncIterable<ReadResponse>, () => void]>;
  } {
    return {
      fetchLogs: () => {
        const service = new GRPCService(this.loggerClientFactory(), this.wallet);
        return service.readAndWatch(
          this.wallet.address.toLowerCase(),
          jobId
        );
      },
    };
  }
}
