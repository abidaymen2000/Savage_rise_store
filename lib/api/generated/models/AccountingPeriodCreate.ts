/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingPeriodCreate = {
    name: string;
    date_from: string;
    date_to: string;
    fiscal_year_id?: (string | null);
    period_number?: (number | null);
    period_type?: 'normal' | 'adjustment' | 'closing';
    status?: 'open' | 'closed';
};

