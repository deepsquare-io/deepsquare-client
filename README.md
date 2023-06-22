# DeepSquare SDK

This package aims to provide a simple and abstracted from web3 interface to the DeepSquare Grid. With this SDK, you will
be able to send jobs to the Grid using your credits and retrieve them afterwards to track their status and cost.

## Introduction

The power of the DeepSquare Grid lies in the workflows. The workflows define the sequences of operations that are to be executed on the Grid. We highly recommend exploring our [workflow catalog](https://github.com/deepsquare-io/workflow-catalog) to see the different types of jobs you can run on the DeepSquare Grid.

To stay updated on the latest additions and improvements, consider following this repository and the [workflow catalog](https://github.com/deepsquare-io/workflow-catalog) repository. By doing so, you'll be on the cutting edge of distributed computing, taking full advantage of the capabilities of the DeepSquare Grid.

We're excited to see what you build!

## Requirements

These are the supported smart-contracts:

| SDK Version         | Smart-contract address                     |
| ------------------- | ------------------------------------------ |
| main                | 0x3a97E2ddD148647E60b4b94BdAD56173072Aa925 |
| v0.7.X              | 0xc9AcB97F1132f0FB5dC9c5733B7b04F9079540f0 |
| v0.6.X (deprecated) | 0x77ae38244e0be7cFfB84da4e5dff077C6449C922 |

We use BigNumber from `@ethersproject/bignumber` across this package and especially for arguments of methods. Please make
sure to install this package to communicate properly with the client.

## Instanciating the client

In order to get an instance of the client, you will need the private key of a web3 wallet, containing credits to pay for
the jobs, and also few Squares (SQR) to pay the transaction fees. You can also modify the contract and the API the
package is interacting with, but remember only the default values are guaranteed to work.

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";

const deepSquareClient = await DeepSquareClient.build("myWeb3PrivateKey");
```

## Using the client

Detailed instructions on using the client are available in the [examples](./examples) directory. The examples cover various functionalities including setting the credit allowance, submitting a job, retrieving job information, retrieving job logs, and cancelling a job.

Please refer to the [official DeepSquare documentation](https://docs.deepsquare.run/workflow/workflow-api-reference/job). for a detailed API reference and job specification.

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
  const deepSquareClient = await DeepSquareClient.build(
    process.env.PRIVATE_KEY as string,
    process.env.METASCHEDULER_ADDR as string
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

The API reference can be read [in the official DeepSquare documentation](https://docs.deepsquare.run/workflow/workflow-api-reference/job).

## Troubleshooting

If you encounter any issues:

- Double-check that the environment variables in the `.env` file are correctly set.
- Confirm that you have a stable internet connection and access to the DeepSquare platform.
- Ensure that you have the necessary permissions and resources available on the platform to submit jobs.

If the problem persists:

- Submit an [issue](https://github.com/deepsquare-io/deepsquare-client/issues) on the DeepSquare GitHub repository with a detailed description of the problem.
- Join the DeepSquare [Discord community](https://discord.gg/vZGcf7kx) for direct support and discussion.

The DeepSquare team is committed to providing assistance and making your experience as smooth as possible.
