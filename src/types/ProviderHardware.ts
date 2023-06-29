import type { ReadContractReturnType } from "viem";
import type { ProviderManagerAbi } from "../abis/ProviderManager";

export type ProviderHardware = ReadContractReturnType<
  typeof ProviderManagerAbi,
  "getProviderHardware"
>;
