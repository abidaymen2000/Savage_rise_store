/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForecastLineCreate } from './ForecastLineCreate';
export type ForecastCreate = {
    reference?: (string | null);
    name: string;
    date_from: string;
    date_to: string;
    base_currency?: (string | null);
    source_budget_id?: (string | null);
    scenario?: 'baseline' | 'optimistic' | 'conservative' | 'custom';
    notes?: (string | null);
    lines?: Array<ForecastLineCreate>;
};

