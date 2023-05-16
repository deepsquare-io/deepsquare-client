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

### Send a job

First of all, you will have to permit DeepSquare to access your credits to run jobs.

The credit allowance represents the time allocation. If you run out of credit, all your jobs will be cancelled.
You can set up a side service that periodically increases the credit allocation so that no jobs are interrupted.

To set the credit allowance, you can do so :

```typescript
const depositAmount = BigNumber.from("10000000000000");

await deepSquareClient.setAllowance(depositAmount);
```

Then, you can request a job (note that the job name is limited to 32 characters):

```typescript
const jobId = await deepSquareClient.submitJob(myJob, "myJob");
```

The `jobId` returned can then be used to retrieve information and eventually logs from this job.
Check the last section to see the full specification of a job.

#### Control the cost of a job.

By default, a job is allocated 1000 credits (= 1$). If you want to reduce the allocated credits, you can add an extra parameter to the `submitJob` function.

For example, the following would run a 6 minutes job on a 1 GPU.

```typescript
const jobId = await deepSquareClient.submitJob(myJob, "myJob", 1e2);
```

> Important note: The amount must be an integer.

### Retrieve job information

You can retrieve job information by using the `getJob` method :

```typescript
const job = deepSquareClient.getJob(jobId);
```

The returned object contains several properties including :

- `status` :

```typescript
enum JobStatus {
  PENDING = 0,
  META_SCHEDULED = 1,
  SCHEDULED = 2,
  RUNNING = 3,
  CANCELLED = 4,
  FINISHED = 5,
  FAILED = 6,
  OUT_OF_CREDITS = 7,
}
```

- `cost` which contains the `finalCost` property that represents the job cost in credit once it is finished.
- `time` which contains the timestamps `start` and `end` representing the time bounds of the job.

### Retrieve job logs

Job logs can be retrieved using a gRPC streaming service.
Here is how to use it:

1. Get the log methods

```typescript
const logsMethods = deepSquareClient.getLogsMethods(_jobId);
const [read, stopFetch] = await logsMethods.fetchLogs();
```

2. Fetch the logs :

The `fetchLogs` function opens a stream and returns an AsyncIterable you can read this way :

```typescript
for await (const log of read) {
  const lineStr = decoder.decode(log.data);
  console.log(lineStr);
}
```

3. Once you are done, you should close the stream

```typescript
stopFetch();
```

### Cancel a job

To cancel a job you can use :

```typescript
await deepSquareClient.cancel(jobId);
```

## Example

Below is a plain javascript fully working example that launches a "hello world" job.

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

## Job specification

A Job is a finite sequence of instructions.

The API reference can be read [in the official DeepSquare documentation](https://docs.deepsquare.run/docs/deploy-deepsquare/workflow-api-reference/job).
