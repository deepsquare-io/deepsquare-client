# DeepSquare SDK

This package provides a straightforward interface to the DeepSquare Grid. It allows users to easily **submit jobs** to the Grid, **pay** with their credits, and retrieve job information for status checks and cost tracking.

## Introduction

The DeepSquare Grid operates through [workflows](https://docs.deepsquare.run/workflow/getting-started/part-1-helloworld#hello-world-workflow). These workflows break down operations to be run on the Grid into simple steps, providing easy access to high-performance computing resources.

Start your journey with our platform by following the guide below.

Stay updated with the latest changes and enhancements by following [this repository](https://github.com/deepsquare-io/deepsquare-client).

We are excited to see what you'll create!

## Set up the library

### Installation

Install the library with:

```shell
npm install @deepsquare/deepsquare-client viem
```

Viem is used as the main Ethereum runtime. It can be used for with the browser runtime, or with a Node.js runtime.

## Setting up a Wallet and Obtaining Credits

### Prerequisites

Ensure you have:

- A crypto wallet and your associated private key. You can use wallets like `MetaMask` or `Core Wallet` and/or CLI tools like `avalanche-cli`

- Sufficient [credit tokens](#obtaining-credits) for job costs, and a minor amount of SQUARE tokens for transaction fees on the DeepSquare `Deepji network`:

DeepSquare network details:

```yaml
Network name: DeepSquare Testnet C-Chain
RPC URL: https://testnet.deepsquare.run/rpc
Chain ID: 179188
```

You can automatically add this network if you have a wallet extension like `MetaMask` or `Core Wallet` installed on your browser. Visit [app.deepsquare.run](https://app.deepsquare.run/) and connect to the app via your crypto wallet. A pop-up will prompt you to install the DeepSquare network.

### Obtaining Credits

Using the platform requires credit tokens for job execution and a minor amount of SQUARE tokens to cover the fees. Apply for free credits through [this form](https://app.deepsquare.run/credits).

## Getting Started

Here is a high-level overview of the library covering various functionalities including setting the credit allowance, submitting a job, retrieving job information, retrieving job logs, and cancelling a job. Detailed instructions on using the client are available in the [examples](https://chat.openai.com/examples) directory.

Please refer to the [official DeepSquare documentation](https://docs.deepsquare.run/workflow/workflow-api-reference/job) for a detailed API reference and job specification.

### Compatibility Matrix

To launch a job you technically submit a transaction to a smart contract called the meta-scheduler.
In general, you will be using the address corresponding to the `main` SDK Version, the deprecated version is the last contract supported that will be discontinued when a new version of the SDK is released.

| SDK Version          | Meta-scheduler Smart-contract address      |
| -------------------- | ------------------------------------------ |
| v0.14.X              | 0x7524fBB0c1e099A4A472C5A7b0B1E1E3aBd3fE97 |
| v0.13.X              | 0x196A7EB3E16a8359c30408f4F79622157Ef86d7c |
| v0.12.X              | 0xeD6Deb4c6E7e5D35c0d0FE3802663142e3E266da |
| v0.11.X              | 0x3707aB457CF457275b7ec32e203c54df80C299d5 |
| v0.10.X (deprecated) | 0xc9AcB97F1132f0FB5dC9c5733B7b04F9079540f0 |

### Submitting a job

In this example we assume you have a `PRIVATE_KEY` (see section [Setup a wallet](#set-up-the-wallet)) and a `METASCHEDULER_ADDR` (see section [Compatibility Matrix](#compatibility-matrix) below).

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";
import { createLoggerClient } from "@deepsquare/deepsquare-client/grpc/node";
import type { Hex } from "viem";

async function main() {
  // Create the DeepSquareClient
  const deepSquareClient = DeepSquareClient.withPrivateKey(
    process.env.PRIVATE_KEY as Hex, // Hex is a `0x{string}`
    createLoggerClient, // Select the logger (use node or browser depending on the platform)
    process.env.METASCHEDULER_ADDR as Hex, // Passing the smart-contracts address explicitely avoid unexpected changes.
  );
}
```

Let's run a simple "Hello World" job with 1000 credits allocated.

In this example, we assume that you have an allowance of at least 1000 credits. You can establish this allowance either from the [nexus portal](https://app.deepsquare.run/) header or by using the `setAllowance` method.

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";
import { createLoggerClient } from "@deepsquare/deepsquare-client/grpc/node";
import { parseEther, type Hex } from "viem";

async function main() {
  // ...

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

  // 'Allowance' lets DeepSquare use a set amount of your tokens to pay for jobs, like a spending limit.
  // DeepSquare can only use up to the limit you set, ensuring control and security over your wallet.
  const depositAmount = parseEther("1000");
  await deepSquareClient.setAllowance(depositAmount);

  // Launch the job
  // The 'credits' specify how much of your allowance is used for a particular job. For instance,
  // if you set an allowance of 1000 and use 100 credits for a job, you'll still have 900 in allowance
  // for future jobs, no need to set a new allowance until your total credits exceed it.
  const credits = parseEther("1000");
  const jobId = await deepSquareClient.submitJob(myJob, "myJob", credits);
}

main();
```

> [!WARNING]
> The amount must be a `bigint` with 18 decimals (like Wei). The easiest is to use the `parseEther` utility from Viem to convert a number to bigint with the right number of digits.

### More examples

More complete examples are available in the [examples directory](https://github.com/deepsquare-io/deepsquare-client/tree/main/examples).

## Job specification

A Job is a finite sequence of instructions.

The API reference can be read [in the official DeepSquare documentation](https://docs.deepsquare.run/workflow/workflow-api-reference/job).

## Troubleshooting

If you run into any issues:

- Ensure that the environment variables in the `.env` file are set correctly.
- Verify that you have a stable internet connection and can access the DeepSquare platform.
- Check that you have the required permissions and resources on the platform to submit jobs.

If these steps don't resolve the issue:

- Create an [issue](https://github.com/deepsquare-io/deepsquare-client/issues) on the DeepSquare GitHub repository, providing a detailed account of the problem.
- Reach the [Discord community](https://discord.gg/UwaHJcNvq9) for direct support and engaging discussions.

The DeepSquare team is always happy to help you and ensure a seamless experience for you.
