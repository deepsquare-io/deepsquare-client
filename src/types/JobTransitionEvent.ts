import type { ExtractAbiEvent } from "abitype";
import type { Log } from "viem";
import type { MetaSchedulerAbi } from "../abis/MetaScheduler";

export type JobTransitionEvent = Log<
  bigint,
  number,
  ExtractAbiEvent<typeof MetaSchedulerAbi, "JobTransitionEvent">,
  undefined
>;
