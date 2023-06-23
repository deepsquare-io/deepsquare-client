import AsyncLock from "async-lock";
import { GraphQLClient } from "graphql-request";
import { MetaSchedulerAbi } from "./abis/MetaScheduler";
import type { Job as GQLJob } from "./graphql/client/generated/graphql";
import { SubmitDocument } from "./graphql/client/generated/graphql";
import { createLoggerClient } from "./grpc/client";
import type { ReadResponse } from "./grpc/generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./grpc/generated/logger/v1alpha1/log.client";
import { GRPCService } from "./grpc/service";
import type {
  Chain,
  Hex,
  PublicClient,
  ReadContractReturnType,
  WalletClient,
} from "viem";
import { createPublicClient, createWalletClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CreditAbi } from "./abis/Credit";
import { ProviderManagerAbi } from "./abis/ProviderManager";
import { JobStatus } from "./types/enums/JobStatus";
import { Job } from "./types/Job";
import { ProviderPrices } from "./types/ProviderPrices";

export function isJobTerminated(status: number): boolean {
  return (
    status === JobStatus.CANCELLED ||
    status === JobStatus.FAILED ||
    status === JobStatus.FINISHED ||
    status === JobStatus.OUT_OF_CREDITS
  );
}

// compute the job current cost (total if job finished)
function computeCost(job: Job, providerPrice: ProviderPrices): bigint {
  return isJobTerminated(job.status)
    ? job.cost.finalCost
    : (BigInt(Math.floor(Date.now() / (1000 * 60))) - job.time.start * 1000n) *
        computeCostPerMin(job, providerPrice);
}

// compute the job costs per minute based on provider price
function computeCostPerMin(job: Job, providerPrice: ProviderPrices): bigint {
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
   * @param privateKey {Hex} Web3 wallet private that will be used for credit billing. If empty, fallback to wallet.
   * @param wallet {WalletClient} Wallet Client coming from a wagmi frontend implementation. If empty, package will only be able to fetch public information
   * @param metaschedulerAddr {string} Address of the metascheduler smart contract.
   * @param sbatchServiceEndpoint {string} Endpoint of the sbatch service.
   * @param publicClient {PublicClient} Public Client for contract reading.
   * @param loggerClientFactory {() => ILoggerAPIClient} Logger client factory.
   */
  private constructor(
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
   * Allow DeepSquare Grid to use $amount of credits to pay for jobs.
   * @param amount The amount to setAllowance.
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
   * @param job The definition of job to send, including storage, environment variables, resources and computing steps. Check the package documentation for further details on the Job type
   * @param jobName The name of the job, limited to 32 characters.
   * @param maxAmount The amount of credit to provide to the requested job
   * @returns {string} The id of the job on the Grid
   */
  async submitJob(
    job: GQLJob,
    jobName: string,
    maxAmount = 1000n
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
            uses: [{ key: "os", value: "linux" }],
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
   *  Get the job information from smarts contracts by id
   * @param jobId {string} The job id to fetch.
   */
  async getJob(jobId: Hex): Promise<
    Job & {
      actualCost: bigint;
      costPerMin: bigint;
      timeLeft: bigint;
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
    return { ...job, actualCost, costPerMin, timeLeft };
  }

  /**
   *  Cancel a job by id
   * @param jobId {Hex} The job id to cancel.
   * @param amount {bigint} The amount to top up.
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
   * Get the iterable containing the live logs of given job. Make sure to close the stream with the second function returned once you're done with it.
   * @param jobId {string} The job id from which getting the job
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
