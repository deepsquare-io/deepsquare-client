import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import { LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";

export function createLoggerClient(): LoggerAPIClient {
  return new LoggerAPIClient(
    new GrpcWebFetchTransport({
      baseUrl: "https://grid-logger.deepsquare.run/",
    }),
  );
}
