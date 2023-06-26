import type { ReadContractReturnType } from "viem";
import type { MetaSchedulerAbi } from "../abis/MetaScheduler";

export type Job = ReadContractReturnType<typeof MetaSchedulerAbi, "getJob">;
