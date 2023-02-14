import { Types } from '@graphql-codegen/plugin-helpers';
import { ImportSource, FragmentImport, ImportDeclaration, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { FragmentDefinitionNode, GraphQLSchema } from 'graphql';
import { Source } from '@graphql-tools/utils';
export declare type FragmentRegistry = {
    [fragmentName: string]: {
        location: string;
        importNames: string[];
        onType: string;
        node: FragmentDefinitionNode;
    };
};
export declare type DocumentImportResolverOptions = {
    baseDir: string;
    /**
     * Generates a target file path from the source `document.location`
     */
    generateFilePath: (location: string) => string;
    /**
     * Schema base types source
     */
    schemaTypesSource: string | ImportSource;
    /**
     * Should `import type` be used
     */
    typesImport: boolean;
};
interface ResolveDocumentImportResult {
    filename: string;
    documents: [Source];
    importStatements: string[];
    fragmentImports: ImportDeclaration<FragmentImport>[];
    externalFragments: LoadedFragment<{
        level: number;
    }>[];
}
/**
 * Transform the preset's provided documents into single-file generator sources, while resolving fragment and user-defined imports
 *
 * Resolves user provided imports and fragment imports using the `DocumentImportResolverOptions`.
 * Does not define specific plugins, but rather returns a string[] of `importStatements` for the calling plugin to make use of
 */
export declare function resolveDocumentImports<T>(presetOptions: Types.PresetFnArgs<T>, schemaObject: GraphQLSchema, importResolverOptions: DocumentImportResolverOptions, dedupeFragments?: boolean): Array<ResolveDocumentImportResult>;
export {};
