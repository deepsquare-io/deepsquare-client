import type { ReadContractReturnType } from "viem";
import type { ProviderManagerAbi } from "../abis/ProviderManager";

export type ProviderStatus = ReadContractReturnType<
  typeof ProviderManagerAbi,
  "getProviderStatut"
>;
