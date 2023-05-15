import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider, Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import AsyncLock from 'async-lock';
import { Signer } from 'ethers';
import { formatBytes32String, parseUnits } from 'ethers/lib/utils';
import { GraphQLClient } from 'graphql-request';
import {
  IERC20,
  IERC20__factory,
  MetaScheduler,
  MetaScheduler__factory,
} from './contracts';
import type {
  JobCostStructOutput,
  JobDefinitionStructOutput,
  JobTimeStructOutput,
} from './contracts/MetaScheduler';
import type { Job } from './graphql/client/generated/graphql';
import { SubmitDocument } from './graphql/client/generated/graphql';
import { createLoggerClient } from './grpc/client';
import type { ReadResponse } from './grpc/generated/logger/v1alpha1/log';
import { ILoggerAPIClient } from './grpc/generated/logger/v1alpha1/log.client';
import { GRPCService } from './grpc/service';

export default class DeepSquareClient {
  private lock: AsyncLock;

  private constructor(
    private readonly signerOrProvider: Signer | Provider,
    private readonly metaScheduler: MetaScheduler,
    private readonly credit: IERC20,
    private readonly sbatchServiceClient: GraphQLClient,
    private loggerClientFactory: () => ILoggerAPIClient
  ) {
    this.lock = new AsyncLock();
  }

  /**
   * @param privateKey {string} Web3 wallet private that will be used for credit billing. If empty, unauthenticated.
   * @param metaschedulerAddr {string} Address of the metascheduler smart contract.
   * @param sbatchServiceEndpoint {string} Endpoint of the sbatch service.
   * @param jsonRpcProvider {JsonRpcProvider} JsonRpcProvider to a ethereum API.
   * @param loggerClientFactory {() => ILoggerAPIClient} Logger client factory.
   */
  static async build(
    privateKey: string,
    metaschedulerAddr = '0xB95a74d32Fa5C95984406Ca82653cBD6570cb523',
    sbatchServiceEndpoint = 'https://sbatch.deepsquare.run/graphql',
    jsonRpcProvider: JsonRpcProvider = new JsonRpcProvider(
      'https://testnet.deepsquare.run/rpc',
      {
        name: 'DeepSquare Testnet',
        chainId: 179188,
      }
    ),
    loggerClientFactory: () => ILoggerAPIClient = createLoggerClient
  ): Promise<DeepSquareClient> {
    var signerOrProvider: Signer | Provider;
    // Use a authenticated client if there is a key, else don't.
    signerOrProvider = privateKey
      ? new Wallet(privateKey, jsonRpcProvider)
      : jsonRpcProvider;
    const metaScheduler = MetaScheduler__factory.connect(
      metaschedulerAddr,
      signerOrProvider
    );
    const creditAddr = await metaScheduler.credit();
    const credit = IERC20__factory.connect(creditAddr, signerOrProvider);

    return new DeepSquareClient(
      signerOrProvider,
      metaScheduler,
      credit,
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
      parseUnits(amount.toString(), 'ether')
    );
  }

  /**
   * Submit a job to the DeepSquare Grid
   * @param job The definition of job to send, including storage, environment variables, resources and computing steps. Check the package documentation for further details on the Job type
   * @param jobName The name of the job, limited to 32 characters.
   * @returns {string} The id of the job on the Grid
   */
  async submitJob(job: Job, jobName: string, maxAmount = 1e3): Promise<string> {
    if (jobName.length > 32) throw new Error('Job name exceeds 32 characters');
    const hash = await this.sbatchServiceClient.request(SubmitDocument, {
      job,
    });
    return this.lock.acquire('submitJob', async () => {
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
                ? job.output.http.url === 'https://transfer.deepsquare.run/'
                  ? 0
                  : 1
                : 4
              : 4,
            batchLocationHash: hash.submit,
          },
          parseUnits(maxAmount.toString(), 'ether'),
          formatBytes32String(jobName),
          true
        )
      ).wait();
      //console.log(job_output.events as [])
      //console.log(job_output.events![1] as {})
      const event = job_output.events!.filter(
        (event) => event.event === 'NewJobRequestEvent'
      )![0];
      return event.args![0] as string;
    });
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
    return await this.metaScheduler.cancelJob(jobId);
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
        if (!(this.signerOrProvider instanceof Signer)) {
          throw new Error('provider is not a signer');
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
