import type { ReadResponse } from "./generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./generated/logger/v1alpha1/log.client";
import { fromHex, Hex, WalletClient } from "viem";

export class GRPCService {
  constructor(
    private loggerClient: ILoggerAPIClient,
    private wallet: WalletClient
  ) {}

  async readAndWatch(
    address: Hex,
    logName: string
  ): Promise<[AsyncIterable<ReadResponse>, () => void]> {
    const abortReadAndWatch = new AbortController();
    const timestamp = Date.now();
    const message = `read:${address.toLowerCase()}/${logName}/${timestamp}`;
    const signedHash = await this.wallet.signMessage({
      account: address,
      message,
    });

    const { responses } = this.loggerClient.read(
      {
        address: address,
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
