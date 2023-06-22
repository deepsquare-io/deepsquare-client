import DeepSquareClient from "@deepsquare/deepsquare-client";
import { BigNumber } from "@ethersproject/bignumber";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const uses = [{ key: "os", value: "linux" }] as never;
  const deepSquareClient = await DeepSquareClient.build(
    process.env.PRIVATE_KEY as string,
    process.env.METASCHEDULER_ADDR as string,
    process.env.ENDPOINT as string
  );
  const args = process.argv.slice(2);
  let jobId = undefined;
  if (args.length == 1) {
    jobId = args[0];
    console.log(`Checking logs for existing job ${jobId}`);
  } else {
    // Define the job
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

    const depositAmount = BigNumber.from("10000000000000");
    await deepSquareClient.setAllowance(depositAmount);

    // Launch the job
    const randomString = Array.from({ length: 4 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join("");
    jobId = await deepSquareClient.submitJob(
      helloWorldJob,
      `hello_world_${randomString}`,
      1e2,
      uses
    );
    console.log(`New job id ${jobId}, getting logs...`);
  }
  // Print logs
  const logsMethods = deepSquareClient.getLogsMethods(
    jobId
  );
  const [read, stopFetch] = await logsMethods.fetchLogs();
  const decoder = new TextDecoder();

  for await (const log of read) {
    // Fetching job output here (e.g. anything printing to terminal, here Hello World)
    console.log(decoder.decode(log.data));
  }

  stopFetch();
}

main();
