import { arrayify } from '@ethersproject/bytes';
import type { JsonRpcProvider } from '@ethersproject/providers';
import { LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";
import { ReadResponse } from "./generated/logger/v1alpha1/log";
import { Wallet } from '@ethersproject/wallet';

export class GRPCService {
  private abortReadAndWatch: AbortController | null = null;

  constructor(private loggerClient: LoggerAPIClient, private provider: JsonRpcProvider, private wallet: Wallet) { }

  async readAndWatch(address: string, logName: string): Promise<AsyncIterable<ReadResponse>> {
    this.abortReadAndWatch = new AbortController();
    const timestamp = Date.now();
    const msg = `read:${address.toLowerCase()}/${logName}/${timestamp}`;
    const signedHash: string = await this.wallet.signMessage(msg);


    const { responses } = this.loggerClient.read(
      {
        address: address,
        logName: logName,
        timestamp: BigInt(timestamp),
        signedHash: arrayify(signedHash),
      },
      {
        abort: this.abortReadAndWatch.signal,
        timeout: 3_600_000, // 1h
      },
    );
    return responses;
  }

  stopReadAndWatch() {
    if (this.abortReadAndWatch !== null) {
      this.abortReadAndWatch.abort();
      this.abortReadAndWatch = null;
    }
  }
}
