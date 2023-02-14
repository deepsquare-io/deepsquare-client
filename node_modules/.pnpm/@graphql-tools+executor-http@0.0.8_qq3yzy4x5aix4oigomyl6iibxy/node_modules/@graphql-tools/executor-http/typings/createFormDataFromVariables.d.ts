export declare function createFormDataFromVariables<TVariables>({ query, variables, operationName, extensions, }: {
    query: string;
    variables: TVariables;
    operationName?: string;
    extensions?: any;
}): string | FormData | Promise<FormData>;
