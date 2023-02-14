import { Source } from '@graphql-tools/utils';
import { SourceWithOperations } from '@graphql-codegen/gql-tag-operations';
import { FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';
export declare type BuildNameFunction = (type: OperationDefinitionNode | FragmentDefinitionNode) => string;
export declare function processSources(sources: Array<Source>, buildName: BuildNameFunction): SourceWithOperations[];
