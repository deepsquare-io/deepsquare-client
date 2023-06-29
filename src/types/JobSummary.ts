import { Job } from "./Job";
import { Provider } from "./Provider";

export type JobSummary = Job & {
  provider: Provider | undefined;
};
