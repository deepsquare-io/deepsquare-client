import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import {LoggerAPIClient} from "./generated/logger/v1alpha1/log.client";
import { ChannelCredentials } from "@grpc/grpc-js";

const transport = new GrpcTransport({ host: "https://grid-logger.deepsquare.run/", channelCredentials: ChannelCredentials.createInsecure() });

const loggerClient = new LoggerAPIClient(transport);

export default loggerClient;
