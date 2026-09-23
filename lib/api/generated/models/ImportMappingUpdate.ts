/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportMatchBy } from './ImportMatchBy';
import type { ImportStrategy } from './ImportStrategy';
export type ImportMappingUpdate = {
    mapping: Record<string, string>;
    strategy?: (ImportStrategy | null);
    match_by?: (Array<ImportMatchBy> | null);
};

