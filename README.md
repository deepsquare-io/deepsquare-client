# DeepSquare SDK

This package aims to provide a simple and abstracted from web3 interface to the DeepSquare Grid. With this SDK, you will
be able to send jobs to the Grid using your credits and retrieve them afterwards to track their status and cost.

## Introduction

The power of the DeepSquare Grid lies in the workflows. The workflows define the sequences of operations that are to be executed on the Grid. We highly recommend exploring our [workflow catalog](https://github.com/deepsquare-io/workflow-catalog) to see the different types of jobs you can run on the DeepSquare Grid.

To stay updated on the latest additions and improvements, consider following this repository and the [workflow catalog](https://github.com/deepsquare-io/workflow-catalog) repository. By doing so, you'll be on the cutting edge of distributed computing, taking full advantage of the capabilities of the DeepSquare Grid.

We're excited to see what you build!

## Requirements

We use BigNumber from @ethersproject/bignumber across this package and especially for arguments of methods. Please make
sure to install this package to communicate properly with the client.

## Instanciating the client

In order to get an instance of the client, you will need the private key of a web3 wallet, containing credits to pay for
the jobs, and also few Squares (SQR) to pay the transaction fees. You can also modify the contract and the API the
package is interacting with, but remember only the default values are guaranteed to work.

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";

const deepSquareClient = await DeepSquareClient.build("myWeb3PrivateKey");
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

Detailed instructions on using the client are available in the [examples](./examples) directory. The examples cover various functionalities including setting the credit allowance, submitting a job, retrieving job information, retrieving job logs, and cancelling a job.

Please refer to the [official DeepSquare documentation](https://docs.deepsquare.run/workflow/workflow-api-reference/job). for a detailed API reference and job specification.

## Troubleshooting

If you encounter any issues:

- Double-check that the environment variables in the `.env` file are correctly set.
- Confirm that you have a stable internet connection and access to the DeepSquare platform.
- Ensure that you have the necessary permissions and resources available on the platform to submit jobs.

If the problem persists:

- Submit an [issue](https://github.com/deepsquare-io/deepsquare-client/issues) on the DeepSquare GitHub repository with a detailed description of the problem.
- Join the DeepSquare [Discord community](https://discord.gg/vZGcf7kx) for direct support and discussion.

The DeepSquare team is committed to providing assistance and making your experience as smooth as possible.
