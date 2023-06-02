import DeepSquareClient from "@deepsquare/deepsquare-client";
import { BigNumber } from "@ethersproject/bignumber";
import dotenv from "dotenv";
import { join } from "path";
dotenv.config();

async function main() {
  const args = process.argv.slice(2);

  const privateKey = args.length > 0 ? args[0] : process.env.PRIVATE_KEY as string;

  const depositAmount = args.length > 1 ? BigNumber.from(args[1]) : BigNumber.from("10000000000000");

  const deepSquareClient = await DeepSquareClient.build(
    privateKey,
    process.env.METASCHEDULER_ADDR as string,
    process.env.ENDPOINT as string
  );

  await deepSquareClient.setAllowance(depositAmount);
}

main();