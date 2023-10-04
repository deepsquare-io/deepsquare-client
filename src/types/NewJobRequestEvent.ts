import type { ExtractAbiEvent } from "abitype";
import type { Log } from "viem";
import type { MetaSchedulerAbi } from "../abis/MetaScheduler";

export type NewJobRequestEvent = Log<
  bigint,
  number,
  false,
  ExtractAbiEvent<typeof MetaSchedulerAbi, "NewJobRequestEvent">,
  undefined
>;
