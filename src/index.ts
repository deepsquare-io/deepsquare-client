import type { Provider } from "@ethersproject/providers";
import { JsonRpcProvider } from "@ethersproject/providers";
import AsyncLock from "async-lock";
import type { BigNumber } from "ethers";
import { Signer, Wallet } from "ethers";
import { formatBytes32String, parseUnits } from "ethers/lib/utils";
import { GraphQLClient } from "graphql-request";
import type { IERC20 } from "./contracts";
import {
  IERC20__factory,
  IProviderManager__factory,
  MetaScheduler__factory,
} from "./contracts";
import type {
  IProviderManager,
  ProviderPricesStruct,
} from "./contracts/IProviderManager";
import type {
  JobCostStructOutput,
  JobDefinitionStructOutput,
  JobTimeStructOutput,
  MetaScheduler,
} from "./contracts/MetaScheduler";
import type { Job as GQLJob } from "./graphql/client/generated/graphql";
import { SubmitDocument } from "./graphql/client/generated/graphql";
import { createLoggerClient } from "./grpc/client";
import type { ReadResponse } from "./grpc/generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./grpc/generated/logger/v1alpha1/log.client";
import { GRPCService } from "./grpc/service";

export type Job = {
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
};

export enum JobStatus {
  PENDING = 0,
  META_SCHEDULED = 1,
  SCHEDULED = 2,
  RUNNING = 3,
  CANCELLED = 4,
  FINISHED = 5,
  FAILED = 6,
  OUT_OF_CREDITS = 7,
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
function computeCost(job: Job, providerPrice: ProviderPricesStruct): bigint {
  return isJobTerminated(job.status)
    ? job.cost.finalCost.toBigInt()
    : (BigInt(Math.floor(Date.now() / (1000 * 60))) -
      job.time.start.toBigInt() * 1000n) *
    computeCostPerMin(job, providerPrice);
}

// compute the job costs per minute based on provider price
function computeCostPerMin(
  job: Job,
  providerPrice: ProviderPricesStruct
): bigint {
  const tasks = job.definition.ntasks.toBigInt();
  const gpuCost =
    job.definition.gpuPerTask.toBigInt() *
    (providerPrice.gpuPricePerMin as BigNumber).toBigInt();
  const cpuCost =
    job.definition.cpuPerTask.toBigInt() *
    (providerPrice.cpuPricePerMin as BigNumber).toBigInt();
  const memCost =
    job.definition.memPerCpu.toBigInt() *
    job.definition.cpuPerTask.toBigInt() *
    (providerPrice.memPricePerMin as BigNumber).toBigInt();
  return (tasks * (gpuCost + cpuCost + memCost)) / 1000000n;
}

export default class DeepSquareClient {
  private lock = new AsyncLock();

  private constructor(
    private readonly signerOrProvider: Signer | Provider,
    private readonly metaScheduler: MetaScheduler,
    private readonly credit: IERC20,
    private readonly providerManager: IProviderManager,
    private readonly sbatchServiceClient: GraphQLClient,
    private loggerClientFactory: (loggerEndpoint: string) => ILoggerAPIClient
  ) { }

  /**
   * @param privateKey {string} Web3 wallet private that will be used for credit billing. If empty, unauthenticated.
   * @param metaschedulerAddr {string} Address of the metascheduler smart contract.
   * @param sbatchServiceEndpoint {string} Endpoint of the sbatch service.
   * @param jsonRpcProvider {JsonRpcProvider} JsonRpcProvider to a ethereum API.
   * @param loggerClientFactory {() => ILoggerAPIClient} Logger client factory.
   */
  static async build(
    privateKey: string,
    metaschedulerAddr = "0xB95a74d32Fa5C95984406Ca82653cBD6570cb523",
    sbatchServiceEndpoint = "https://sbatch.deepsquare.run/graphql",
    jsonRpcProvider: JsonRpcProvider = new JsonRpcProvider(
      "https://testnet.deepsquare.run/rpc",
      {
        name: "DeepSquare Testnet",
        chainId: 179188,
      }
    ),
    loggerClientFactory: (loggerEndpoint: string) => ILoggerAPIClient = createLoggerClient
  ): Promise<DeepSquareClient> {
    // Use a authenticated client if there is a key, else don't.
    const signerOrProvider = privateKey
      ? new Wallet(privateKey, jsonRpcProvider)
      : jsonRpcProvider;
    const metaScheduler = MetaScheduler__factory.connect(
      metaschedulerAddr,
      signerOrProvider
    );
    const creditAddr = await metaScheduler.credit();
    const credit = IERC20__factory.connect(creditAddr, signerOrProvider);

    const providerAddr = await metaScheduler.providerManager();
    const providerManager = IProviderManager__factory.connect(
      providerAddr,
      signerOrProvider
    );

    return new DeepSquareClient(
      signerOrProvider,
      metaScheduler,
      credit,
      providerManager,
      new GraphQLClient(sbatchServiceEndpoint),
      loggerClientFactory
    );
  }

