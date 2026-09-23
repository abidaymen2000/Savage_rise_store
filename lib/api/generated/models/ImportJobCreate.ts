/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportEntity } from './ImportEntity';
import type { ImportMatchBy } from './ImportMatchBy';
import type { ImportStrategy } from './ImportStrategy';
export type ImportJobCreate = {
    entity: ImportEntity;
    strategy?: ImportStrategy;
    match_by?: Array<ImportMatchBy>;
};

