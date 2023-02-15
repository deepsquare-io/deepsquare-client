import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import {LoggerAPIClient} from "./generated/logger/v1alpha1/log.client";

const transport = new GrpcWebFetchTransport({ baseUrl: "https://grid-logger.deepsquare.run/" });

const loggerClient = new LoggerAPIClient(transport);

export default loggerClient;
