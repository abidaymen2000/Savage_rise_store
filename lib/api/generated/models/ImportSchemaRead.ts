/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportEntity } from './ImportEntity';
import type { ImportFieldDefinition } from './ImportFieldDefinition';
import type { ImportMatchBy } from './ImportMatchBy';
import type { ImportStrategy } from './ImportStrategy';
export type ImportSchemaRead = {
    entity: ImportEntity;
    fields: Array<ImportFieldDefinition>;
    dynamic_namespaces?: Array<string>;
    match_by?: Array<ImportMatchBy>;
    strategies?: Array<ImportStrategy>;
    grouping?: Record<string, any>;
    limitations?: Array<string>;
};

