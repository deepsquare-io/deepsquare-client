import DeepSquareClient from "@deepsquare/deepsquare-client";
import { BigNumber } from '@ethersproject/bignumber';
import dotenv from 'dotenv'
dotenv.config()


async function main() {
  // Define the job
  const helloWorldJob = {
    "resources": {
      "tasks": 1,
      "gpusPerTask": 0,
      "cpusPerTask": 1,
      "memPerCpu": 1024
    },
    "enableLogging": true,
    "steps": [
      {
        "name": "hello world",
        "run": {
          "command": "echo \"Hello World\""
        }
      }
    ]
  };

  const deepSquareClient = await DeepSquareClient.build(
    process.env.PRIVATE_KEY as string,
    process.env.METASCHEDULER_ADDR as string,
    process.env.ENDPOINT as string
  );

  const depositAmount = BigNumber.from('10000000000000');
  await deepSquareClient.setAllowance(depositAmount);

  // Launch the job 
  const randomString = Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
  const jobId = await deepSquareClient.submitJob(helloWorldJob, `hello_world_${randomString}`, 1e2);

  // Print logs
  console.log(`My job id ${jobId}`);
  const logsMethods = deepSquareClient.getLogsMethods(jobId);
  const [read, stopFetch] = await logsMethods.fetchLogs();
  const decoder = new TextDecoder();

  for await (const log of read) {
    // Fetching job output here (e.g. anything printing to terminal, here Hello World)
    console.log(decoder.decode(log.data));
  }

  stopFetch();
}

main();
