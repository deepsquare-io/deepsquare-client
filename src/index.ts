import AsyncLock from "async-lock";
import { GraphQLClient } from "graphql-request";
import type { Chain, Hex, PublicClient, WalletClient } from "viem";
import { createPublicClient, createWalletClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CreditAbi } from "./abis/Credit";
import { JobRepositoryAbi } from "./abis/JobRepository";
import { MetaSchedulerAbi } from "./abis/MetaScheduler";
import { ProviderManagerAbi } from "./abis/ProviderManager";
import type { Job as GQLJob } from "./graphql/client/generated/graphql";
import { SubmitDocument } from "./graphql/client/generated/graphql";
import { createLoggerClient } from "./grpc/client";
import type { ReadResponse } from "./grpc/generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./grpc/generated/logger/v1alpha1/log.client";
import { GRPCService } from "./grpc/service";
import type { JobSummary } from "./types/JobSummary";
import type { Label } from "./types/Label";
import { JobStatus } from "./types/enums/JobStatus";
import { computeCost } from "./utils/computeCost";
import { computeCostPerMin } from "./utils/computeCostPerMin";
import { isJobTerminated } from "./utils/isJobTerminated";

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

export { JobStatus, computeCost, computeCostPerMin, isJobTerminated };

export default class DeepSquareClient {
  private lock = new AsyncLock();
  private readonly wallet?: WalletClient;
  private readonly publicClient: PublicClient;
  private readonly metaSchedulerAddr: Hex;
  private creditAddr?: Hex;
  private providerManagerAddr?: Hex;
  private jobRepositoryAddr?: Hex;
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
    privateKey: Hex | undefined = undefined,
    wallet: WalletClient | undefined = undefined,
    metaschedulerAddr: Hex = "0x196A7EB3E16a8359c30408f4F79622157Ef86d7c",
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
   * Lazy load credit contract address
   */
  async shouldLoadCredit() {
    if (!this.creditAddr) {
      this.creditAddr = await this.publicClient.readContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        functionName: "credit",
      });
    }
  }

  /**
   * Lazy load provider manager contract address
   */
  async shouldLoadProviderManager() {
    if (!this.providerManagerAddr) {
      this.providerManagerAddr = await this.publicClient.readContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        functionName: "providerManager",
      });
    }
  }

  /**
   * Lazy load job repository contract address
   */
  async shouldLoadJobRepository() {
    if (!this.jobRepositoryAddr) {
      this.jobRepositoryAddr = await this.publicClient.readContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        functionName: "jobs",
      });
    }
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

    await this.shouldLoadCredit();

    const { request } = await this.publicClient.simulateContract({
      address: this.creditAddr!,
      abi: CreditAbi,
      account: this.wallet.account,
      functionName: "approve",
      args: [this.metaSchedulerAddr, amount],
    });

    await this.wallet.writeContract(request);
  }

  /**
   * This method fetches the amount of credits allowed to be used by the DeepSquare Grid from the client's
   * account for running jobs. The credits act as the payment medium for the computational resources used.
   *
   * @returns {bigint} The amount of credits the client approved to be used for job executions.
   *
   * Note: Be aware that the amount is in the smallest unit of the currency, like wei for Ethereum.
   */
  async getAllowance(): Promise<bigint> {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute 'self-read' operations"
      );
    }

    await this.shouldLoadCredit();

    return this.publicClient.readContract({
      address: this.creditAddr!,
      abi: CreditAbi,
      account: this.wallet.account,
      functionName: "allowance",
      args: [this.wallet.account!.address, this.metaSchedulerAddr],
    });
  }

  /**
   * This method fetches the balance of the client's account.
   * The credits act as the payment medium for the computational resources used.
   *
   * @returns {bigint} The amount of credits of the client.
   *
   * Note: Be aware that the amount is in the smallest unit of the currency, like wei for Ethereum.
   */
  async getBalance(): Promise<bigint> {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute 'self-read' operations"
      );
    }

    return this.getBalanceOf(this.wallet.account!.address);
  }

  /**
   * This method fetches the balance of one account.
   * The credits act as the payment medium for the computational resources used.
   *
   * @param {Hex} address The address of the user's balance.
   * @returns {bigint} The amount of credits of one account.
   *
   * Note: Be aware that the amount is in the smallest unit of the currency, like wei for Ethereum.
   */
  async getBalanceOf(address: Hex): Promise<bigint> {
    await this.shouldLoadCredit();

    return this.publicClient.readContract({
      address: this.creditAddr!,
      abi: CreditAbi,
      functionName: "balanceOf",
      args: [address],
    });
  }

  /**
   * Tranfer credits from the user's account to another.
   *
   * @param {Hex} to The recipient address.
   * @param {bigint} amount The amount of credits in wei. (1 credits = 1e18 wei)
   */
  async transferCredits(to: Hex, amount: bigint) {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute 'self-read' operations"
      );
    }

    const { request } = await this.publicClient.simulateContract({
      address: this.creditAddr!,
      abi: CreditAbi,
      account: this.wallet.account,
      functionName: "transfer",
      args: [to, amount],
    });

    await this.wallet.writeContract(request);
  }

  /**
   * Submit a job to the DeepSquare Grid
   * @param {GQLJob} job The job object containing details like storage, environment variables, resources and computing steps.
   * @param {string} jobName The name of the job. It must be a maximum of 32 characters long.
   * @param {bigint} maxAmount The maximum cost that can be incurred for the execution of the job. Default is 1000.
   * @param {Label[]} uses Optional labels used for example to select providers or to pass arbitrary data to the job.
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

    return this.lock.acquire("submitJob", async () => {
      const { request, result } = await this.publicClient.simulateContract({
        address: this.metaSchedulerAddr,
        abi: MetaSchedulerAbi,
        account: this.wallet?.account,
        functionName: "requestNewJob",
        args: [
          {
            ntasks: BigInt(job.resources.tasks),
            gpusPerTask: BigInt(job.resources.gpusPerTask),
            cpusPerTask: BigInt(job.resources.cpusPerTask),
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
            affinity: [],
          },
          maxAmount,
          toHex(jobName, { size: 32 }),
          true,
        ],
      });

      await this.wallet?.writeContract(request);

      return result;
    });
  }

  /**
   * Fetch all job IDs ran by given wallet
   *
   * @param walletAddress  - The wallet address from which fetch job IDs
   *
   * @returns Returns job IDs in hexadecimal.
   */
  async listJob(walletAddress: Hex): Promise<readonly Hex[]> {
    await this.shouldLoadJobRepository();

    return this.publicClient.readContract({
      address: this.jobRepositoryAddr!,
      abi: JobRepositoryAbi,
      functionName: "getByCustomer",
      args: [walletAddress],
    });
  }

  /**
   * Fetches the details of a job from smart contracts based on the job ID.
   *
   * @param jobId - The ID of the job that needs to be fetched.
   *
   * @returns Returns a Promise that resolves to an object containing job details and its cost parameters. Provider property will not
   * be defined if the job has not been scheduled.
   */
  async getJob(jobId: Hex): Promise<JobSummary> {
    await this.shouldLoadProviderManager();
    await this.shouldLoadJobRepository();

    const job = await this.publicClient.readContract({
      address: this.jobRepositoryAddr!,
      abi: JobRepositoryAbi,
      functionName: "get",
      args: [jobId],
    });

    const provider = await this.publicClient.readContract({
      address: this.providerManagerAddr!,
      abi: ProviderManagerAbi,
      functionName: "getProvider",
      args: [job.providerAddr],
    });

    return { ...job, provider };
  }

  /**
   * Fetches the list of jobs of the user.
   */
  async *getJobs(): AsyncGenerator<JobSummary> {
    if (!this.wallet) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute 'self' operations"
      );
    }

    await this.shouldLoadJobRepository();

    const jobs = await this.publicClient.readContract({
      address: this.jobRepositoryAddr!,
      abi: JobRepositoryAbi,
      functionName: "getByCustomer",
      args: [this.wallet.account!.address],
    });

    for (const jobId of jobs) {
      yield await this.getJob(jobId);
    }
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
      account: this.wallet.account,
      functionName: "topUpJob",
      args: [jobId, amount],
    });

    return await this.wallet.writeContract(request);
  }

  /**
   *  Cancel a job by id
   * @param {Hex} jobId The job id to cancel.
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
      account: this.wallet.account,
      functionName: "cancelJob",
      args: [jobId],
    });

    return await this.wallet.writeContract(request);
  }

  /**
   * Get the hash message to send to the grpc service in order to fetch the logs.
   *
   * @param jobId - The ID of the job for which one need the logs.
   *
   * @returns The hash of the job.
   */
  async getJobHash(jobId: string): Promise<{ hash: Hex; timestamp: number }> {
    if (!this.wallet || !this.wallet.account) {
      throw new Error(
        "Client has been instanced without wallet client and is therefore unable to execute signing operations"
      );
    }
    const timestamp = Date.now();
    const message = `read:${this.wallet.account.address.toLowerCase()}/${jobId}/${timestamp}`;
    return {
      hash: await this.wallet.signMessage({
        account: this.wallet.account,
        message,
      }),
      timestamp,
    };
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
        if (!this.wallet || !this.wallet.account) {
          throw new Error(
            "Client has been instanced without wallet client and is therefore unable to execute write operations"
          );
        }

        const service = new GRPCService(this.loggerClientFactory());

        const { hash, timestamp } = await this.getJobHash(jobId);

        return service.readAndWatch(
          this.wallet.account.address,
          jobId,
          hash,
          timestamp
        );
      },
    };
  }
}
