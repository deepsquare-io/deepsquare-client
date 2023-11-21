import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import { LoggerAPIClient } from "./generated/logger/v1alpha1/log.client";

export async function createLoggerClient(): Promise<LoggerAPIClient> {
  let transport: RpcTransport;
  if (typeof window !== "undefined") {
    const { GrpcWebFetchTransport } = await import(
      "@protobuf-ts/grpcweb-transport"
    );
    transport = new GrpcWebFetchTransport({
      baseUrl: "https://grid-logger.deepsquare.run/",
    });
  } else {
    const { ChannelCredentials } = await import("@grpc/grpc-js");
    const { GrpcTransport } = await import("@protobuf-ts/grpc-transport");
    transport = new GrpcTransport({
      host: "grid-logger.deepsquare.run:443",
      channelCredentials: ChannelCredentials.createSsl(),
    });
  }

  return new LoggerAPIClient(transport);
}
