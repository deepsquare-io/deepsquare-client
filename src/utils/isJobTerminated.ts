import { JobStatus } from "../types/enums/JobStatus";

/**
 * Checks if the job status indicates it has terminated.
 * @param {number} status - The status of the job.
 * @return {boolean} - True if job has terminated, False otherwise.
 */
export function isJobTerminated(status: number): boolean {
  return (
    status === JobStatus.CANCELLED.valueOf() ||
    status === JobStatus.FAILED.valueOf() ||
    status === JobStatus.FINISHED.valueOf() ||
    status === JobStatus.OUT_OF_CREDITS.valueOf() ||
    status === JobStatus.PANICKED.valueOf()
  );
}
