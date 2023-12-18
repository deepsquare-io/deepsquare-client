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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

/**
 * jkuri/bore tunnel Transport for StepRun.
 *
 * Bore is a proxy to expose TCP sockets.
 */
export type Bore = {
  /**
   * Bore server IP/Address.
   *
   * Deprecated: Use boreAddress.
   *
   * Go name: "Address".
   */
  address?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Bore server IP/Address:Port.
   *
   * Go name: "BoreAddress".
   */
  boreAddress?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * The bore server port.
   *
   * Deprecated: Use boreAddress.
   *
   * Go name: "Port".
   */
  port?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Secret used to authenticate on a Bore server.
   *
   * This secret is used to identify the client.
   *
   * Go name: "Secret".
   */
  secret?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Target port.
   *
   * Go name: "TargetPort".
   */
  targetPort: Scalars["Int"]["input"];
};

export type ContainerRun = {
  /**
   * Run with Apptainer as Container runtime instead of Enroot.
   *
   * By running with apptainer, you get access Deepsquare-hosted images.
   *
   * When running Apptainer, the container file system is read-only.
   *
   * Defaults to false.
   *
   * Go name: "Apptainer".
   */
  apptainer?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * Use DeepSquare-hosted images.
   *
   * By setting to true, apptainer will be set to true.
   *
   * Go name: "DeepsquareHosted".
   */
  deepsquareHosted?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * Run the command inside a container with Enroot.
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
   *
   * Go name: "Image".
   */
  image: Scalars["String"]["input"];
  /**
   * Mount the home directories.
   *
   * Go name: "MountHome".
   */
  mountHome?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * [DEPRECATED] Mounts decribes a Bind Mount.
   *
   * Please use predefined mounts like $STORAGE_PATH, $DEEPSQUARE_TMP, ...
   *
   * Go name: "Mounts".
   */
  mounts?: InputMaybe<Array<Mount>>;
  /**
   * Password of a basic authentication.
   *
   * Go name: "Password".
   */
  password?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Disable write permissions on the container root file system. Does not applies to mounts.
   *
   * Go name: "ReadOnlyRootFS"
   */
  readOnlyRootFS?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * Container registry host.
   *
   * Defaults to registry-1.docker.io.
   *
   * Go name: "Registry".
   */
  registry?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Username of a basic authentication.
   *
   * Go name: "Username".
   */
  username?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * X11 mounts /tmp/.X11-unix in the container.
   *
   * Go name: "X11".
   */
  x11?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/**
 * An environment variable.
 *
 * Accessible via: "$key". "Key" name must follows the POSIX specifications (alphanumeric with underscore).
 */
export type EnvVar = {
  /**
   * Key of the environment variable.
   *
   * Go name: "Key".
   */
  key: Scalars["String"]["input"];
  /**
   * Value of the environment variable.
   *
   * Go name: "Value".
   */
  value: Scalars["String"]["input"];
};

/** ForRange describes the parameter for a range loop. */
export type ForRange = {
  /**
   * Begin is inclusive.
   *
   * Go name: "Begin".
   */
  begin: Scalars["Int"]["input"];
  /**
   * End is inclusive.
   *
   * Go name: "End".
   */
  end: Scalars["Int"]["input"];
  /**
   * Increment counter by x count. If null, defaults to 1.
   *
   * Go name: "Increment".
   */
  increment?: InputMaybe<Scalars["Int"]["input"]>;
};

/** HTTPData describes the necessary variables to connect to a HTTP storage. */
export type HttpData = {
  /**
   * HTTP or HTTPS URL to a file.
   *
   * Go name: "URL".
   */
  url: Scalars["String"]["input"];
};

/** A Job is a finite sequence of instructions. */
export type Job = {
  /**
   * ContinuousOutputSync will push data during the whole job.
   *
   * This is useful when it is not desired to lose data when the job is suddenly stopped.
   *
   * ContinousOutputSync is not available with HTTP.
   *
   * Go name: "ContinuousOutputSync".
   */
  continuousOutputSync?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * EnableLogging enables the DeepSquare Grid Logger.
   *
   * Go name: "EnableLogging".
   */
  enableLogging?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * Environment variables accessible for the entire job.
   *
   * Go name: "Env".
   */
  env?: InputMaybe<Array<EnvVar>>;
  /**
   * Pull data at the start of the job.
   *
   * It is recommended to set the mode of the data by filling the `inputMode` field.
   *
   * Go name: "Input".
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
   *
   * Go name: "InputMode".
   */
  inputMode?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Push data at the end of the job.
   *
   * Continuous sync/push can be enabled using the `continuousOutputSync` flag.
   *
   * Go name: "Output".
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
   *
   * Go name: "Resources".
   */
  resources: JobResources;
  /**
   * Group of steps that will be run sequentially.
   *
   * Go name: "Steps".
   */
  steps: Array<Step>;
};

/** JobResources are the allocated resources for a job in a cluster. */
export type JobResources = {
  /**
   * Allocated CPUs per task.
   *
   * Can be greater or equal to 1.
   *
   * Go name: "CPUsPerTask".
   */
  cpusPerTask: Scalars["Int"]["input"];
  /**
   * Allocated GPUs for the whole job.
   *
   * Tasks can consume the GPUs by setting `GPUsPerTask` at step level.
   *
   * Can be greater or equal to 0.
   *
   * Go name: "GPUs".
   */
  gpus: Scalars["Int"]["input"];
  /**
   * Allocated memory (MB) per task.
   *
   * Can be greater or equal to 1.
   *
   * Go name: "MemPerCPU".
   */
  memPerCpu: Scalars["Int"]["input"];
  /**
   * Number of tasks which are run in parallel.
   *
   * Can be greater or equal to 1.
   *
   * Go name: "Tasks".
   */
  tasks: Scalars["Int"]["input"];
};

/**
 * A module is basically a group of steps.
 *
 * The module.yaml file goes through a templating engine first before getting parsed. So some variables are available:
 *
 * - `{{ .Job }}` and its childs, which represent the Job object using the module. Can be useful if you want to dynamically set an value based on the job.
 * - `{{ .Step }}` and its childs, which represent the Step object using the module. Can be useful if you want the step name.
 *
 * If you want your user to pass custom steps, you can use `{{- .Step.Use.Steps | toYaml | nindent <n> }}` which is the group of steps.
 *
 * Example:
 *
 * ```yaml
 * # module.yaml
 * steps:
 *   - name: my step
 *   {{- .Step.Use.Steps | toYaml | nindent 2 }}
 *   - name: my other step
 * ```
 *
 * ```yaml
 * # job.yaml
 * steps:
 *   - name: module
 *     use:
 *       source: git/my-module
 *       steps:
 *         - name: step by user
 *         - name: another step by user
 * ```
 *
 * Will render:
 *
 * ```yaml
 * # module.yaml
 * steps:
 *   - name: my step
 *   - name: step by user
 *   - name: another step by user
 *   - name: my other step
 * ```
 *
 * Notice that the templating follows the Go format. You can also apply [sprig](http://masterminds.github.io/sprig/) templating functions.
 *
 * To outputs environment variables, just append KEY=value to the "${DEEPSQUARE_ENV}" file, like this:
 *
 * ```
 * echo "KEY=value" >> "${DEEPSQUARE_ENV}"
 * ```
 */
export type Module = {
  /**
   * Description of the module.
   *
   * Go name: "Description".
   */
  description: Scalars["String"]["input"];
  /**
   * List of allowed arguments.
   *
   * Go name: "Inputs".
   */
  inputs?: InputMaybe<Array<ModuleInput>>;
  /**
   * Minimum job resources.
   *
   * Go name: "MinimumResources".
   */
  minimumResources: JobResources;
  /**
   * Name of the module.
   *
   * Go name: "Name".
   */
  name: Scalars["String"]["input"];
  /**
   * List of exported environment variables.
   *
   * Go name: "Outputs".
   */
  outputs?: InputMaybe<Array<ModuleOutput>>;
  /**
   * Steps of the module.
   *
   * Go name: "Steps".
   */
  steps: Array<Step>;
};

export type ModuleInput = {
  /**
   * Default value.
   *
   * If not set, will default to empty string.
   *
   * Go name: "Default".
   */
  default?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Description of the input.
   *
   * Go name: "Description".
   */
  description: Scalars["String"]["input"];
  /**
   * Name of the input.
   *
   * Go name: "Key".
   */
  key: Scalars["String"]["input"];
};

export type ModuleOutput = {
  /**
   * Description of the output.
   *
   * Go name: "Description".
   */
  description: Scalars["String"]["input"];
  /**
   * Name of the output.
   *
   * Go name: "Key".
   */
  key: Scalars["String"]["input"];
};

/**
 * DEPRECATED: Mount decribes a Bind Mount.
 *
 * Mount is now deprecated. Please use predefined mounts like $STORAGE_PATH, $DEEPSQUARE_TMP, ...
 */
export type Mount = {
  /**
   * Target directory inside the container.
   *
   * Go name: "ContainerDir".
   */
  containerDir: Scalars["String"]["input"];
  /**
   * Directory on the host to be mounted inside the container.
   *
   * Go name: "HostDir".
   */
  hostDir: Scalars["String"]["input"];
  /**
   * Options modifies the mount options.
   *
   * Accepted: ro, rw
   *
   * Go name: "Options".
   */
  options: Scalars["String"]["input"];
};

export type Mutation = {
  /** Submit a Job and retrieve the batch location hash. */
  submit: Scalars["String"]["output"];
  /** Validate a module. */
  validate: Scalars["String"]["output"];
};

export type MutationSubmitArgs = {
  job: Job;
};

export type MutationValidateArgs = {
  module: Module;
};

/**
 * Connect a network interface on a StepRun.
 *
 * The network interface is connected via slirp4netns.
 *
 * If using wireguard, please mapUid to root (mapUid=0).
 */
export type NetworkInterface = {
  /**
   * Use the bore transport.
   *
   * Go name: "Bore".
   */
  bore?: InputMaybe<Bore>;
  /**
   * Use the wireguard transport.
   *
   * Go name: "Wireguard".
   */
  wireguard?: InputMaybe<Wireguard>;
};

export type Query = {
  /** Retrieve a job batch script from the hash. */
  job: Scalars["String"]["output"];
};

export type QueryJobArgs = {
  batchLocationHash: Scalars["String"]["input"];
};

/** S3Data describes the necessary variables to connect to a S3 storage. */
export type S3Data = {
  /**
   * An access key ID for the S3 endpoint.
   *
   * Go name: "AccessKeyID".
   */
  accessKeyId: Scalars["String"]["input"];
  /**
   * The S3 Bucket URL. Must not end with "/".
   *
   * Example: "s3://my-bucket".
   *
   * Go name: "BucketURL".
   */
  bucketUrl: Scalars["String"]["input"];
  /**
   * DeleteSync removes destination files that doesn't correspond to the source.
   *
   * This applies to any type of source to any type of destination (s3 or filesystem).
   *
   * See: s5cmd sync --delete.
   *
   * If null, defaults to false.
   *
   * Go name: "DeleteSync".
   */
  deleteSync?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * A S3 Endpoint URL used for authentication. Example: https://s3.us‑east‑2.amazonaws.com
   *
   * Go name: "EndpointURL".
   */
  endpointUrl: Scalars["String"]["input"];
  /**
   * The absolute path to a directory/file inside the bucket. Must start with "/".
   *
   * Go name: "Path".
   */
  path: Scalars["String"]["input"];
  /**
   * S3 region. Example: "us‑east‑2".
   *
   * Go name: "Region".
   */
  region: Scalars["String"]["input"];
  /**
   * A secret access key for the S3 endpoint.
   *
   * Go name: "SecretAccessKey".
   */
  secretAccessKey: Scalars["String"]["input"];
};

/** Step is one instruction. */
export type Step = {
  /**
   * Group of steps that will be run sequentially on error.
   *
   * Go name: "Catch".
   */
  catch?: InputMaybe<Array<Step>>;
  /**
   * Depends on wait for async tasks to end before launching this step.
   *
   * DependsOn uses the `handleName` property of a `StepAsyncLaunch`.
   *
   * Only steps at the same level can be awaited.
   *
   * BE WARNED: Uncontrolled `dependsOn` may results in dead locks.
   *
   * Go name: "DependsOn".
   */
  dependsOn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /**
   * Group of steps that will be run sequentially after the group of steps or command finishes.
   *
   * Go name: "Finally".
   */
  finally?: InputMaybe<Array<Step>>;
  /**
   * Run a for loop if not null.
   *
   * Is exclusive with "run", "launch", "use", "steps".
   *
   * Go name: "For".
   */
  for?: InputMaybe<StepFor>;
  /**
   * "If" is a boolean test that skips the step if the test is false.
   *
   * The test format is bash and variables such as $PATH or $(pwd) can be expanded.
   *
   * Note that "If" will be run after the "DependsOn".
   *
   * Example: '3 -eq 3 && "${TEST}" = "test"'.
   *
   * Go name: "If".
   */
  if?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Launch a background process to run a group of commands if not null.
   *
   * Is exclusive with "run", "for", "use", "steps".
   *
   * Go name: "Launch".
   */
  launch?: InputMaybe<StepAsyncLaunch>;
  /**
   * Name of the instruction.
   *
   * Is used for debugging.
   *
   * Go name: "Name".
   */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Run a command if not null.
   *
   * Is exclusive with "for", "launch", "use", "steps".
   *
   * Go name: "Run".
   */
  run?: InputMaybe<StepRun>;
  /**
   * Group of steps that will be run sequentially.
   *
   * Is exclusive with "for", "launch", "use", "run".
   *
   * Go name: "Steps".
   */
  steps?: InputMaybe<Array<Step>>;
  /**
   * Use a third-party group of steps.
   *
   * Is exclusive with "run", "for", "launch", "steps".
   *
   * Go name: "Use".
   */
  use?: InputMaybe<StepUse>;
};

/**
 * StepAsyncLaunch describes launching a background process.
 *
 * StepAsyncLaunch will be awaited at the end of the job.
 */
export type StepAsyncLaunch = {
  /**
   * HandleName is the name used to await (dependsOn field of the Step).
   *
   * Naming style is snake_case. Case is insensitive. No symbol allowed.
   *
   * Go name: "HandleName".
   */
  handleName?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * SignalOnParentStepExit sends a signal to the step and sub-steps when the parent step ends.
   *
   * This function can be used as a cleanup function to avoid a zombie process.
   *
   * Zombie processes will continue to run after the main process dies and therefore will not stop the job.
   *
   * If null, SIGTERM will be sent. If 0, no signal will be sent.
   *
   * Current signal :
   *
   * 1 SIGHUP Hang-up detected on the control terminal or death of the control process.
   * 2 SIGINT Abort from keyboard
   * 3 SIGQUIT Quit the keyboard
   * 9 SIGKILL If a process receives this signal, it must quit immediately and will not perform any cleaning operations.
   * 15 SIGTERM Software stop signal
   *
   * It is STRONGLY RECOMMENDED to use SIGTERM to gracefully exit a process. SIGKILL is the most abrupt and will certainly work.
   *
   * If no signal is sent, the asynchronous step will be considered a fire and forget asynchronous step and will have to terminate itself to stop the job.
   *
   * WARNING: the "no signal sent" option is subject to removal to avoid undefined behavior. Please refrain from using it.
   *
   * Go name: "SignalOnParentStepExit".
   */
  signalOnParentStepExit?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Steps are run sequentially.
   *
   * Go name: "Steps".
   */
  steps: Array<Step>;
};

/** StepFor describes a for loop. */
export type StepFor = {
  /**
   * Item accessible via the {{ .Item }} variable. Index accessible via the $item variable.
   *
   * Exclusive with "range".
   *
   * Go name: "Items".
   */
  items?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /**
   * Do a parallel for loop. Each iteration is run in parallel.
   *
   * Go name: "Parallel".
   */
  parallel: Scalars["Boolean"]["input"];
  /**
   * Index accessible via the $index variable.
   *
   * Exclusive with "items".
   *
   * Go name: "Range".
   */
  range?: InputMaybe<ForRange>;
  /**
   * Steps are run sequentially in one iteration.
   *
   * Go name: "Steps".
   */
  steps: Array<Step>;
};

/**
 * StepRun is one script executed with the shell.
 *
 * A temporary shared storage is accessible through the $STORAGE_PATH environment variable.
 *
 * Availables caches can be used by invoking one of the following environment variable:
 *
 * | Environment variables                   | Lifecycle                        |
 * | --------------------------------------- | -------------------------------- |
 * | STORAGE_PATH                            | job duration                     |
 * | DEEPSQUARE_TMP or DEEPSQUARE_SHARED_TMP | provider's policy                |
 * | DEEPSQUARE_SHARED_WORLD_TMP             | provider's policy                |
 * | DEEPSQUARE_DISK_TMP                     | node reboot or provider's policy |
 * | DEEPSQUARE_DISK_WORLD_TMP               | node reboot or provider's policy |
 *
 * echo "KEY=value" >> "$DEEPSQUARE_ENV" can be used to share environment variables between steps.
 *
 * $DEEPSQUARE_INPUT is the path that contains imported files.
 *
 * $DEEPSQUARE_OUTPUT is the staging directory for uploading files.
 */
export type StepRun = {
  /**
   * Command specifies a shell script.
   *
   * If container is used, command automatically overwrite the ENTRYPOINT and CMD. If you want to execute the entrypoint, it MUST be re-specified.
   *
   * You can install and use skopeo to inspect an image without having to pull it.
   *
   * Example: skopeo inspect --config docker://curlimages/curl:latest will gives "/entrypoint.sh" as ENTRYPOINT and "curl" as CMD. Therefore command="/entrypoint.sh curl".
   *
   * Go name: "Command".
   */
  command: Scalars["String"]["input"];
  /**
   * Container definition.
   *
   * If null, run on the host.
   *
   * Go name: "Container".
   */
  container?: InputMaybe<ContainerRun>;
  /**
   * Add custom network interfaces.
   *
   * ONLY enabled if network is "slirp4netns" or "pasta".
   *
   * You may need to map to root to be able to create network interfaces like Wireguard.
   *
   * The default network interface is net0, which is a TAP interface connecting the host and the network namespace.
   *
   * Go name: "CustomNetworkInterfaces".
   */
  customNetworkInterfaces?: InputMaybe<Array<NetworkInterface>>;
  /**
   * DisableCPUBinding disables process affinity binding to tasks.
   *
   * Can be useful when running MPI jobs.
   *
   * If null, defaults to false.
   *
   * Go name: "DisableCPUBinding".
   */
  disableCpuBinding?: InputMaybe<Scalars["Boolean"]["input"]>;
  /**
   * Configuration for the DNS in "slirp4netns" or "pasta" mode.
   *
   * ONLY enabled if network is "slirp4netns" or "pasta".
   *
   * A comma-separated list of DNS IP.
   *
   * Go name: "DNS".
   */
  dns?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /**
   * Environment variables accessible over the command.
   *
   * Go name: "Env".
   */
  env?: InputMaybe<Array<EnvVar>>;
  /**
   * Remap GID. Does not grant elevated system permissions, despite appearances.
   *
   * Go name: "MapGID".
   */
  mapGid?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Remap UID. Does not grant elevated system permissions, despite appearances.
   *
   * MapUID doesn't work very well with Apptainer. You can still map to root, but you cannot map to an unknown user.
   *
   * Go name: "MapUID".
   */
  mapUid?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * MPI selection.
   *
   * Must be one of: none, pmix_v4, pmi2.
   *
   * If null, will default to infrastructure provider settings (which may not be what you want).
   *
   * Go name: "Mpi".
   */
  mpi?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Type of core networking functionality.
   *
   * Either: "host" (default) or "slirp4netns" (rootless network namespace) or "pasta" (simple rootless network namespace)
   *
   * "slirp4netns" uses "slirp" to forward traffic from a network namespace to the host.
   *
   * "pasta" is an alternative to "slirp4netns" and uses "passt" to forward traffic from a network namespace to the host.
   *
   * Go name: "Network".
   */
  network?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Allocated resources for the command.
   *
   * Go name: "Resources".
   */
  resources?: InputMaybe<StepRunResources>;
  /**
   * Shell to use.
   *
   * Accepted: /bin/bash, /bin/ash, /bin/sh
   * Default: /bin/sh
   *
   * Go name: "Shell".
   */
  shell?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Working directory.
   *
   * If the "default" (Enroot) container runtime is used, it will use the `--container-workdir` flag.
   *
   * If the "apptainer" container runtime is used, the `--pwd` flag will be passed.
   *
   * If no container runtime is used, `cd` will be executed first.
   *
   * If null, default to use $STORAGE_PATH as working directory.
   *
   * Go name: "WorkDir".
   */
  workDir?: InputMaybe<Scalars["String"]["input"]>;
};

/** StepRunResources are the allocated resources for a command in a job. */
export type StepRunResources = {
  /**
   * Allocated CPUs per task.
   *
   * Can be greater or equal to 1.
   *
   * If null, defaults to the job resources.
   *
   * Go name: "CPUsPerTask".
   */
  cpusPerTask?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Allocated GPUs per task.
   *
   * Can be greater or equal to 0.
   *
   * If null, defaults to 0.
   *
   * Go name: "GPUsPerTask".
   */
  gpusPerTask?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Allocated memory (MB) per task.
   *
   * Can be greater or equal to 1.
   *
   * If null, defaults to the job resources.
   *
   * Go name: "MemPerCPU".
   */
  memPerCpu?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Number of tasks which are run in parallel.
   *
   * Can be greater or equal to 1.
   *
   * If null, default to 1.
   *
   * Go name: "Tasks".
   */
  tasks?: InputMaybe<Scalars["Int"]["input"]>;
};

export type StepUse = {
  /**
   * Arguments to be passed as inputs to the group of steps.
   *
   * Go name: "Args".
   */
  args?: InputMaybe<Array<EnvVar>>;
  /**
   * Environment variables exported with be prefixed with the value of this field.
   *
   * Exemple: If exportEnvAs=MY_MODULE, and KEY is exported. Then you can invoke ${MY_MODULE_KEY} environment variable.
   *
   * Go name: "ExportEnvAs".
   */
  exportEnvAs?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Source of the group of steps.
   *
   * Syntax: <url>@<tag/hash>
   *
   * Example: github.com/example/my-module@v1
   * Example: github.com/example/module-monorepo/my-module@v1
   *
   * The host must be a git repository accessible via HTTPS.
   * The path must indicates a directory. For example, `/my-module` indicates the root directory of the repository `my-module`.
   * `module-monorepo/my-module` indicates the subdirectory `my-module` of the repository `module-monorepo`.
   *
   * Go name: "Source".
   */
  source: Scalars["String"]["input"];
  /**
   * Additional children steps to the module.
   *
   * If the module allow children steps, these steps will be passed to the module to replace {{ .Step.Run.Steps }}.
   *
   * Go name: "Steps".
   */
  steps?: InputMaybe<Array<Step>>;
};

export type TransportData = {
  /**
   * Use http to download a file or archive, which will be autoextracted.
   *
   * Go name: "HTTP".
   */
  http?: InputMaybe<HttpData>;
  /**
   * Use s3 to sync a file or directory.
   *
   * Go name: "S3".
   */
  s3?: InputMaybe<S3Data>;
};

/**
 * Wireguard VPN Transport for StepRun.
 *
 * The Wireguard VPN can be used as a gateway for the steps. All that is needed is a Wireguard server outside the cluster that acts as a public gateway.
 *
 * The interface are named wg0, wg1, ..., wgN.
 *
 * Wireguard transport uses UDP hole punching to connect to the VPN Server.
 *
 * Disabled settings: PreUp, PostUp, PreDown, PostDown, ListenPort, Table, MTU, SaveConfig.
 *
 * If these features are necessary, please do contact DeepSquare developpers!
 */
export type Wireguard = {
  /**
   * The IP addresses of the wireguard interface.
   *
   * Format is a CIDRv4 (X.X.X.X/X) or CIDRv6.
   *
   * Recommendation is to take one IP from the 10.0.0.0/24 range (example: 10.0.0.2/24).
   *
   * Go name: "Address".
   */
  address?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /**
   * The peers connected to the wireguard interface.
   *
   * Go name: "Peers".
   */
  peers?: InputMaybe<Array<WireguardPeer>>;
  /**
   * The client private key.
   *
   * Go name: "PrivateKey".
   */
  privateKey: Scalars["String"]["input"];
};

/** A Wireguard Peer. */
export type WireguardPeer = {
  /**
   * Configuration of wireguard routes.
   *
   * Format is a CIDRv4 (X.X.X.X/X) or CIDRv6.
   *
   * 0.0.0.0/0 (or ::/0) would forward all packets to the tunnel. If you plan to use the Wireguard VPN as a gateway, you MUST set this IP range.
   *
   * <server internal IP>/32 (not the server's public IP) would forward all packets to the tunnel with the server IP as the destination. MUST be set.
   *
   * <VPN IP range> would forward all packets to the tunnel with the local network as the destination. Useful if you want peers to communicate with each other and want the gateway to act as a router.
   *
   * Go name: "AllowedIPs".
   */
  allowedIPs?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /**
   * The peer endpoint.
   *
   * Format is IP:port.
   *
   * This would be the Wireguard server.
   *
   * Go name: "Endpoint".
   */
  endpoint?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Initiate the handshake and re-initiate regularly.
   *
   * Takes seconds as parameter. 25 seconds is recommended.
   *
   * You MUST set the persistent keepalive to enables UDP hole-punching.
   *
   * Go name: "PersistentKeepalive".
   */
  persistentKeepalive?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * The peer pre-shared key.
   *
   * Go name: "PreSharedKey".
   */
  preSharedKey?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * The peer private key.
   *
   * Go name: "PublicKey".
   */
  publicKey: Scalars["String"]["input"];
};

export type JobQueryVariables = Exact<{
  batchLocationHash: Scalars["String"]["input"];
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
