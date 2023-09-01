import type { JobSummary } from "../types/JobSummary";

/**
 * Computes the cost per minute for a given job.
 *
 * The cost per minute is calculated based on the provider's price and the resources required by the job,
 * which include the number of tasks, GPU per task, CPU per task, and memory per CPU.
 *
 * @param {JobSummary} summary - The job object, which contains the resource requirements per task.
 *
 * @returns The cost per minute for the job, expressed in the smallest unit of the job's currency
 *   (like wei for Ethereum), and is always an integer.
 */
export function computeCostPerMin(summary: JobSummary): bigint {
  if (!summary.provider) return 0n;
  const tasks = summary.definition.ntasks;
  const gpuCost =
    summary.definition.gpusPerTask *
    summary.provider.providerPrices.gpuPricePerMin;
  const cpuCost =
    summary.definition.cpusPerTask *
    summary.provider.providerPrices.cpuPricePerMin;
  const memCost =
    summary.definition.memPerCpu *
    summary.definition.cpusPerTask *
    summary.provider.providerPrices.memPricePerMin;
  return (tasks * (gpuCost + cpuCost + memCost)) / 1000000n;
}
