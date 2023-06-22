import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";

export function createLoggerClient(): LoggerAPIClient {
  const transport = new GrpcTransport({
    host: "grid-logger.deepsquare.run:443",
    channelCredentials: ChannelCredentials.createSsl(),
  });
  return new LoggerAPIClient(transport);
}
