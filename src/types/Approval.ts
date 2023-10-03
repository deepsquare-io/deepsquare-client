import type { ExtractAbiEvent } from "abitype";
import type { Log } from "viem";
import type { CreditAbi } from "../abis/Credit";

export type Approval = Log<
  bigint,
  number,
  ExtractAbiEvent<typeof CreditAbi, "Approval">,
  undefined
>;
