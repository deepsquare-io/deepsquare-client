# Getting Started

This guide shows you how to use the DeepSquareClient library to submit a job, manage your job's credit allocation, retrieve job information and logs on the DeepSquare platform. Specifically, you'll learn how to submit a "Hello World" job, fetch its logs, and display the job's output in your console.

Ensure you have a [wallet set up with credits](../../README.md#obtaining-credits) and that you meet [the requirements](../../README.md#prerequisites)

## Installation

Follow these steps:

1\. Open your terminal or command prompt.

2\. Clone the [DeepSquare repository](https://github.com/deepsquare-io/deepsquare-client) that houses the prepared examples

3\. Navigate to the directory containing the example code: `examples/hello-world`

4\. Run `pnpm install` to install the necessary dependencies.

## Configuration

Before executing the example, set up your environment variables:

1\. Create a `.env` file in the same directory as the example code.

2\. Insert the following lines into the `.env` file:

```markdown
PRIVATE_KEY=<Your_Private_Key>

METASCHEDULER_ADDR=<MetaScheduler_Address>
```

Replace `<Your_Private_Key>` with the private key from your crypto wallet. Note: Use a wallet that's dedicated for development on DeepSquare and does not contain valuable assets. If you're using MetaMask, here's a guide on [how to extract a private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key#:~:text=On%20the%20account%20page%2C%20click,click%20%E2%80%9CConfirm%E2%80%9D%20to%20proceed.).

Replace `<MetaScheduler_Address>` with the Metascheduler contract address. You can find this in our [compatibility matrix](../..//README.md#compatibility-matrix).

## Run the Example 

To simply the run the example use : 

```
pnpm start
```

## Step-by-Step Guide

Let's break down `deepsquare-client/examples/hello-world/index.ts`

### Imports

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";

import { parseUnits } from "@ethersproject/units";


import dotenv from "dotenv";

dotenv.config();
```

First, we import the necessary modules. `DeepSquareClient` is the interface we use to interact with the DeepSquare platform, `parseUnits` is used for handling large numbers, and `dotenv` is used to manage environment variables.

The `dotenv.config()` line loads the environment variables from the `.env` file that we set up earlier.

### Main

```typescript
async function main() {
```

We define an asynchronous function `main` which encapsulates our script. This allows us to use `await` keyword for promises in the function.

```typescript
const uses = [{ key: "os", value: "linux" }] as never;
```

This line defines tags as key-value pair that are used to add constraints on the compute provider that can run our workload. For example, we might want to exclusively run our job in Sion in Switzerland and add the pair `{ key: 'region', value: 'ch-sion'}`

```typescript
const deepSquareClient = await DeepSquareClient.build(
  process.env.PRIVATE_KEY as string,

  process.env.METASCHEDULER_ADDR as string
);
```

Here we're creating an instance of `DeepSquareClient`, passing in the private key and MetaScheduler address from our environment variables.

```typescript
  const args = process.argv.slice(2);
  let jobId = undefined;
  if (args.length == 1) {
    jobId = args[0];
    console.log(`Checking logs for existing job ${jobId}`);
  } else {
```

We're checking if there are any command line arguments. If there's one, it is assumed to be a job ID, and the script will check the logs for this existing job. Otherwise, a new job will be created.

```typescript
const helloWorldJob = {
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
```

Here, we're defining the configuration for our job. This includes specifying resources (like the number of tasks, GPUs per task, CPUs per task, and memory per CPU), enabling logging, and defining the steps for the job. If you want to know more about the significance of these keywords, please read our guide [How to write a workflow file](https://docs.deepsquare.run/workflow/getting-started/part-1-helloworld).

```typescript
const depositAmount = parseUnits("1000000", 18);
await deepSquareClient.setAllowance(depositAmount);
```

Before submitting the job, we set the credit allowance for the DeepSquare platform. It is expressed in [WEI](https://www.investopedia.com/terms/w/wei.asp). This is how many resources DeepSquare is allowed to use for our jobs. These credits represent the time allocation for your jobs. If your credits run out, all your jobs will be put in an `OUT_OF_CREDITS` status.
You can use this useful [WEI converter tool](https://eth-converter.com/) to convert your credits to WEI credits and vice versa.

```typescript
    jobId = await deepSquareClient.submitJob(
      helloWorldJob,
      `hello_world_${randomString}`,
      parseUnits("100", 18);,
      uses
    );
    console.log(`New job id ${jobId}, getting logs...`);
  }
```

Here, we're submitting the job to the DeepSquare platform. The `submitJob` function returns a `jobId` that we can use to monitor the job and retrieve its logs.

> **Note:** By default, a job is allocated 1000 credits (= 1$). If you want to reduce the allocated credits, you can add an extra parameter to the `submitJob` function:
>
> ```typescript
> const jobId = await deepSquareClient.submitJob(myJob, "myJob", 1e2);
> ```

````
```typescript
  const logsMethods = deepSquareClient.getLogsMethods(
    jobId,
    "grid-logger.dev.deepsquare.run:443"
  );

  const [read, stopFetch] = await logsMethods.fetchLogs();
  const decoder = new TextDecoder();
  for await (const log of read) {
    console.log(decoder.decode(log.data));
  }
  stopFetch();
}
main();
````

Finally, we're setting up a stream to fetch the logs from the job with the `getJob` method, printing out each line of the logs as they become available. Once we're done fetching the logs, we stop the stream.

The `main()` function call at the end of the script is what initiates the process when the script is run.
