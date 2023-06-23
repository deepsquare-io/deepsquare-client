import AsyncLock from "async-lock";
import { GraphQLClient } from "graphql-request";
import { MetaSchedulerAbi } from "./abis/MetaScheduler";
import type { Job as GQLJob } from "./graphql/client/generated/graphql";
import { SubmitDocument } from "./graphql/client/generated/graphql";
import { createLoggerClient } from "./grpc/client";
import type { ReadResponse } from "./grpc/generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./grpc/generated/logger/v1alpha1/log.client";
import { GRPCService } from "./grpc/service";
import type { Chain, Hex, PublicClient, WalletClient } from "viem";
import { createPublicClient, createWalletClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CreditAbi } from "./abis/Credit";
import { ProviderManagerAbi } from "./abis/ProviderManager";
import { JobStatus } from "./types/enums/JobStatus";
import { Job } from "./types/Job";
import { ProviderPrices } from "./types/ProviderPrices";
import { Label } from "./types/Label";

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
  return BigInt(Math.floor(Date.now() / 1000)) - job.time.start / 60n;
}

/**
 * Computes the current cost of a job.
 *
 * If the job has already been terminated, it returns the final cost of the job. Otherwise, it calculates
 * the current cost based on the time elapsed since the start of the job and the cost per minute.
 *
 * @param {Job} job - The job object. It includes properties such as the status and the cost of the job.
 * @param {ProviderPrices} providerPrice - The pricing structure of the provider. It contains
 *   the pricing details needed to compute the cost per minute of the job.
 *
 * @returns The current cost of the job. It's expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */ function computeCost(job: Job, providerPrice: ProviderPrices): bigint {
  return isJobTerminated(job.status)
    ? job.cost.finalCost
    : jobDurationInMinutes(job) * computeCostPerMin(job, providerPrice);
}

/**
 * Computes the cost per minute for a given job.
 *
 * The cost per minute is calculated based on the provider's price and the resources required by the job,
 * which include the number of tasks, GPU per task, CPU per task, and memory per CPU.
 *
 * @param {Job} job - The job object, which contains the resource requirements per task.
 * @param {ProviderPrices} providerPrice - The pricing structure of the provider. It includes the
 *   prices for GPU, CPU, and memory per minute.
 *
 * @returns The cost per minute for the job, expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */ function computeCostPerMin(
  job: Job,
  providerPrice: ProviderPrices
): bigint {
  const tasks = job.definition.ntasks;
  const gpuCost = job.definition.gpuPerTask * providerPrice.gpuPricePerMin;
  const cpuCost = job.definition.cpuPerTask * providerPrice.cpuPricePerMin;
  const memCost =
    job.definition.memPerCpu *
    job.definition.cpuPerTask *
    providerPrice.memPricePerMin;
  return (tasks * (gpuCost + cpuCost + memCost)) / 1000000n;
}

export const deepSquareChain = {
  id: 179188,
  name: "DeepSquare Mainnet C-Chain",
  network: "deepsquare testnet",
  nativeCurrency: {
    name: "Square",
    symbol: "SQUARE",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://testnet.deepsquare.run/rpc"] },
    default: { http: ["https://testnet.deepsquare.run/rpc"] },
  },
  blockExplorers: {
    default: {
      name: "DeepTrace",
      url: "https://https://deeptrace.deepsquare.run/",
    },
  },
  contracts: {
    multicall3: {
      address: "0xad25E3e89e005EE6b1d9a4723DE82b2D591779d2",
      blockCreated: 38009,
    },
  },
} as const satisfies Chain;

export default class DeepSquareClient {
  private lock = new AsyncLock();
  private readonly wallet?: WalletClient;
  private readonly publicClient: PublicClient;
  private readonly metaSchedulerAddr: Hex;
  private creditAddr?: Hex;
  private providerManagerAddr?: Hex;
  private readonly sbatchServiceClient: GraphQLClient;
  private loggerClientFactory: () => ILoggerAPIClient;

  /**
   * Creates an instance of DeepSquareClient.
   * @param privateKey {Hex} Web3 wallet private that will be used for credit billing. If empty, fallback to wallet.
   * @param wallet {WalletClient} Wallet Client coming from a wagmi frontend implementation. If empty, package will only be able to fetch public information
   * @param metaschedulerAddr {string} Address of the metascheduler smart contract.
   * @param sbatchServiceEndpoint {string} Endpoint of the sbatch service.
   * @param publicClient {PublicClient} Public Client for contract reading.
   * @param loggerClientFactory {() => ILoggerAPIClient} Logger client factory.
   */
  constructor(
    privateKey?: Hex,
    wallet?: WalletClient,
    metaschedulerAddr: Hex = "0xB95a74d32Fa5C95984406Ca82653cBD6570cb523",
    sbatchServiceEndpoint = "https://sbatch.deepsquare.run/graphql",
    publicClient: PublicClient = createPublicClient({
      transport: http("https://testnet.deepsquare.run/rpc"),
      chain: deepSquareChain,
    }),
    loggerClientFactory: () => ILoggerAPIClient = createLoggerClient
  ) {
    this.publicClient = publicClient;
    if (privateKey) {
      this.wallet = createWalletClient({
        account: privateKeyToAccount(privateKey),
        chain: deepSquareChain,
        transport: http("https://testnet.deepsquare.run/rpc"),
      });
    } else {
      this.wallet = wallet;
    }
    this.sbatchServiceClient = new GraphQLClient(sbatchServiceEndpoint);
    this.loggerClientFactory = loggerClientFactory;
    this.metaSchedulerAddr = metaschedulerAddr;
  }

