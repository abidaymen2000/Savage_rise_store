/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingFiscalYearOut = {
    id: string;
    reference: string;
    name: string;
    date_from: string;
    date_to: string;
    status?: 'open' | 'closing' | 'closed';
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    closed_by?: (string | null);
    closed_at?: (string | null);
    closing_entry_id?: (string | null);
    version?: number;
};

