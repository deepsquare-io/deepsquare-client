import DeepSquareClient, {
  FormatJobStatus,
  isJobTerminated,
} from "@deepsquare/deepsquare-client";
import { RpcError } from "@protobuf-ts/runtime-rpc";
import dotenv from "dotenv";
import { Hex, parseEther } from "viem";

dotenv.config();

async function main() {
  // Instantiate the DeepSquareClient
  const deepSquareClient = new DeepSquareClient(
    process.env.PRIVATE_KEY as Hex,
    undefined,
    process.env.METASCHEDULER_ADDR as Hex
  );

  // Worflow
  const myJob = {
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

  // 'Allowance' lets DeepSquare use a set amount of your tokens to pay for jobs, like a spending limit.
  // DeepSquare can only use up to the limit you set, ensuring control and security over your wallet.
  const depositAmount = parseEther("1000");
  await deepSquareClient.setAllowance(depositAmount);

  // Launch the job
  // The 'credits' specify how much of your allowance is used for a particular job. For instance,
  // if you set an allowance of 1000 and use 100 credits for a job, you'll still have 900 in allowance
  // for future jobs, no need to set a new allowance until your total credits exceed it.
  const credits = parseEther("1000");
  const jobId = await deepSquareClient.submitJob(myJob, "myJob", credits);

  // Print logs
  console.log("JobId: " + jobId);
  const logsMethods = deepSquareClient.getLogsMethods(jobId);
  const [read, stopFetch] = await logsMethods.fetchLogs();
  const decoder = new TextDecoder();

  // Use a separate process for checking job status
  const [transitions, stopWatchJobTransitions] =
    await deepSquareClient.watchJobTransitions();
  (async () => {
    for await (const tr of transitions) {
      if (tr.args._jobId == jobId) {
        console.log(`job status is ${FormatJobStatus(tr.args._to ?? 0)}`);
        if (isJobTerminated(tr.args._to ?? 0)) {
          stopFetch();
          stopWatchJobTransitions();
        }
      }
    }
  })();

  // Start handling incoming logs separately. This is done asynchronously.
  // Here, we're using a 'for await...of' loop that works with async iterators.
  // 'read' is an async iterable that reads logs as they come in.
  try {
    for await (const log of read) {
      const lineStr = decoder.decode(log.data);
      console.log(lineStr);
    }
  } catch (err) {
    if (err instanceof RpcError && err.code === "CANCELLED") {
      // Specific logic for 'CANCELLED' RpcError
    } else {
      // Logic for other errors or re-throw the error if you can't handle it
      throw err;
    }
  }

  // TODO: fix dangling promise
  process.exit(0);
}

main();
