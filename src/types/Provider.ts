import { Hex } from "viem";
import { ProviderHardware } from "./ProviderHardware";
import { ProviderPrices } from "./ProviderPrices";
import { ProviderStatus } from "./ProviderStatus";

export type Provider = {
  addr: Hex;
  providerHardware: ProviderHardware;
  providerPrices: ProviderPrices;
  status: ProviderStatus;
  jobCount: bigint;
  valid: boolean;
  linkListed: boolean;
};
