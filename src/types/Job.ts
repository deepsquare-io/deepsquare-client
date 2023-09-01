import type { ReadContractReturnType } from "viem";
import type { JobRepositoryAbi } from "../abis/JobRepository";

export type Job = ReadContractReturnType<typeof JobRepositoryAbi, "get">;
