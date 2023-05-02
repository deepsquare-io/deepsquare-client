import dayjs from 'dayjs';
import { formatEther } from '@ethersproject/units';
import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import { GraphQLClient } from "graphql-request";
import type { Job } from "./graphql/client/generated/graphql";
import { SubmitDocument } from "./graphql/client/generated/graphql";
import { BigNumber } from "@ethersproject/bignumber";
import type { Credit, MetaScheduler, ProviderManager } from "./contracts";
import { Contract } from "ethers";
import creditAbi from "./abi/Credit.json";
import metaSchedulerAbi from "./abi/MetaScheduler.json";
import providerManagerAbi from "./abi/ProviderManager.json";
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
import { time } from 'console';

export enum JobStatus {
  PENDING = 0,
  META_SCHEDULED = 1,
  SCHEDULED = 2,
  RUNNING = 3,
  CANCELLED = 4,
  FINISHED = 5,
  FAILED = 6,
  OUT_OF_CREDITS = 7
}

interface GetLogsMethodsReturnType {
  fetchLogs: () => Promise<[AsyncIterable<ReadResponse>, () => void]>;
}

export function isJobTerminated(status: number): boolean {
  return (
    status === JobStatus.CANCELLED ||
    status === JobStatus.FAILED ||
    status === JobStatus.FINISHED ||
    status === JobStatus.OUT_OF_CREDITS
  );
}

// compute the job current cost (total if job finished)
const computeCost = (job: any, provider: any): number => {
  return isJobTerminated(job.start)
    ? +formatEther(job.cost.finalCost)
    : +`${(
      dayjs().diff(dayjs(job.time.start.toNumber() * 1000), 'minutes') * computeCostPerMin(job, provider)
    ).toFixed(0)}`
}

// compute the job costs per minute based on provider price
const computeCostPerMin = (job: any, provider: any): number => {
  const tasks = job.definition.ntasks.toNumber();
  const gpuCost = job.definition.gpuPerTask.toNumber() * provider.definition.gpuPricePerMin.toNumber();
  const cpuCost = job.definition.cpuPerTask.toNumber() * provider.definition.cpuPricePerMin.toNumber();
  const memCost =
    job.definition.memPerCpu.toNumber() *
    job.definition.cpuPerTask.toNumber() *
    provider.definition.memPricePerMin.toNumber();
  return (tasks * (gpuCost + cpuCost + memCost)) / 1e6;
};

export default class DeepSquareClient {
  private readonly wallet: Wallet | null;

  private readonly graphqlClient: GraphQLClient;

  private readonly metaScheduler: MetaScheduler;

  private readonly providerManager: ProviderManager;

  private readonly credit: Credit;

  private readonly provider: JsonRpcProvider;

  private lock: AsyncLock;

  /**
   * @param privateKey {string} Web3 wallet private that will be used for credit billing
   * @param metaschedulerAddr {string} Address of the metascheduler smart contract
   * @param providerManagerAddr {string} Address of the providerManager smart contract
   * @param creditAddr {string} Address of the credit smart contract
   * @param sbatchServiceEndpoint {string} Endpoint of the sbatch service
   */
  constructor(
    privateKey: string,
    metaschedulerAddr = "0xB95a74d32Fa5C95984406Ca82653cBD6570cb523",
    creditAddr = '0x2FE7ED7941E569697fF856736a88467B8fd569f0',
    providerAddr = "0xB95a74d32Fa5C95984406Ca82653cBD6570cb523",
    sbatchServiceEndpoint = "https://sbatch.deepsquare.run/graphql",
    private loggerClientFactory: () => ILoggerAPIClient = createLoggerClient
  ) {
    this.provider = new JsonRpcProvider("https://testnet.deepsquare.run/rpc", {
      name: "DeepSquare Testnet",
      chainId: 179188,
    });
    this.lock = new AsyncLock();

    // Wallet is optional
    this.metaScheduler = new Contract(metaschedulerAddr, metaSchedulerAbi, this.provider) as MetaScheduler;
    this.providerManager = new Contract(providerAddr, providerManagerAbi, this.provider) as ProviderManager;
    this.credit = new Contract(creditAddr, creditAbi, this.provider) as Credit;

    try {
      this.wallet = new Wallet(privateKey, this.provider);
    } catch (e) {
      console.error('Error creating wallet:', e);
      this.wallet = null;
    }

    if (this.wallet) {
      this.metaScheduler = this.metaScheduler.connect(this.wallet) as MetaScheduler;
      //this.providerManager = this.providerManager.connect(this.wallet) as ProviderManager;
      this.credit = this.credit.connect(this.wallet) as Credit;
    }

    this.graphqlClient = new GraphQLClient(sbatchServiceEndpoint);
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
    if (this.wallet === null) throw new Error("This requires a valid private key");
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
    actualCost: number;
    costPerMin: number;
    timeLeft: number;
  }> {
    let job = await this.metaScheduler.jobs(jobId);
    let currentProvider = null;
    let costPerMin = 0;
    let actualCost = 0;
    let timeLeft = 0;
    try {
      currentProvider = await this.providerManager.getProvider(job.providerAddr.toLowerCase());
      actualCost = computeCost(job, currentProvider);
      costPerMin = computeCostPerMin(job, currentProvider);
      timeLeft = (parseFloat(formatEther(job.cost.maxCost)) - actualCost) / costPerMin
    }
    catch (e) {
      console.log(e)
    }
    return { ...job, actualCost, costPerMin, timeLeft };
  }

  /**
   *  Cancel a job by id
   * @param jobId {string} The job id to cancel.
   */
  async topUp(jobId: string, amount = 1e3) {
    if (this.wallet === null) throw new Error("This requires a valid private key");
    return await this.metaScheduler.topUpJob(jobId, parseUnits((amount).toString(), "ether"))
  }

  /**
   *  Cancel a job by id
   * @param jobId {string} The job id to cancel.
   */
  async cancel(jobId: string) {
    if (this.wallet === null) throw new Error("This requires a valid private key");
    return await this.metaScheduler.cancelJob(jobId)
  }

  /**
   * Get the iterable containing the live logs of given job. Make sure to close the stream with the second function returned once you're done with it.
   * @param jobId {string} The job id from which getting the job
   */
  getLogsMethods(jobId: string): {
    fetchLogs: () => Promise<[AsyncIterable<ReadResponse>, () => void]>;
  } {
    if (this.wallet === null) throw new Error("This requires a valid private key");
    return {
      fetchLogs: () => {
        const service = new GRPCService(this.loggerClientFactory(), this.wallet as Wallet);
        return service.readAndWatch(
          (this.wallet as Wallet).address.toLowerCase(),
          jobId
        );
      },
    };
  }
}