  /**
   * Allow DeepSquare Grid to use $amount of credits to pay for jobs.
   * @param amount The amount to setAllowance.
   */
  async setAllowance(amount: BigNumber) {
    await this.credit.approve(
      this.metaScheduler.address,
      parseUnits(amount.toString(), "ether")
    );
  }

  /**
   * Submit a job to the DeepSquare Grid
   * @param job The definition of job to send, including storage, environment variables, resources and computing steps. Check the package documentation for further details on the Job type
   * @param jobName The name of the job, limited to 32 characters.
   * @returns {string} The id of the job on the Grid
   */
  async submitJob(
    job: GQLJob,
    jobName: string,
    maxAmount = 1e3,
    uses = []
  ): Promise<string> {
    if (!(this.signerOrProvider instanceof Signer)) {
      throw new Error("provider is not a signer");
    }
    if (jobName.length > 32) throw new Error("Job name exceeds 32 characters");
    const hash = await this.sbatchServiceClient.request(SubmitDocument, {
      job,
    });
    return this.lock.acquire("submitJob", async () => {
      const job_output = await (
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
            uses: uses,
          },
          parseUnits(maxAmount.toString(), "ether"),
          formatBytes32String(jobName),
          true
        )
      ).wait();
      const event = job_output.events!.filter(
        (event) => event.event === "NewJobRequestEvent"
      )![0];
      return event.args![0] as string;
    });
  }

  /**
   *  Get the job information from smarts contracts by id
   * @param jobId {string} The job id to fetch.
   */
  async getJob(jobId: string): Promise<
    Job & {
      actualCost: bigint;
      costPerMin: bigint;
      timeLeft: bigint;
    }
  > {
    const job = await this.metaScheduler.jobs(jobId);
    let providerPrices: ProviderPricesStruct;
    let costPerMin = 0n;
    let actualCost = 0n;
    let timeLeft = 0n;
    try {
      providerPrices = await this.providerManager.getProviderPrices(
        job.providerAddr.toLowerCase()
      );
      actualCost = computeCost(job, providerPrices);
      costPerMin = computeCostPerMin(job, providerPrices);
      timeLeft = (job.cost.maxCost.toBigInt() - actualCost) / costPerMin;
    } catch (e) {
      console.warn(e);
    }
    return { ...job, actualCost, costPerMin, timeLeft };
  }

  /**
   *  Cancel a job by id
   * @param jobId {string} The job id to cancel.
   */
  async topUp(jobId: string, amount = 1e3) {
    if (!(this.signerOrProvider instanceof Signer)) {
      throw new Error("provider is not a signer");
    }
    return await this.metaScheduler.topUpJob(
      jobId,
      parseUnits(amount.toString(), "ether")
    );
  }

  /**
   *  Cancel a job by id
   * @param jobId {string} The job id to cancel.
   */
  async cancel(jobId: string) {
    if (!(this.signerOrProvider instanceof Signer)) {
      throw new Error("provider is not a signer");
    }
    return await this.metaScheduler.cancelJob(jobId);
  }

  /**
   * Get the iterable containing the live logs of given job. Make sure to close the stream with the second function returned once you're done with it.
   * @param jobId {string} The job id from which getting the job
   */
  getLogsMethods(jobId: string, loggerEndpoint = "grid-logger.deepsquare.run:443"): {
    fetchLogs: () => Promise<[AsyncIterable<ReadResponse>, () => void]>;
  } {
    return {
      fetchLogs: async () => {
        if (!(this.signerOrProvider instanceof Signer)) {
          throw new Error("provider is not a signer");
        }
        const service = new GRPCService(
          this.loggerClientFactory(loggerEndpoint),
          this.signerOrProvider
        );
        const address = await this.signerOrProvider.getAddress();
        return service.readAndWatch(address, jobId);
      },
    };
  }
}
