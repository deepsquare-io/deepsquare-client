# Getting Started

This guide shows you how to use the DeepSquareClient library to submit a job and retrieve its logs from the DeepSquare platform. Specifically, you'll learn how to submit a "Hello World" job, fetch its logs, and display the job's output in your console.

## Prerequisites

Ensure you have:

- Node.js installed on your system
- Cloned [this repository](https://github.com/deepsquare-io/deepsquare-client) which houses the prepared examples.
- Installed the [pnpm](https://pnpm.io/) package manager globally on your system.

## Installation

Follow these steps:

1\. Open your terminal or command prompt.
2\. Navigate to the directory containing the example code: `examples\hello-world`
3\. Run `pnpm install` to install the necessary dependencies.

## Configuration

Before executing the example, set up your environment variables:

1\. Create a `.env` file in the same directory as the example code.
2\. Insert the following lines into the `.env` file:

```markdown
PRIVATE_KEY=<Your_Private_Key>
METASCHEDULER_ADDR=<MetaScheduler_Address>
```

Replace `<Your_Private_Key>` with your crypto wallet's private key. Important: please avoid using a wallet containing valuable assets. You should create a dedicated wallet for developement on deepquare.
If you are using MetaMask, [here is how to extract a private key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key#:~:text=On%20the%20account%20page%2C%20click,click%20%E2%80%9CConfirm%E2%80%9D%20to%20proceed.).
Replace `<MetaScheduler_Address>`, with the Metascheduler contract address you can find on the [compatibility matrix here](../../README.md#compatibility-matrix)

## Usage

To execute the script:

1\. Open your terminal or command prompt.
2\. Navigate to the directory containing the example code.
3\. Run `pnpm start`.

The code will then:

1\. Create a "Hello World" workflow.
2\. Create an instance of the DeepSquareClient using your environment variables.
3\. Set the client's allowance using a specified deposit amount.
4\. Submit the job to the DeepSquare platform.
5\. Display the job ID in the console.
6\. Retrieve and display the job's output logs.

If you've set up everything correctly, you should see the job ID and the "Hello World" message in your console.

## Notes

- Ensure to replace the placeholders in the `.env` file with the correct values given by the DeepSquare platform.
- This guide assumes you have an account and the necessary access to the DeepSquare platform.
- For advanced customizations and to fully leverage the DeepSquareClient library, check out the library's documentation and additional code samples.
