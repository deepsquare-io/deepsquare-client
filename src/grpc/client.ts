import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";

export function createLoggerClient(loggerEndpoint: string): LoggerAPIClient {
  const transport = new GrpcTransport({
    host: loggerEndpoint,
    channelCredentials: ChannelCredentials.createSsl(),
  });
  return new LoggerAPIClient(transport);
}
