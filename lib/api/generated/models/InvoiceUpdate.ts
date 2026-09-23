/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceCreate } from './InvoiceCreate';
export type InvoiceUpdate = {
    expected_version: number;
    draft?: (InvoiceCreate | null);
    internal_notes?: (string | null);
    metadata?: (Record<string, string> | null);
};

