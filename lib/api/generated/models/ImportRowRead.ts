/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportErrorItem } from './ImportErrorItem';
import type { ImportRowStatus } from './ImportRowStatus';
export type ImportRowRead = {
    id: string;
    job_id: string;
    row_number: number;
    raw_data?: Record<string, any>;
    mapped_data?: Record<string, any>;
    normalized_data?: Record<string, any>;
    status: ImportRowStatus;
    warnings?: Array<ImportErrorItem>;
    errors?: Array<ImportErrorItem>;
    result?: Record<string, any>;
    idempotency_key?: (string | null);
    created_at: string;
    updated_at: string;
};

