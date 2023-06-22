# DeepSquare SDK

This package provides a straightforward interface to the DeepSquare Grid. With this SDK, users can easily submit jobs to the Grid, pay with their credits, and later retrieve job information for status checks and cost tracking.

## Introduction

The essence of the DeepSquare Grid lies in its workflows. These workflows break down operations to be run on the Grid into simple steps, facilitating easy access to high-performance computing resources.

Begin your journey with our platform by following our [Getting Started Guide](examples/hello-world/README.md), the link to which will be provided shortly.

For a glimpse into the variety of jobs you can run on the DeepSquare Grid, peruse our [workflow catalog](https://github.com/deepsquare-io/workflow-catalog). It showcases a broad array of examples demonstrating the platform's capabilities.

Stay informed about the latest updates and enhancements by following [this repository](https://github.com/deepsquare-io/deepsquare-client).

We can't wait to see what you'll build next!

## Obtaining Credits

Using the platform requires credit tokens for job execution and a minor amount of SQUARE tokens to cover the fees. Apply for free credits through [this form](https://share-eu1.hsforms.com/18lhtQBNNTVWVRXCm7t-83Aev6gi).

## Get Started

Kick-start your journey by exploring our [Getting Started Guide](examples/hello-world/README.md). This guide provides a walkthrough on running workflows on the DeepSquare grid. It covers steps like submitting a "Hello World" job, accessing job logs, and displaying the job output in the console.

## Requirements

- A crypto wallet, the private key of which you possess, carrying sufficient credit tokens to cater to job costs and a minor amount of SQUARE tokens to handle transaction fees on the DeepSquare `Deepji network`:

```yaml
Network name: DeepSquare Testnet C-Chain
RPC URL: https://testnet.deepsquare.run/rpc
Chain ID: 179188`
```

You can add this network automatically if you have a wallet extension like `MetaMask` or `Core Wallet` installed on your browser and you visit [app.deepsquare.run/](https://app.deepsquare.run/) and connect to the app via your crypto wallet. A pop-up will prompt you to install the DeepSquare network.

- We employ BigNumber from `@ethersproject/bignumber` throughout this package, particularly for method arguments. Ensure to install this package for seamless interaction with the client.

## Client Instantiation

If you haven't yet, we recommend following our [Getting Started Guide](examples/hello-world/README.md) where you'll be directed through running a workload on the DeepSquare grid.

To initiate a client instance, you'll need a private key from a web3 wallet. This wallet should carry enough credits for job costs and a small number of Squares tokens for transaction fees. Although you can modify the contract and API interacted with by the package, remember only the default configurations are ensured to work properly.

```typescript
import DeepSquareClient from "@deepsquare/deepsquare-client";
```

const deepSquareClient = await DeepSquareClient.build("myWeb3PrivateKey");`

## Developing the Client

If you wish to enhance or update the deepsquare-client library, perform the following :

In the folder containing the deepsquare-client,

```bash
pnpm build
pnpm link --global
```

Then, in the other repo using the development version, do

```bash
pnpm link --global  @deepsquare/deepsquare-client
```

## Documentation

For a detailed API reference and job specification, please refer to the [official DeepSquare documentation](https://docs.deepsquare.run/workflow/introduction/overview)

## Troubleshooting

If you run into any issues:

- Ensure that the environment variables in the `.env` file are set correctly.
- Verify that you have a stable internet connection and can access the DeepSquare platform.
- Check that you have the required permissions and resources on the platform to submit jobs.

If these steps don't resolve the issue:

- Post an [issue](https://github.com/deepsquare-io/deepsquare-client/issues) on the DeepSquare GitHub repository, providing a detailed account of the problem.
- Reach the [Discord community](https://discord.gg/UwaHJcNvq9) for direct support and engaging discussions.

Remember, the DeepSquare team is always here to help and ensure a seamless experience for you.
