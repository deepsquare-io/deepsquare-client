import { Hex, ReadContractReturnType } from "viem";
import { MetaSchedulerAbi } from "../abis/MetaScheduler";

export type Job = ReadContractReturnType<typeof MetaSchedulerAbi, "getJob">;
