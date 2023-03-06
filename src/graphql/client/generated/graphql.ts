/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ContainerRun = {
  /**
   * Run with Apptainer as Container runtime instead of Pyxis.
   *
   * By running with apptainer, you get access Deepsquare-hosted images.
   *
   * Defaults to false.
   */
  apptainer?: InputMaybe<Scalars["Boolean"]>;
  /**
   * Use DeepSquare-hosted images.
   *
   * By setting to true, apptainer will be set to true.
   */
  deepsquareHosted?: InputMaybe<Scalars["Boolean"]>;
  /**
   * Run the command inside a container with Pyxis.
   *
   * Format: image:tag. Registry and authentication is not allowed on this field.
   *
   * If the default container runtime is used:
   *
   *   - Use an absolute path to load a squashfs file. By default, it will search inside $STORAGE_PATH. /input will be equivalent to $DEEPSQUARE_INPUT, /output is $DEEPSQUARE_OUTPUT
   *
   * If apptainer=true:
   *
   *   - Use an absolute path to load a sif file or a squashfs file. By default, it will search inside $STORAGE_PATH. /input will be equivalent to $DEEPSQUARE_INPUT, /output is $DEEPSQUARE_OUTPUT
   *
   * Examples:
   *
   *   - library/ubuntu:latest
   *   - /my.squashfs
   */
  image: Scalars["String"];
  /** Mount decribes a Bind Mount. */
  mounts?: InputMaybe<Array<Mount>>;
  /** Password of a basic authentication. */
  password?: InputMaybe<Scalars["String"]>;
  /**
   * Container registry host.
   *
   * Defaults to registry-1.docker.io
   */
  registry?: InputMaybe<Scalars["String"]>;
  /** Username of a basic authentication. */
  username?: InputMaybe<Scalars["String"]>;
  /** X11 mounts /tmp/.X11-unix in the container. */
  x11?: InputMaybe<Scalars["Boolean"]>;
};

/**
 * An environment variable.
 *
 * Accessible via: "$key". "Key" name must follows the POSIX specifications (alphanumeric with underscore).
 */
export type EnvVar = {
  key: Scalars["String"];
  value: Scalars["String"];
};

/** ForRange describes the parameter for a range loop. */
export type ForRange = {
  /** Begin is inclusive. */
  begin: Scalars["Int"];
  /** End is inclusive. */
  end: Scalars["Int"];
  /** Increment counter by x count. If null, defaults to 1. */
  increment?: InputMaybe<Scalars["Int"]>;
};

/** S3Data describes the necessary variables to connect to a HTTP storage. */
export type HttpData = {
  url: Scalars["String"];
};

/** A Job is a finite sequence of instructions. */
export type Job = {
  /**
   * ContinuousOutputSync will push data during the whole job.
   *
   * This is useful when it is not desired to lose data when the job is suddenly stopped.
   *
   * ContinousOutputSync is not available with HTTP.
   */
  continuousOutputSync?: InputMaybe<Scalars["Boolean"]>;
  /** EnableLogging enables the DeepSquare GRID Logger. */
  enableLogging?: InputMaybe<Scalars["Boolean"]>;
  /** Environment variables accessible for the entire job. */
  env?: InputMaybe<Array<EnvVar>>;
  /**
   * Pull data at the start of the job.
   *
   * It is recommended to set the mode of the data by filling the `inputMode` field.
   */
  input?: InputMaybe<TransportData>;
  /**
   * InputMode takes an integer that will be used to change the mode recursively (chmod -R) of the input data.
   *
   * The number shouldn't be in octal but in decimal. A mode over 512 is not accepted.
   *
   * Common modes:
   *   - 511 (user:rwx group:rwx world:rwx)
   *   - 493 (user:rwx group:r-x world:r-x)
   *   - 448 (user:rwx group:--- world:---)
   *
   * If null, the mode won't change and will default to the source.
   */
  inputMode?: InputMaybe<Scalars["Int"]>;
  /**
   * Push data at the end of the job.
   *
   * Continuous sync/push can be enabled using the `continuousOutputSync` flag.
   */
  output?: InputMaybe<TransportData>;
  /**
   * Allocated resources for the job.
   *
   * Each resource is available as environment variables:
   * - $NTASKS: number of allowed parallel tasks
   * - $CPUS_PER_TASK: number of CPUs per task
   * - $MEM_PER_CPU: MB of memory per CPU
   * - $GPUS_PER_TASK: number of GPUs per task
   * - $GPUS: total number of GPUS
   * - $CPUS: total number of CPUS
   * - $MEM: total number of memory in MB
   */
  resources: JobResources;
  steps: Array<Step>;
};

/** JobResources are the allocated resources for a job in a cluster. */
export type JobResources = {
  /**
   * Allocated CPUs per task.
   *
   * Can be greater or equal to 1.
   */
  cpusPerTask: Scalars["Int"];
  /**
   * Allocated GPUs per task.
   *
   * Can be greater or equal to 0.
   */
  gpusPerTask: Scalars["Int"];
  /**
   * Allocated memory (MB) per task.
   *
   * Can be greater or equal to 1.
   */
  memPerCpu: Scalars["Int"];
  /**
   * Number of tasks which are run in parallel.
   *
   * Can be greater or equal to 1.
   */
  tasks: Scalars["Int"];
};

/** Mount decribes a Bind Mount. */
export type Mount = {
  containerDir: Scalars["String"];
  hostDir: Scalars["String"];
  options: Scalars["String"];
};

