# DeepSquare Job Submission and Log Retrieval Example

This example demonstrates the usage of the DeepSquareClient library to submit and retrieve logs from a job using the DeepSquare platform. The code showcases how to submit a "Hello World" job, retrieve the logs, and print the job output to the console.

## Prerequisites

- Node.js installed on your machine
- [pnpm](https://pnpm.io/) package manager installed globally

## Installation

1. Open a terminal or command prompt.
2. Navigate to the directory where the example code is located.
3. Run `pnpm install` to install the required dependencies.

## Configuration

Before running the example, you need to configure the environment variables:

1. Create a `.env` file in the same directory as the example code.
2. Add the following lines to the `.env` file:

   ```markdown
   PRIVATE_KEY=<Your_Private_Key>
   METASCHEDULER_ADDR=<MetaScheduler_Address>
   ENDPOINT=<Endpoint_URL>
   ```

   Replace `<Your_Private_Key>`, `<MetaScheduler_Address>`, and `<Endpoint_URL>` with the corresponding values provided by the DeepSquare platform.

## Usage

1. Open a terminal or command prompt.
2. Navigate to the directory where the example code is located.
3. Run `pnpm start` to execute the script.

The code will:

1. Define a "Hello World" job configuration.
2. Build an instance of the DeepSquareClient using the provided environment variables.
3. Set the allowance for the client using a deposit amount.
4. Submit the job to the DeepSquare platform.
5. Print the job ID to the console.
6. Retrieve and print the job output logs.

If everything is set up correctly, you should see the job ID and the "Hello World" message printed to the console.

## Notes

- Make sure to replace the placeholders in the `.env` file with the actual values provided by the DeepSquare platform.
- This example assumes that you have an account and access to the DeepSquare platform.
- For further customization and utilization of the DeepSquareClient library, refer to the library's documentation and additional code samples.
