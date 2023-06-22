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

/**
 * jkuri/bore tunnel Transport for StepRun.
 *
 * Bore is a proxy to expose TCP sockets.
 */
export type Bore = {
  /** Bore server IP/Address. */
  address: Scalars["String"];
  /** The bore server port. */
  port: Scalars["Int"];
  /** Target port. */
  targetPort: Scalars["Int"];
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
   */
  apptainer?: InputMaybe<Scalars["Boolean"]>;
  /**
   * Use DeepSquare-hosted images.
   *
   * By setting to true, apptainer will be set to true.
   */
  deepsquareHosted?: InputMaybe<Scalars["Boolean"]>;
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

/** HTTPData describes the necessary variables to connect to a HTTP storage. */
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
  /**
   * Options modifies the mount options.
   *
   * Accepted: ro, rw
   */
  options: Scalars["String"];
};

export type Mutation = {
  /** Submit a Job and retrieve the batch location hash. */
  submit: Scalars["String"];
};

export type MutationSubmitArgs = {
  job: Job;
};

/**
 * Connect a network interface on a StepRun.
 *
 * The network interface is connected via slirp4netns.
 */
export type NetworkInterface = {
  /** Use the bore transport. */
  bore?: InputMaybe<Bore>;
  /** Use the wireguard transport. */
  wireguard?: InputMaybe<Wireguard>;
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
   * Depends on wait for async tasks to end before launching this step.
   *
   * DependsOn uses the `handleName` property of a `StepAsyncLaunch`.
   *
   * Only steps at the same level can be awaited.
   *
   * BE WARNED: Uncontrolled `dependsOn` may results in dead locks.
   */
  dependsOn?: InputMaybe<Array<Scalars["String"]>>;
  /**
   * Run a for loop if not null.
   *
   * Is exclusive with "run", "launch".
   */
  for?: InputMaybe<StepFor>;
  /**
   * Launch a background process to run a group of commands if not null.
   *
   * Is exclusive with "run", "for".
   */
  launch?: InputMaybe<StepAsyncLaunch>;
  /**
   * Name of the instruction.
   *
   * Is used for debugging.
   */
  name?: InputMaybe<Scalars["String"]>;
  /**
   * Run a command if not null.
   *
   * Is exclusive with "for", "launch".
   */
  run?: InputMaybe<StepRun>;
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
   */
  handleName?: InputMaybe<Scalars["String"]>;
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
   */
  signalOnParentStepExit?: InputMaybe<Scalars["Int"]>;
  /** Steps are run sequentially. */
  steps: Array<Step>;
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
  /**
   * Command specifies a shell script.
   *
   * If container is used, command automatically overwrite the ENTRYPOINT and CMD. If you want to execute the entrypoint, it MUST be re-specified.
   *
   * You can install and use skopeo to inspect an image without having to pull it.
   *
   * Example: skopeo inspect --config docker://curlimages/curl:latest will gives "/entrypoint.sh" as ENTRYPOINT and "curl" as CMD. Therefore command="/entrypoint.sh curl".
   */
  command: Scalars["String"];
  /**
   * Container definition.
   *
   * If null, run on the host.
   */
  container?: InputMaybe<ContainerRun>;
  /**
   * Add custom network interfaces.
   *
   * ONLY enabled if network is "slirp4netns".
   *
   * Due to the nature of slirp4netns, the user is automatically mapped as root in order to create network namespaces and add new network interfaces.
   *
   * The tunnel interfaces will be named net0, net1, ... netX.
   *
   * The default network interface is tap0, which is a TAP interface connecting the host and the network namespace.
   */
  customNetworkInterfaces?: InputMaybe<Array<NetworkInterface>>;
  /**
   * DisableCPUBinding disables process affinity binding to tasks.
   *
   * Can be useful when running MPI jobs.
   *
   * If null, defaults to false.
   */
  disableCpuBinding?: InputMaybe<Scalars["Boolean"]>;
  /**
   * Configuration for the DNS in "slirp4netns" mode.
   *
   * ONLY enabled if network is "slirp4netns".
   *
   * A comma-separated list of DNS IP.
   */
  dns?: InputMaybe<Array<Scalars["String"]>>;
  /** Environment variables accessible over the command. */
  env?: InputMaybe<Array<EnvVar>>;
  /**
   * Remap UID to root. Does not grant elevated system permissions, despite appearances.
   *
   * If the "default" (Enroot) container runtime is used, it will use the `--container-remap-root` flags.
   *
   * If the "apptainer" container runtime is used, the `--fakeroot` flag will be passed.
   *
   * If no container runtime is used, `unshare --user --map-root-user --mount` will be used and a user namespace will be created.
   *
   * It is not recommended to use mapRoot with network=slirp4netns, as it will create 2 user namespaces (and therefore will be useless).
   *
   * If null, default to false.
   */
  mapRoot?: InputMaybe<Scalars["Boolean"]>;
  /**
   * MPI selection.
   *
   * Must be one of: none, pmix_v4, pmi2.
   *
   * If null, will default to infrastructure provider settings (which may not be what you want).
   */
  mpi?: InputMaybe<Scalars["String"]>;
  /**
   * Type of core networking functionality.
   *
   * Either: "host" (default) or "slirp4netns" (rootless network namespace).
   *
   * Using "slirp4netns" will automatically enables mapRoot.
   */
  network?: InputMaybe<Scalars["String"]>;
  /** Allocated resources for the command. */
  resources?: InputMaybe<StepRunResources>;
  /**
   * Shell to use.
   *
   * Accepted: /bin/bash, /bin/ash, /bin/sh
   * Default: /bin/sh
   */
  shell?: InputMaybe<Scalars["String"]>;
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
   */
  workDir?: InputMaybe<Scalars["String"]>;
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

/**
 * Wireguard VPN Transport for StepRun.
 *
 * The Wireguard VPN can be used as a gateway for the steps. All that is needed is a Wireguard server outside the cluster that acts as a public gateway.
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
   */
  address?: InputMaybe<Array<Scalars["String"]>>;
  /** The peers connected to the wireguard interface. */
  peers?: InputMaybe<Array<WireguardPeer>>;
  /** The client private key. */
  privateKey: Scalars["String"];
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
   */
  allowedIPs?: InputMaybe<Array<Scalars["String"]>>;
  /**
   * The peer endpoint.
   *
   * Format is IP:port.
   *
   * This would be the Wireguard server.
   */
  endpoint?: InputMaybe<Scalars["String"]>;
  /**
   * Initiate the handshake and re-initiate regularly.
   *
   * Takes seconds as parameter. 25 seconds is recommended.
   *
   * You MUST set the persistent keepalive to enables UDP hole-punching.
   */
  persistentKeepalive?: InputMaybe<Scalars["Int"]>;
  /** The peer pre-shared key. */
  preSharedKey?: InputMaybe<Scalars["String"]>;
  /** The peer private key. */
  publicKey: Scalars["String"];
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
