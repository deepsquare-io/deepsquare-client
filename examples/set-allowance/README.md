# DeepSquare Client Setup Script

This script helps you set up your DeepSquare Client with a private key and deposit amount. The script is written in TypeScript and requires a Node.js environment to run.

## Usage

1. Install dependencies with `npm install`.
2. Run the script with `node script.js [privateKey] [depositAmount]`

## Parameters

- `privateKey` (optional): Your private key. If provided, it will override the private key specified in the environment variable `PRIVATE_KEY`.
- `depositAmount` (optional): The amount to deposit. If not provided, the default value of "10000000000000" will be used.

## Environment Variables

The script uses the following environment variables:

- `PRIVATE_KEY`: Your private key. This is used if no `privateKey` is provided as an argument.
- `METASCHEDULER_ADDR`: The MetaScheduler address. This should be defined in your .env file.
- `ENDPOINT`: The endpoint URL. This should be defined in your .env file.