export type Mutation = {
  /** Submit a Job and retrieve the batch location hash. */
  submit: Scalars["String"];
};

export type MutationSubmitArgs = {
  job: Job;
};

export type Query = {
  /** Retrieve a job batch script from the hash. */
  job: Scalars["String"];
};

export type QueryJobArgs = {
  batchLocationHash: Scalars["String"];
};

/** S3Data describes the necessary variables to connect to a S3 storage. */
export type S3Data = {
  /** An access key ID for the S3 endpoint. */
  accessKeyId: Scalars["String"];
  /**
   * The S3 Bucket URL. Must not end with "/".
   *
   * Example: "s3://my-bucket".
   */
  bucketUrl: Scalars["String"];
  /**
   * DeleteSync removes destination files that doesn't correspond to the source.
   *
   * This applies to any type of source to any type of destination (s3 or filesystem).
   *
   * See: s5cmd sync --delete.
   *
   * If null, defaults to false.
   */
  deleteSync?: InputMaybe<Scalars["Boolean"]>;
  /** A S3 Endpoint URL used for authentication. Example: https://s3.us‑east‑2.amazonaws.com */
  endpointUrl: Scalars["String"];
  /** The absolute path to a directory/file inside the bucket. Must start with "/". */
  path: Scalars["String"];
  /** S3 region. Example: "us‑east‑2". */
  region: Scalars["String"];
  /** A secret access key for the S3 endpoint. */
  secretAccessKey: Scalars["String"];
};

/** Step is one instruction. */
export type Step = {
  /**
   * Run a for loop if not null.
   *
   * Is exclusive with "run".
   */
  for?: InputMaybe<StepFor>;
  /** Name of the instruction. */
  name: Scalars["String"];
  /**
   * Run a command if not null.
   *
   * Is exclusive with "for".
   */
  run?: InputMaybe<StepRun>;
};

/** StepFor describes a for loop. */
export type StepFor = {
  /**
   * Item accessible via the {{ .Item }} variable. Index accessible via the $item variable.
   *
   * Exclusive with "range".
   */
  items?: InputMaybe<Array<Scalars["String"]>>;
  /** Do a parallel for loop. Each iteration is run in parallel. */
  parallel: Scalars["Boolean"];
  /**
   * Index accessible via the $index variable.
   *
   * Exclusive with "items".
   */
  range?: InputMaybe<ForRange>;
  /** Steps are run sequentially in one iteration. */
  steps: Array<Step>;
};

/**
 * StepRun is one script executed with the shell.
 *
 * Shared storage is accessible through the $STORAGE_PATH environment variable.
 *
 * echo "KEY=value" >> "$DEEPSQUARE_ENV" can be used to share environment variables between steps.
 *
 * $DEEPSQUARE_INPUT is the path that contains imported files.
 *
 * $DEEPSQUARE_OUTPUT is the staging directory for uploading files.
 */
export type StepRun = {
  /** Command specifies a shell script. */
  command: Scalars["String"];
  /**
   * Container definition.
   *
   * If null, run on the host.
   */
  container?: InputMaybe<ContainerRun>;
  /**
   * DisableCPUBinding disables process affinity binding to tasks.
   *
   * Can be useful when running MPI jobs.
   *
   * If null, defaults to false.
   */
  disableCpuBinding?: InputMaybe<Scalars["Boolean"]>;
  /** Environment variables accessible over the command. */
  env?: InputMaybe<Array<EnvVar>>;
  /** Allocated resources for the command. */
  resources: StepRunResources;
  /**
   * Shell to use.
   *
   * Accepted: /bin/bash, /bin/ash, /bin/sh
   * Default: /bin/sh
   */
  shell?: InputMaybe<Scalars["String"]>;
};

/** StepRunResources are the allocated resources for a command in a job. */
export type StepRunResources = {
  /**
   * Allocated CPUs per task.
   *
   * Can be greater or equal to 1.
   *
   * If null, defaults to the job resources.
   */
  cpusPerTask?: InputMaybe<Scalars["Int"]>;
  /**
   * Allocated GPUs per task.
   *
   * Can be greater or equal to 0.
   *
   * If null, defaults to the job resources.
   */
  gpusPerTask?: InputMaybe<Scalars["Int"]>;
  /**
   * Allocated memory (MB) per task.
   *
   * Can be greater or equal to 1.
   *
   * If null, defaults to the job resources.
   */
  memPerCpu?: InputMaybe<Scalars["Int"]>;
  /**
   * Number of tasks which are run in parallel.
   *
   * Can be greater or equal to 1.
   *
   * If null, default to 1.
   */
  tasks?: InputMaybe<Scalars["Int"]>;
};

export type TransportData = {
  /** Use http to download a file or archive, which will be autoextracted. */
  http?: InputMaybe<HttpData>;
  /** Use s3 to sync a file or directory. */
  s3?: InputMaybe<S3Data>;
};

export type JobQueryVariables = Exact<{
  batchLocationHash: Scalars["String"];
}>;

export type JobQuery = { job: string };

export type SubmitMutationVariables = Exact<{
  job: Job;
}>;

export type SubmitMutation = { submit: string };

export const JobDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Job" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "batchLocationHash" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "job" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "batchLocationHash" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "batchLocationHash" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<JobQuery, JobQueryVariables>;
export const SubmitDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Submit" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "job" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Job" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "submit" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "job" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "job" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SubmitMutation, SubmitMutationVariables>;
