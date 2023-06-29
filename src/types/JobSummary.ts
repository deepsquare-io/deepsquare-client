import type { Job } from "./Job";
import type { Provider } from "./Provider";

export type JobSummary = Job & {
  provider: Provider | undefined;
};
