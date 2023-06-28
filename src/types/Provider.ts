import type { Hex } from "viem";
import type { ProviderHardware } from "./ProviderHardware";
import type { ProviderPrices } from "./ProviderPrices";
import type { ProviderStatus } from "./ProviderStatus";

export type Provider = {
  addr: Hex;
  providerHardware: ProviderHardware;
  providerPrices: ProviderPrices;
  status: ProviderStatus;
  jobCount: bigint;
  valid: boolean;
  linkListed: boolean;
};
