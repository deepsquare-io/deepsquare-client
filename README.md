# DeepSquare SDK

This package aims to provide a simple and abstracted from web3 interface to the DeepSquare Grid. With this SDK, you will
be able to send jobs to the Grid using your credits and retrieve them afterwards to track their status and cost.

## Requirements

We use BigNumber from @ethersproject/bignumber across this package and especially for arguments of methods. Please make
sure to install this package to communicate properly with the client.

## Instanciating the client

In order to get an instance of the client, you will need the private key of a web3 wallet, containing credits to pay for
the jobs, and also few Squares (SQR) to pay the transaction fees. You can also modify the contract and the API the
package is interacting with, but remember only the default values are guaranteed to work.

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";

const deepSquareClient = new DeepSquareClient("myWeb3PrivateKey");
```

## Developing the client

If you want to improve or update the deepsquare-client library do the following : 


In the folder containing the deepsquare-client

```
pnpm build
pnpm link --global
```

And then in the other repo using the development version you do 

```
pnpm link --global  @deepsquare/deepsquare-client       

```

## Using the client

Most of our methods are asynchronous methods, so make sure to await them to avoid race condition.

### Send a job

First of all, you will have to deposit credits that will be used to run jobs. Note that running jobs will consume
credits during their whole lifecycle, thus if you run out of credit, all your jobs will be cancelled.
credits. We recommend to implement a side service that deposit regularly credit not to interrupt any of your jobs.

The deposit of credits is technically an allowance (similar to what UniSwap does).

To deposit credits, you can do so :

```typescript
const depositAmount = BigNumber.from('10000000000000');

await deepSquareClient.setAllowance(depositAmount);
```

Then, you can request a job (note that the job name is limited to 32 characters) :

```typescript
const jobId = await deepSquareClient.submitJob(myJob, 'myJob');
```

The jobId returned can then be used to retrieve information and eventually logs from this job.
Check last section to see the full specification of a job.

#### Control the cost of a job. 

By default a job has 1000 credits (= 1$). If you want to reduce is you can use en extra parameter

For example the following would run a 6 minutes job on a 1 GPU.
```typescript
const jobId = await deepSquareClient.submitJob(myJob, 'myJob', 1e2);
```

> Important note: The amount must be an integer.

### Retrieve job information

You can retrieve job information by using the getJob method :

```typescript
const job = deepSquareClient.getJob(jobId);
```

The returned object contains several properties including :

- ```status``` :

```typescript
  enum JobStatus {
  PENDING = 0,
  META_SCHEDULED = 1,
  SCHEDULED = 2,
  RUNNING = 3,
  CANCELLED = 4,
  FINISHED = 5,
  FAILED = 6,
  OUT_OF_CREDITS = 7
} 
```

- ```cost``` which contains the ```finalCost``` property that represents the job cost in credit once it is finished.
- ```time``` which contains the timestamps ```start``` and ```end``` representing the time bounds of the job.

### Retrieve job logs

Job logs can be retrieved using a gRPC streaming service. 
Here is how to use it: 

1. Get the log methods 

```typescript
const logsMethods = deepSquareClient.getLogsMethods(_jobId);
const [read, stopFetch] = await logsMethods.fetchLogs();
```

2. Fetch the logs : 

The ```fetchLogs``` opens a stream and returns an AsyncIterable you can read this way :

```typescript
for await (const log of read) {
  const lineStr = decoder.decode(log.data);
  console.log(lineStr)
}
```

3. Once you are done, you should close the stream 

```typescript
stopFetch();
```

### Cancel a job

In order to cancel a job you can use :

```typescript
await deepSquareClient.cancel(jobId);
```

## Example 

Below a plain javascript fully working example launching a hello world job. 

> Don't forget to setup your env


```javascript
import DeepSquareClient from "@deepsquare/deepsquare-client";
import { BigNumber } from 'ethers';

async function main() {
  // Define the job
  const helloWorldJob = {
    "resources": {
      "tasks": 1,
      "gpusPerTask": 0,
      "cpusPerTask": 1,
      "memPerCpu": 1024
    },
    "enableLogging": true,
    "steps": [
      {
        "name": "hello world",
        "run": {
          "command": "echo \"Hello World\""
        }
      }
    ]
  };

  // Create the DeepSquareClient
  const deepSquareClient = new DeepSquareClient(
    process.env.PRIVATE_KEY as string,
    process.env.METASCHEDULER_ADDR as string,
    process.env.CREDIT_ADDR as string,
    process.env.ENDPOINT as string
  );

  // Set allowance (you can also do that by loading your private key in metamask add head to https://app.deepsquare.run)
  const depositAmount = BigNumber.from('10000000000000');
  await deepSquareClient.setAllowance(depositAmount);

  // Launch the job 
  const randomString = Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
  const jobId = await deepSquareClient.submitJob(helloWorldJob, `hello_world_${randomString}`);

  // Print logs
  console.log(`My job id ${jobId}`);
  const logsMethods = deepSquareClient.getLogsMethods(jobId);
  const [read, stopFetch] = await logsMethods.fetchLogs();
  const decoder = new TextDecoder();

  for await (const log of read) {
    // Fetching job output here (e.g. anything printing to terminal, here Hello World)
    console.log(decoder.decode(log.data));
  }

  stopFetch();
}

