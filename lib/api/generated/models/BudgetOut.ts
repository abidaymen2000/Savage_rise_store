/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BudgetOut = {
    id: string;
    reference: string;
    name: string;
    description?: (string | null);
    date_from: string;
    date_to: string;
    base_currency: string;
    status?: 'draft' | 'approved' | 'locked' | 'archived';
    notes?: (string | null);
    revision_number?: number;
    revision_of_budget_id?: (string | null);
    superseded_by_budget_id?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    approved_by?: (string | null);
    approved_at?: (string | null);
    locked_at?: (string | null);
    archived_at?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

