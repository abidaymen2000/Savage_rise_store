/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingPeriodOut = {
    id: string;
    name: string;
    date_from: string;
    date_to: string;
    fiscal_year_id?: (string | null);
    period_number?: (number | null);
    period_type?: 'normal' | 'adjustment' | 'closing';
    status?: 'open' | 'closed';
    closed_at?: (string | null);
    closed_by?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

