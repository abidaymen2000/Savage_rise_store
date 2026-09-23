/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImportJobRead } from './ImportJobRead';
import type { ImportRowRead } from './ImportRowRead';
export type ImportPreviewRead = {
    job: ImportJobRead;
    expected_products?: number;
    expected_variants?: number;
    estimated_creates?: number;
    estimated_updates?: number;
    estimated_skips?: number;
    sample_rows?: Array<ImportRowRead>;
};

