# DeepSquare SDK

This package provides a straightforward interface to the DeepSquare Grid. With this SDK, users can easily **submit jobs** to the Grid, **pay** with their credits, and later retrieve job information for status checks and cost tracking.

## Introduction

The essence of the DeepSquare Grid lies in its [workflows](https://docs.deepsquare.run/workflow/getting-started/part-1-helloworld). These workflows break down operations to be run on the Grid into simple steps, facilitating easy access to high-performance computing resources.

For a glimpse into the variety of jobs you can run on the DeepSquare Grid, peruse our [workflow catalog](https://github.com/deepsquare-io/workflow-catalog). It showcases a broad array of examples demonstrating the platform's capabilities.

Stay informed about the latest updates and enhancements by following [this repository](https://github.com/deepsquare-io/deepsquare-client).

We can't wait to see what you'll build next!

## Set up the library

Begin your journey with our platform by following the guide below:

### Installation

Ensure you have:

- Node.js installed on your system

- Installed the [pnpm](https://pnpm.io/) package manager globally on your system.

- Installed BigNumber with

```
pnpm install @ethersproject/bignumber
```

- Install the library

```
  pnpm install @deepsquare/deepsquare-client
```

## Set up a wallet and get credits

### Prerequisites

Ensure you have:

- A crypto wallet and your associated private key. You can use wallets like [MetaMask](https://metamask.io/) or [Core Wallet](https://core.app/) and/or cli like [avalache-cli](https://docs.avax.network/subnets/install-avalanche-cli).

- [Carrying sufficient credit tokens](#obtaining-credits) to cater to job costs and a minor amount of SQUARE tokens to handle transaction fees on the DeepSquare `Deepji network`:

```yaml
Network name: DeepSquare Testnet C-Chain
RPC URL: https://testnet.deepsquare.run/rpc
Chain ID: 179188`
```

If you have a wallet extension such as `MetaMask` or `Core Wallet` installed on your browser, you can automatically add the DeepSquare network. Simply visit [app.deepsquare.run](https://app.deepsquare.run/) and connect to the app using your crypto wallet. A pop-up will then appear, prompting you to install the DeepSquare network.

### Obtaining Credits

Using the platform requires credit tokens for job execution and a minor amount of SQUARE tokens to cover the fees. Apply for free credits through [this form](https://app.deepsquare.run/credits).

## Using the client

We show below a high-level overview of the library covering various functionalities including setting the credit allowance, submitting a job, retrieving job information, retrieving job logs, and canceling a job. Detailed instructions on using the client are available in the [examples](./examples) directory.

Please refer to the [official DeepSquare documentation](https://docs.deepsquare.run/workflow/workflow-api-reference/job) for a detailed API reference and job specification.

### Compatibility Matrix

Launching a job involves technically submitting a transaction to a smart contract, referred to as the `meta-scheduler`. Typically, you would use the address corresponding to the `main` SDK Version. The deprecated version signifies the last supported contract that will be discontinued when a new version of the SDK is released.

| SDK Version         | Meta-scheduler Smart-contract address      |
| ------------------- | ------------------------------------------ |
| main                | 0x3a97E2ddD148647E60b4b94BdAD56173072Aa925 |
| v0.7.X              | 0xc9AcB97F1132f0FB5dC9c5733B7b04F9079540f0 |
| v0.6.X (deprecated) | 0x77ae38244e0be7cFfB84da4e5dff077C6449C922 |

### Client Instantiation

In this example, we assume you have a `PRIVATE_KEY` (see section [Setup a wallet](#set-up-the-wallet)) and a `METASCHEDULER_ADDR` (see section [Compatibility Matrix](#compatibility-matrix) below). If you're using MetaMask, here's a guide on [how to extract a private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key#:~:text=On%20the%20account%20page%2C%20click,click%20%E2%80%9CConfirm%E2%80%9D%20to%20proceed.).

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";

// Create the DeepSquareClient
const deepSquareClient = await DeepSquareClient.build(
  process.env.PRIVATE_KEY as string,
  process.env.METASCHEDULER_ADDR as string
);
```

For example, the following would run a 6 minutes job on a 1 GPU.

```typescript
const myJob = {
  resources: {
    tasks: 1,
    gpusPerTask: 0,
    cpusPerTask: 1,
    memPerCpu: 1024,
  },
  enableLogging: true,
  steps: [
    {
      name: "hello world",
      run: {
        command: 'echo "Hello World"',
      },
    },
  ],
};
const jobId = await deepSquareClient.submitJob(myJob, "myJob", 1e2);
```

> Important note: The amount must be an integer and amount are given in credits (1000 credits = 1$).

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

### Full example

Below is a plain javascript fully working example that launches the "hello world" job.
For a detailed breakdown of the code follow this [guide](examples/hello-world/README.md)

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

If you run into any issues:

- Ensure that the environment variables in the `.env` file are set correctly.
- Verify that you have a stable internet connection and can access the DeepSquare platform.
- Check that you have the required permissions and resources on the platform to submit jobs.

If these steps don't resolve the issue:

- Post an [issue](https://github.com/deepsquare-io/deepsquare-client/issues) on the DeepSquare GitHub repository, providing a detailed account of the problem.
- Reach the [Discord community](https://discord.gg/UwaHJcNvq9) for direct support and engaging discussions.

Remember, the DeepSquare team is always here to help and ensure a seamless experience for you.
