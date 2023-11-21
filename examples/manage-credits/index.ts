import DeepSquareClient from "@deepsquare/deepsquare-client";
import { createLoggerClient } from "@deepsquare/deepsquare-client/grpc/node";
import dotenv from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();

async function main() {
  // Instantiate the DeepSquareClient
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);
  const client = DeepSquareClient.withPrivateKey(
    process.env.PRIVATE_KEY as Hex,
    createLoggerClient,
    process.env.METASCHEDULER_ADDR as Hex,
  );

  // Watch live transfers and changes on the balance
  const [transfers, stopWatchTransfer] = await client.watchTransfer();
  const [balances, stopWatchBalance] = await client.watchBalance();

  try {
    // Print out the live data
    (async () => {
      for await (const transfer of transfers) {
        console.log(
          `<--transfer: ${JSON.stringify(
            transfer.args,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
          )}`,
        );
      }
    })();
    (async () => {
      for await (const balance of balances) {
        console.log(`<--balance: ${balance}`);
      }
    })();

    await new Promise((r) => setTimeout(r, 2000));

    await client.transferCredits(account.address, 10n);
    console.log(`balance: ${await client.getBalance()}`);

    await new Promise((r) => setTimeout(r, 2000));
  } finally {
    stopWatchTransfer();
    stopWatchBalance();
  }

  // TODO: fix dangling promise
  process.exit(0);
}

main();
