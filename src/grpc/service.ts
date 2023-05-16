import { arrayify } from "@ethersproject/bytes";
import type { Signer } from "ethers";
import type { ReadResponse } from "./generated/logger/v1alpha1/log";
import type { ILoggerAPIClient } from "./generated/logger/v1alpha1/log.client";

export class GRPCService {
  constructor(private loggerClient: ILoggerAPIClient, private signer: Signer) {}

  async readAndWatch(
    address: string,
    logName: string
  ): Promise<[AsyncIterable<ReadResponse>, () => void]> {
    const abortReadAndWatch = new AbortController();
    const timestamp = Date.now();
    const msg = `read:${address.toLowerCase()}/${logName}/${timestamp}`;
    const signedHash: string = await this.signer.signMessage(msg);

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
