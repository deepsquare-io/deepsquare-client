export enum JobStatus {
  PENDING = 0,
  META_SCHEDULED = 1,
  SCHEDULED = 2,
  RUNNING = 3,
  CANCELLED = 4,
  FINISHED = 5,
  FAILED = 6,
  OUT_OF_CREDITS = 7,
  PANICKED = 8,
}

export function FormatJobStatus(status: JobStatus): string {
  switch (status) {
    case JobStatus.PENDING:
      return "PENDING";
    case JobStatus.META_SCHEDULED:
      return "META_SCHEDULED";
    case JobStatus.SCHEDULED:
      return "SCHEDULED";
    case JobStatus.RUNNING:
      return "RUNNING";
    case JobStatus.CANCELLED:
      return "CANCELLED";
    case JobStatus.FINISHED:
      return "FINISHED";
    case JobStatus.FAILED:
      return "FAILED";
    case JobStatus.OUT_OF_CREDITS:
      return "OUT_OF_CREDITS";
    case JobStatus.PANICKED:
      return "PANICKED";
  }
}
