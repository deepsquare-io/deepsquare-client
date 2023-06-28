import { Job } from "../types/Job";
import { ProviderPrices } from "../types/ProviderPrices";

/**
 * Computes the cost per minute for a given job.
 *
 * The cost per minute is calculated based on the provider's price and the resources required by the job,
 * which include the number of tasks, GPU per task, CPU per task, and memory per CPU.
 *
 * @param {Job} job - The job object, which contains the resource requirements per task.
 * @param {ProviderPrices} providerPrice - The pricing structure of the provider. It includes the
 *   prices for GPU, CPU, and memory per minute.
 *
 * @returns The cost per minute for the job, expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */
export default function computeCostPerMin(
  job: Job,
  providerPrice: ProviderPrices
): bigint {
  const tasks = job.definition.ntasks;
  const gpuCost = job.definition.gpuPerTask * providerPrice.gpuPricePerMin;
  const cpuCost = job.definition.cpuPerTask * providerPrice.cpuPricePerMin;
  const memCost =
    job.definition.memPerCpu *
    job.definition.cpuPerTask *
    providerPrice.memPricePerMin;
  return (tasks * (gpuCost + cpuCost + memCost)) / 1000000n;
}
