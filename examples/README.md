# DeepSquare Client SDK Examples

This directory contains a set of examples demonstrating the different functionalities of the DeepSquare client SDK. Each example provides a clear guide on how to utilize the SDK to interact with the DeepSquare Grid.

## Table of Contents

- [Send a Job](#send-a-job)
- [Retrieve Job Information](#retrieve-job-information)
- [Retrieve Job Logs](#retrieve-job-logs)
- [Cancel a Job](#cancel-a-job)

## Send a Job

To submit a job to the DeepSquare Grid, you must first allow DeepSquare to access your credits. These credits represent the time allocation for your jobs. 

If you run out of credits, all your jobs will be cancelled. To avoid this, consider setting up a side service that periodically increases the credit allocation.

Here is how you can set the credit allowance:

```typescript
const depositAmount = BigNumber.from("10000000000000");

await deepSquareClient.setAllowance(depositAmount);
```

After setting the credit allowance, you can request a job as follows:

```typescript
const jobId = await deepSquareClient.submitJob(myJob, "myJob");
```

The returned `jobId` can then be used to retrieve information and logs from the submitted job.

> Important note: By default, a job is allocated 1000 credits (= 1$). If you want to reduce the allocated credits, you can add an extra parameter to the `submitJob` function:

```typescript
const jobId = await deepSquareClient.submitJob(myJob, "myJob", 1e2);
```

Remember, the allocated credit amount must be an integer.

## Retrieve Job Information

You can retrieve information about a job by using the `getJob` method:

```typescript
const job = deepSquareClient.getJob(jobId);
```

The returned object contains several properties including:

- `status` - Current status of the job, represented as an enumeration.
- `cost` - Contains the `finalCost` property that represents the job cost in credits once it is finished.
- `time` - Contains the timestamps `start` and `end` representing the time bounds of the job.

## Retrieve Job Logs

You can retrieve job logs using a gRPC streaming service:

1. Get the log methods:

```typescript
const logsMethods = deepSquareClient.getLogsMethods(_jobId);
const [read, stopFetch] = await logsMethods.fetchLogs();
```

2. Fetch the logs:

```typescript
for await (const log of read) {
  const lineStr = decoder.decode(log.data);
  console.log(lineStr);
}
```

3. Once you are done, close the stream:

```typescript
stopFetch();
```

## Cancel a Job

To cancel a job, use the following method:

```typescript
await deepSquareClient.cancel(jobId);
```

---