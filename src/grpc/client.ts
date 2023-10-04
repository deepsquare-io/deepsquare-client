import { ChannelCredentials } from "@grpc/grpc-js";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import { LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";

export function createLoggerClient(): LoggerAPIClient {
  let transport: RpcTransport;
  if (typeof window !== "undefined") {
    transport = new GrpcWebFetchTransport({
      baseUrl: "https://grid-logger.deepsquare.run/",
    });
  } else {
    transport = new GrpcTransport({
      host: "grid-logger.deepsquare.run:443",
      channelCredentials: ChannelCredentials.createSsl(),
    });
  }

  return new LoggerAPIClient(transport);
}
