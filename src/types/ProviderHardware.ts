import { ReadContractReturnType } from "viem";
import { ProviderManagerAbi } from "../abis/ProviderManager";

export type ProviderHardware = ReadContractReturnType<
  typeof ProviderManagerAbi,
  "getProviderHardware"
>;
