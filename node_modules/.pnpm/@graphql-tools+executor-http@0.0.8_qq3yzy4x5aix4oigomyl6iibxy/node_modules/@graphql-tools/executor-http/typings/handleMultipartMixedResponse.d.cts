import { ExecutionResult } from '@graphql-tools/utils';
export declare function handleMultipartMixedResponse(response: Response, controller?: AbortController): Promise<AsyncIterable<ExecutionResult<any, any> | undefined>>;
