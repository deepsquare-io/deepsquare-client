import { Job } from "../types/Job";
import { ProviderPrices } from "../types/ProviderPrices";
import isJobTerminated from "./isJobTerminated";
import computeCostPerMin from "./computeCostPerMin";

export function jobDurationInMinutes(job: Job): bigint {
  return BigInt(Math.floor(Date.now() / 1000)) - job.time.start / 60n;
}

/**
 * Computes the current cost of a job.
 *
 * If the job has already been terminated, it returns the final cost of the job. Otherwise, it calculates
 * the current cost based on the time elapsed since the start of the job and the cost per minute.
 *
 * @param {Job} job - The job object. It includes properties such as the status and the cost of the job.
 * @param {ProviderPrices} providerPrice - The pricing structure of the provider. It contains
 *   the pricing details needed to compute the cost per minute of the job.
 *
 * @returns The current cost of the job. It's expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */
export default function computeCost(
  job: Job,
  providerPrice: ProviderPrices
): bigint {
  return isJobTerminated(job.status)
    ? job.cost.finalCost
    : jobDurationInMinutes(job) * computeCostPerMin(job, providerPrice);
}
