## Example Readme

### Description
This example demonstrates the usage of the DeepSquareClient library to submit and retrieve logs from a job using the DeepSquare platform. The code provided showcases how to submit a "Hello World" job, retrieve the logs, and print the job output to the console.

### Prerequisites
Before running the example, make sure you have the following requirements met:

- Node.js installed on your machine
- [pnpm](https://pnpm.io/) package manager installed globally

### Installation
To install the required dependencies, follow these steps:

1. Open a terminal or command prompt.
2. Navigate to the directory where the example code is located.
3. Run the following command to install the dependencies:

```
pnpm install
```

### Configuration
Before running the example, you need to configure the environment variables. Follow these steps:

1. Create a `.env` file in the same directory as the example code.
2. Open the `.env` file and add the following lines:

```
PRIVATE_KEY=<Your_Private_Key>
METASCHEDULER_ADDR=<MetaScheduler_Address>
ENDPOINT=<Endpoint_URL>
```

Replace `<Your_Private_Key>`, `<MetaScheduler_Address>`, and `<Endpoint_URL>` with the corresponding values provided by the DeepSquare platform.

### Running the Example
To run the example, follow these steps:

1. Open a terminal or command prompt.
2. Navigate to the directory where the example code is located.
3. Run the following command:

```
pnpm start
```

The code will execute and perform the following steps:

1. Define a "Hello World" job configuration.
2. Build an instance of the DeepSquareClient using the provided environment variables.
3. Set the allowance for the client using a deposit amount.
4. Submit the job to the DeepSquare platform.
5. Print the job ID to the console.
6. Retrieve and print the job output logs.

If everything is set up correctly, you should see the job ID and the "Hello World" message printed to the console.

### Notes
- Make sure to replace the environment variables (`<Your_Private_Key>`, `<MetaScheduler_Address>`, `<Endpoint_URL>`) in the `.env` file with the actual values provided by the DeepSquare platform.
- The example assumes that you have an account and access to the DeepSquare platform.
- For further customization and utilization of the DeepSquareClient library, refer to the library's documentation and additional code samples.

### Troubleshooting
If you encounter any issues or errors while running the example, please ensure the following:

- Double-check that the environment variables in the `.env` file are correctly set.
- Confirm that you have a stable internet connection and access to the DeepSquare platform.
- Ensure that you have the necessary permissions and resources available on the platform to submit jobs.

If the problem persists, please contact the DeepSquare support team for further assistance.