main();
```







```

## Job specification

```typescript
"A Job is a finite sequence of instructions."

interface Job {
  /**
   * Allocated resources for the job.
   * Each resource is available as environment variables:
   * - $NTASKS: number of allowed parallel tasks
   * - $CPUS_PER_TASK: number of CPUs per task
   * - $MEM_PER_CPU: MB of memory per CPU
   * - $GPUS_PER_TASK: number of GPUs per task
   * - $GPUS: total number of GPUS
   * - $CPUS: total number of CPUS
   * - $MEM: total number of memory in MB
   */
  resources: JobResources

  /**
   * Environment variables accessible for the entire job.
   */
  env?: EnvVar[]

  /**
   * EnableLogging enables the DeepSquare GRID Logger.
   */
  enableLogging: boolean

  /**
   * Pull data at the start of the job.
   *
   * It is recommended to set the mode of the data by filling the `inputMode` field.
   */
  input: TransportData

  /**
   * InputMode takes an integer that will be used to change the mode recursively (chmod -R) of the input data.
   *
   * The number shouldn't be in octal but in decimal. A mode over 512 is not accepted.
   *
   * Common modes:
   * - 511 (user:rwx group:rwx world:rwx)
   * - 493 (user:rwx group:r-x world:r-x)
   * - 448 (user:rwx group:--- world:---)
   *
   * If null, the mode won't change and will default to the source.
   */
  inputMode?: number


  steps: Step[]

  /**
   * Push data at the end of the job.

   * Continuous sync/push can be enabled using the `continuousOutputSync` flag.
   */
  output: TransportData

  /**
   * ContinuousOutputSync will push data during the whole job.
   *
   * This is useful when it is not desired to lose data when the job is suddenly stopped.
   *
   * ContinousOutputSync is not available with HTTP.
   */
  continuousOutputSync: boolean
}

/**
 * An environment variable.
 *
 * Accessible via: "$key". "Key" name must follows the POSIX specifications (alphanumeric with underscore).
 */
interface EnvVar {
  key: string
  value: string
}


/**
 * HTTPData describes the necessary variables to connect to a HTTP storage.
 */
interface HTTPData {
  url: string
}

/**
 * S3Data describes the necessary variables to connect to a S3 storage.
 */
interface S3Data {
  /**
   * S3 region. Example: "us‑east‑2".
   */
  region: string

  /**
   * The S3 Bucket URL. Must not end with "/".
   *
   * Example: "s3://my-bucket".
   */
  bucketUrl: string

  /**
   * The absolute path to a directory/file inside the bucket. Must start with "/".
   */
  path: string

  /**
   * An access key ID for the S3 endpoint.
   */
  accessKeyId: string

  /**
   * A secret access key for the S3 endpoint.
   */
  secretAccessKey: string

  /**
   * A S3 Endpoint URL used for authentication. Example: https://s3.us‑east‑2.amazonaws.com
   */
  endpointUrl: string

  /**
   * DeleteSync removes destination files that doesn't correspond to the source.
   *
   * This applies to any type of source to any type of destination (s3 or filesystem).
   *
   * See: s5cmd sync --delete.
   *
   * If null, defaults to false.
   */
  deleteSync: boolean
}

interface TransportData {
  /**
   * Use http to download a file or archive, which will be autoextracted.
   */
  http?: HTTPData

  /**
   * Use s3 to sync a file or directory.
   */
  s3?: S3Data
}

/**
 * JobResources are the allocated resources for a job in a cluster.
 */
interface JobResources {
  /**
   * Number of tasks which are run in parallel.
   *
   * Can be greater or equal to 1.
   */
  tasks: number

  /**
   * Allocated CPUs per task.
   *
   * Can be greater or equal to 1.
   */
  cpusPerTask: number

  /**
   * Allocated memory (MB) per task.
   *
   * Can be greater or equal to 1.
   */
  memPerCpu: number

  /**
   * Allocated GPUs per task.
   *
   * Can be greater or equal to 0.
   */
  gpusPerTask: number
}

/**
 * Step is one instruction.
 */
interface Step {
  /**
   * Name of the instruction.
   */
  name: string

  /**
   * Run a command if not null.
   *
   * Is mutually exclusive with "for".
   */
  run: StepRun

  /**
   * Run a for loop if not null.
   *
   * Is mutually exclusive with "run".
   */
  for: StepFor
}

/**
 * StepRunResources are the allocated resources for a command in a job.
 */
interface StepRunResources {
  /**
   * Number of tasks which are run in parallel.
   *
   * Can be greater or equal to 1.
   *
   * If null, default to 1.
   */
  tasks?: number

  /**
   * Allocated CPUs per task.
   *
   * Can be greater or equal to 1.
   *
   * If null, defaults to the job resources.
   */
  cpusPerTask?: number

  /**
   * Allocated memory (MB) per task.
   *
   * Can be greater or equal to 1.
   *
   * If null, defaults to the job resources.
   */
  memPerCpu?: number

  /**
   * Allocated GPUs per task.
   *
   * Can be greater or equal to 0.
   *
   * If null, defaults to the job resources.
   */
  gpusPerTask?: number
}

/**
 * Mount decribes a Bind Mount.
 */
interface Mount {
  hostDir: string

  containerDir: string
  /**
   * Options modifies the mount options.
   *
   * Accepted: ro, rw
   */
  options: string
}

interface ContainerRun {
  /**
   * Run the command inside a container with Pyxis.
   *
   * Format: image:tag. Registry and authentication is not allowed on this field.
   *
   * If the default container runtime is used:
   *
   * - Use an absolute path to load a squashfs file. By default, it will search inside $STORAGE_PATH. /input will be equivalent to $DEEPSQUARE_INPUT, /output is $DEEPSQUARE_OUTPUT
   *
   * If apptainer=true:
   *
   * - Use an absolute path to load a sif file or a squashfs file. By default, it will search inside $STORAGE_PATH. /input will be equivalent to $DEEPSQUARE_INPUT, /output is $DEEPSQUARE_OUTPUT
   *
   * Examples:
   *
   * - library/ubuntu:latest
   * - /my.squashfs
   */
  image: string

  /**
   * Mount decribes a Bind Mount.
   */
  mounts?: Mount[]

  /**
   * Username of a basic authentication.
   */
  username?: string

  /**
   * Password of a basic authentication.
   */
  password?: string

  /**
   * Container registry host.
   *
   * Defaults to registry-1.docker.io
   */
  registry?: string

  /**
   * Run with Apptainer as Container runtime instead of Pyxis.
   *
   * By running with apptainer, you get access Deepsquare-hosted images.
   *
   * Defaults to false.
   */
  apptainer?: boolean

  /**
   * Use DeepSquare-hosted images.
   *
   * By setting to true, apptainer will be set to true.
   */
  deepsquareHosted?: boolean

  /**
   * X11 mounts /tmp/.X11-unix in the container.
   */
  x11?: boolean
}

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
interface StepRun {
  /**
   * Allocated resources for the command.
   */
  resources: StepRunResources

  /**
   * Container definition.
   *
   * If undefined, run on the host.
   */
  container?: ContainerRun

  /**
   * DisableCPUBinding disables process affinity binding to tasks.
   *
   * Can be useful when running MPI jobs.
   *
   * If null, defaults to false.
   */
  disableCpuBinding?: boolean

  /**
   * Environment variables accessible over the command.
   */
  env?: EnvVar[]

  /**
   * Command specifies a shell script.
   */
  command: string

  /**
   * Shell to use.
   *
   * Accepted: /bin/bash, /bin/ash, /bin/sh
   * Default: /bin/sh
   */
  shell?: string
}

/**
 * StepFor describes a for loop.
 */
interface StepFor {
  /**
   * Do a parallel for loop. Each iteration is run in parallel.
   */
  parallel: boolean

  /**
   * Item accessible via the {{ .Item }} variable. Index accessible via the $item variable.
   *
   * Mutually exclusive with "range".
   */
  items?: string[]


  /**
   * Index accessible via the $index variable.
   *
   * Mutually exclusive with "items".
   */
  range?: ForRange

  /**
   * Steps are run sequentially in one iteration.
   */
  steps: Step[]
}

/**
 * ForRange describes the parameter for a range loop.
 */
interface ForRange {
  /**
   * Begin is inclusive.
   */
  begin: number

  /**
   * End is inclusive.
   */
  end: number

  /**
   * Increment counter by x count. If null, defaults to 1.
   */
  increment?: number
}
```
