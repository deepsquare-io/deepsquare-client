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

export { createDevLoggerClient } from "./grpc/client";

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

/**
 * Checks if the job status indicates it has terminated.
 * @param {number} status - The status of the job.
 * @return {boolean} - True if job has terminated, False otherwise.
 */
export function isJobTerminated(status: number): boolean {
  return (
    status === JobStatus.CANCELLED ||
    status === JobStatus.FAILED ||
    status === JobStatus.FINISHED ||
    status === JobStatus.OUT_OF_CREDITS
  );
}

function jobDurationInMinutes(job: Job): bigint {
  return (
    BigInt(Math.floor(Date.now() / 1000)) - job.time.start.toBigInt() / 60n
  );
}

/**
 * Computes the current cost of a job.
 *
 * If the job has already been terminated, it returns the final cost of the job. Otherwise, it calculates
 * the current cost based on the time elapsed since the start of the job and the cost per minute.
 *
 * @param {Job} job - The job object. It includes properties such as the status and the cost of the job.
 * @param {ProviderPricesStruct} providerPrice - The pricing structure of the provider. It contains
 *   the pricing details needed to compute the cost per minute of the job.
 *
 * @returns The current cost of the job. It's expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */
function computeCost(job: Job, providerPrice: ProviderPricesStruct): bigint {
  return isJobTerminated(job.status)
    ? job.cost.finalCost.toBigInt()
    : jobDurationInMinutes(job) * computeCostPerMin(job, providerPrice);
}

/**
 * Computes the cost per minute for a given job.
 *
 * The cost per minute is calculated based on the provider's price and the resources required by the job,
 * which include the number of tasks, GPU per task, CPU per task, and memory per CPU.
 *
 * @param {Job} job - The job object, which contains the resource requirements per task.
 * @param {ProviderPricesStruct} providerPrice - The pricing structure of the provider. It includes the
 *   prices for GPU, CPU, and memory per minute.
 *
 * @returns The cost per minute for the job, expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */
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
  const total = tasks * (gpuCost + cpuCost + memCost);
  return total;
}

export default class DeepSquareClient {
  private lock = new AsyncLock();

  /**
   * Creates an instance of DeepSquareClient.
   * @param signerOrProvider - The signer or provider that will sign the transactions.
   * @param metaScheduler - The MetaScheduler contract.
   * @param credit - The credit contract.
   * @param providerManager - The ProviderManager contract.
   * @param sbatchServiceClient - The SBatch Service GraphQL client.
   * @param loggerClientFactory - The logger client factory.
   */
  private constructor(
    private readonly signerOrProvider: Signer | Provider,
    private readonly metaScheduler: MetaScheduler,
    private readonly credit: IERC20,
    private readonly providerManager: IProviderManager,
    private readonly sbatchServiceClient: GraphQLClient,
    private loggerClientFactory: () => ILoggerAPIClient
  ) {}

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
    loggerClientFactory: () => ILoggerAPIClient = createLoggerClient
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
   * This method allows the DeepSquare Grid to consume a specific amount of credits from the client's
   * account for running jobs. The credits act as the payment medium for the computational resources used.
   *
   * @param {BigNumber} amount - The amount of credits the client approves to be used for job execution.
   *   This amount is represented as a BigNumber, which helps handle very large numbers safely in JavaScript.
   *
   * Note: Be aware that the amount is in the smallest unit of the currency, like wei for Ethereum.
   *
   * The approval is given to the MetaScheduler smart contract, which manages the job execution on the Grid.
   */
  async setAllowance(amount: BigNumber) {
    await this.credit.approve(
      this.metaScheduler.address,
      parseUnits(amount.toString(), "ether")
    );
  }

  /**
   * This method is used to submit a job to the DeepSquare Grid. It requires job details, job name and maximum amount for execution.
   *
   * @param {GQLJob} job - The job object containing details like storage, environment variables, resources and computing steps.
   * @param {string} jobName - The name of the job. It must be a maximum of 32 characters long.
   * @param {number} maxAmount - The maximum cost that can be incurred for the execution of the job. Default is 1000.
   *
   * @returns {Promise<string>} Returns a Promise that resolves to the Job ID on the grid.
   */
  async submitJob(
    job: GQLJob,
    jobName: string,
    maxAmount = parseUnits("1e3", "ether"),
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
          maxAmount,
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
   * Fetches the details of a job from smart contracts based on the job ID. The details include actual cost, cost per minute and time left.
   *
   * @param jobId - The ID of the job that needs to be fetched.
   *
   * @returns Returns a Promise that resolves to an object containing job details and its cost parameters.
   */
  async getJob(jobId: string): Promise<
    Job & {
      actualCost: bigint;
      costPerMin: bigint;
      timeLeft: bigint;
      duration: bigint;
    }
  > {
    const job = await this.metaScheduler.jobs(jobId);
    let providerPrices: ProviderPricesStruct;
    let costPerMin = 0n;
    let actualCost = 0n;
    let timeLeft = 0n;
    const duration = jobDurationInMinutes(job);
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
    return { ...job, actualCost, costPerMin, timeLeft, duration };
  }

  /**
   * Add additional credits to a running job. This can be helpful when a job is close to consuming its maximum allocated credits.
   *
   * @param jobId - The ID of the job to which credits are being added.
   * @param amount - The amount of credits to be added. Default is 1000.
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
   * Cancels an ongoing job by its ID.
   *
   * @param jobId - The ID of the job to be cancelled.
   */
  async cancel(jobId: string) {
    if (!(this.signerOrProvider instanceof Signer)) {
      throw new Error("provider is not a signer");
    }
    return await this.metaScheduler.cancelJob(jobId);
  }

  /**
   * Provides a method to fetch live logs of a given job. This method returns an object which contains the 'fetchLogs' function.
   * The 'fetchLogs' function, when invoked, returns an async iterable to read logs and a function to close the stream. It is important
   * to invoke the function to close the stream once you're done using it.
   *
   * @param jobId - The ID of the job for which logs are to be fetched.
   *
   * @returns Returns an object with a 'fetchLogs' method for accessing job logs. The 'fetchLogs' function returns a Promise that resolves to an async iterable for log access and a function to close the stream.
   */
  getLogsMethods(jobId: string): {
    fetchLogs: () => Promise<[AsyncIterable<ReadResponse>, () => void]>;
  } {
    return {
      fetchLogs: async () => {
        if (!(this.signerOrProvider instanceof Signer)) {
          throw new Error("provider is not a signer");
        }
        const service = new GRPCService(
          this.loggerClientFactory(),
          this.signerOrProvider
        );
        const address = await this.signerOrProvider.getAddress();
        return service.readAndWatch(address, jobId);
      },
    };
  }
}
