/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForecastUpdate = {
    reference?: (string | null);
    name?: (string | null);
    date_from?: (string | null);
    date_to?: (string | null);
    base_currency?: (string | null);
    source_budget_id?: (string | null);
    scenario?: ('baseline' | 'optimistic' | 'conservative' | 'custom' | null);
    notes?: (string | null);
    expected_version?: (number | null);
};

