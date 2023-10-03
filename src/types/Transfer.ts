import type { ExtractAbiEvent } from "abitype";
import type { Log } from "viem";
import type { CreditAbi } from "../abis/Credit";

export type Transfer = Log<
  bigint,
  number,
  ExtractAbiEvent<typeof CreditAbi, "Transfer">,
  undefined
>;
