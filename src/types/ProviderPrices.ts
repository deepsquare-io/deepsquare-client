import type { ReadContractReturnType } from "viem";
import type { ProviderManagerAbi } from "../abis/ProviderManager";

export type ProviderPrices = ReadContractReturnType<
  typeof ProviderManagerAbi,
  "getProviderPrices"
>;
