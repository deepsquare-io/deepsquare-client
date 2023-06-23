import { ReadContractReturnType } from "viem";
import { ProviderManagerAbi } from "../abis/ProviderManager";

export type ProviderPrices = ReadContractReturnType<
  typeof ProviderManagerAbi,
  "getProviderPrices"
>;
