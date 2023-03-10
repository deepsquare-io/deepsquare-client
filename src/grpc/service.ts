import { arrayify } from '@ethersproject/bytes';
import { ReadResponse } from "./generated/logger/v1alpha1/log";
import { ILoggerAPIClient, LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";
import { Wallet } from '@ethersproject/wallet';

export class GRPCService {
  constructor(private loggerClient: ILoggerAPIClient, private wallet: Wallet) {
  }

  async readAndWatch(address: string, logName: string): Promise<[AsyncIterable<ReadResponse>, () => void]> {
    const abortReadAndWatch = new AbortController();
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
        abort: abortReadAndWatch.signal,
        timeout: 3_600_000, // 1h
      },
    );
    return [responses, () => {
      if (abortReadAndWatch !== null) {
        abortReadAndWatch.abort();
      }
    }
    ]
  }
}
