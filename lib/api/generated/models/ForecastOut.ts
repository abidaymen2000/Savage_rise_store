/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ForecastOut = {
    id: string;
    reference: string;
    name: string;
    date_from: string;
    date_to: string;
    base_currency: string;
    status?: 'draft' | 'published' | 'archived';
    source_budget_id?: (string | null);
    scenario?: 'baseline' | 'optimistic' | 'conservative' | 'custom';
    notes?: (string | null);
    revision_number?: number;
    revision_of_forecast_id?: (string | null);
    superseded_by_forecast_id?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    published_by?: (string | null);
    published_at?: (string | null);
    archived_at?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

