import { LoggerAPIClient } from '@grpc/generated/logger/v1alpha1/log.client';
import env from '@lib/app/env';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';

const transport = new GrpcWebFetchTransport({ baseUrl: env.NEXT_PUBLIC_LOGGER_URL });

const loggerClient = new LoggerAPIClient(transport);

export default loggerClient;
