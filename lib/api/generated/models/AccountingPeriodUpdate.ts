/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingPeriodUpdate = {
    name?: (string | null);
    date_from?: (string | null);
    date_to?: (string | null);
    fiscal_year_id?: (string | null);
    period_number?: (number | null);
    period_type?: ('normal' | 'adjustment' | 'closing' | null);
    status?: ('open' | 'closed' | null);
    expected_version?: (number | null);
};

