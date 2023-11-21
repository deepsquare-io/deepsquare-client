import DeepSquareClient from "@deepsquare/deepsquare-client";
import { createLoggerClient } from "@deepsquare/deepsquare-client/grpc/node";
import dotenv from "dotenv";
import { Hex } from "viem";

dotenv.config();

async function main() {
  // Instantiate the DeepSquareClient
  const client = DeepSquareClient.withPrivateKey(
    process.env.PRIVATE_KEY as Hex,
    createLoggerClient,
    process.env.METASCHEDULER_ADDR as Hex,
  );

  // Watch live approvals and changes on the allowance
  const [approvals, stopWatchApproval] = await client.watchApproval();
  const [allowances, stopWatchAllowance] = await client.watchAllowance();

  try {
    // Print out the live data
    (async () => {
      for await (const approval of approvals) {
        console.log(
          `<--approval: ${JSON.stringify(
            approval.args,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value, // return everything else unchanged
          )}`,
        );
      }
    })();
    (async () => {
      for await (const allowance of allowances) {
        console.log(`<--allowance: ${allowance}`);
      }
    })();

    await new Promise((r) => setTimeout(r, 2000));

    await client.setAllowance(100000000003n);
    console.log(`set allowance: ${await client.getAllowance()}`);

    await new Promise((r) => setTimeout(r, 2000));
  } finally {
    stopWatchApproval();
    stopWatchAllowance();
  }

  // TODO: fix dangling promise
  process.exit(0);
}

main();
