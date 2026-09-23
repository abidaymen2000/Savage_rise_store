/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportEntity } from './ImportEntity';
import type { ImportMatchBy } from './ImportMatchBy';
import type { ImportProgress } from './ImportProgress';
import type { ImportSource } from './ImportSource';
import type { ImportStats } from './ImportStats';
import type { ImportStatus } from './ImportStatus';
import type { ImportStrategy } from './ImportStrategy';
export type ImportJobUploadResponse = {
    id: string;
    company_id: string;
    entity: ImportEntity;
    source: ImportSource;
    strategy: ImportStrategy;
    match_by?: Array<ImportMatchBy>;
    status: ImportStatus;
    mapping?: Record<string, string>;
    stats?: ImportStats;
    progress?: ImportProgress;
    execution?: Record<string, any>;
    created_by?: (string | null);
    created_at: string;
    updated_at: string;
    started_at?: (string | null);
    completed_at?: (string | null);
    headers?: Array<string>;
};

