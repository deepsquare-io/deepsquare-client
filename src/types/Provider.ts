import { ReadContractReturnType } from "viem";
import { IProviderManagerAbi } from "../abis/IProviderManager";

export type Provider = ReadContractReturnType<
  typeof IProviderManagerAbi,
  "getProvider"
>;