  /**
   * This method allows the DeepSquare Grid to consume a specific amount of credits from the client's
   * account for running jobs. The credits act as the payment medium for the computational resources used.
   *
   * @param {bigint} amount - The amount of credits the client approves to be used for job execution.
   *   This amount is represented as a BigNumber, which helps handle very large numbers safely in JavaScript.
   *
   * Note: Be aware that the amount is in the smallest unit of the currency, like wei for Ethereum.
   *
   * The approval is given to the MetaScheduler smart contract, which manages the job execution on the Grid.
   */
  async setAllowance(amount: bigint) {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute write operations"
      );
    }
    if (!this.creditAddr) {
      this.creditAddr = await this.publicClient.readContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        functionName: "credit",
      });
    }
    const [address] = await this.wallet.getAddresses();

    const { request } = await this.publicClient.simulateContract({
      address: this.creditAddr,
      abi: CreditAbi,
      functionName: "approve",
      account: address,
      args: [this.metaSchedulerAddr, amount],
    });

    await this.wallet.writeContract(request);
  }

  /**
   * Submit a job to the DeepSquare Grid
   * @param {GQLJob} job The job object containing details like storage, environment variables, resources and computing steps.
   * @param {string} jobName The name of the job. It must be a maximum of 32 characters long.
   * @param {number} maxAmount The maximum cost that can be incurred for the execution of the job. Default is 1000.
   * @param {Label} uses Optional labels used for example to select providers or to pass arbitrary data to the job.
   * @returns {Hex} The id of the job on the Grid
   */
  async submitJob(
    job: GQLJob,
    jobName: string,
    maxAmount = 1000n,
    uses: Label[] = []
  ): Promise<Hex> {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute write operations"
      );
    }

    if (jobName.length > 32) throw new Error("Job name exceeds 32 characters");

    const hash = await this.sbatchServiceClient.request(SubmitDocument, {
      job,
    });

    const [address] = await this.wallet.getAddresses();

    return this.lock.acquire("submitJob", async () => {
      const { request, result } = await this.publicClient.simulateContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        functionName: "requestNewJob",
        account: address,
        args: [
          {
            ntasks: BigInt(job.resources.tasks),
            gpuPerTask: BigInt(job.resources.gpusPerTask),
            cpuPerTask: BigInt(job.resources.cpusPerTask),
            memPerCpu: BigInt(job.resources.memPerCpu),
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
          toHex(jobName),
          true,
        ],
      });

      await this.wallet?.writeContract(request);

      return result;
    });
  }

  /**
   * Fetches the details of a job from smart contracts based on the job ID. The details include actual cost, cost per minute and time left.
   *
   * @param jobId - The ID of the job that needs to be fetched.
   *
   * @returns Returns a Promise that resolves to an object containing job details and its cost parameters.
   */
  async getJob(jobId: Hex): Promise<
    Job & {
      actualCost: bigint;
      costPerMin: bigint;
      timeLeft: bigint;
      duration: bigint;
    }
  > {
    if (!this.providerManagerAddr) {
      this.providerManagerAddr = await this.publicClient.readContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        functionName: "providerManager",
      });
    }

    const job = await this.publicClient.readContract({
      address: this.metaSchedulerAddr,
      abi: MetaSchedulerAbi,
      functionName: "getJob",
      args: [jobId],
    });

    let costPerMin = 0n;
    let actualCost = 0n;
    let timeLeft = 0n;
    const duration = jobDurationInMinutes(job);

    try {
      const providerPrices = await this.publicClient.readContract({
        address: this.providerManagerAddr,
        abi: ProviderManagerAbi,
        functionName: "getProviderPrices",
        args: [job.providerAddr],
      });
      actualCost = computeCost(job, providerPrices);
      costPerMin = computeCostPerMin(job, providerPrices);
      timeLeft = (job.cost.maxCost - actualCost) / costPerMin;
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
   * @return {Hex} Returns the hash of the top up transaction.
   */
  async topUp(jobId: Hex, amount = 1000n) {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute write operations"
      );
    }

    const { request } = await this.publicClient.simulateContract({
      address: this.metaSchedulerAddr,
      abi: MetaSchedulerAbi,
      functionName: "topUpJob",
      args: [jobId, amount],
    });

    return await this.wallet.writeContract(request);
  }

  /**
   *  Cancel a job by id
   * @param jobId {Hex} The job id to cancel.
   * @return {Hex} The hash of the cancel transaction.
   */
  async cancel(jobId: Hex) {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute write operations"
      );
    }

    const { request } = await this.publicClient.simulateContract({
      address: this.metaSchedulerAddr,
      abi: MetaSchedulerAbi,
      functionName: "cancelJob",
      args: [jobId],
    });

    return await this.wallet.writeContract(request);
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
        if (!this.wallet) {
          throw new Error(
            "Client has been instanced without wallet client and is therefore unable to execute write operations"
          );
        }
        const service = new GRPCService(
          this.loggerClientFactory(),
          this.wallet
        );
        const [address] = await this.wallet.getAddresses();
        return service.readAndWatch(address, jobId);
      },
    };
  }
}
