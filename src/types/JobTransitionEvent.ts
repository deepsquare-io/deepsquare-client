import type { ExtractAbiEvent } from "abitype";
import type { Log } from "viem";
import type { JobRepositoryAbi } from "../abis/JobRepository";

export type JobTransitionEvent = Log<
  bigint,
  number,
  false,
  ExtractAbiEvent<typeof JobRepositoryAbi, "JobTransitionEvent">,
  undefined
>;
