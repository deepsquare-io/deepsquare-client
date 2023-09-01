import type { ReadContractReturnType } from "viem";
import type { IProviderManagerAbi } from "../abis/IProviderManager";

export type Provider = ReadContractReturnType<
  typeof IProviderManagerAbi,
  "getProvider"
>;
