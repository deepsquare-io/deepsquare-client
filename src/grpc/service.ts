import type { ReadResponse } from "./generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./generated/logger/v1alpha1/log.client";
import type { Account, Hex, WalletClient } from "viem";
import { fromHex } from "viem";

export class GRPCService {
  constructor(
    private loggerClient: ILoggerAPIClient,
    private wallet: WalletClient
  ) {}

  async readAndWatch(
    account: Account,
    logName: string
  ): Promise<[AsyncIterable<ReadResponse>, () => void]> {
    const abortReadAndWatch = new AbortController();
    const timestamp = Date.now();
    const message = `read:${account.address.toLowerCase()}/${logName}/${timestamp}`;
    const signedHash = await this.wallet.signMessage({
      account,
      message,
    });

    const { responses } = this.loggerClient.read(
      {
        address: account.address,
        logName: logName,
        timestamp: BigInt(timestamp),
        signedHash: fromHex(signedHash, "bytes"),
      },
      {
        abort: abortReadAndWatch.signal,
        timeout: 3_600_000, // 1h
      }
    );
    return [
      responses,
      () => {
        if (abortReadAndWatch !== null) {
          abortReadAndWatch.abort();
        }
      },
    ];
  }
}
