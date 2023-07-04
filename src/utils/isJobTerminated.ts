import { JobStatus } from "../types/enums/JobStatus";

/**
 * Checks if the job status indicates it has terminated.
 * @param {number} status - The status of the job.
 * @return {boolean} - True if job has terminated, False otherwise.
 */
export function isJobTerminated(status: number): boolean {
  return (
    status === JobStatus.CANCELLED ||
    status === JobStatus.FAILED ||
    status === JobStatus.FINISHED ||
    status === JobStatus.OUT_OF_CREDITS
  );
}
