/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingJournalOut = {
    id: string;
    code: string;
    name: string;
    journal_type: 'sales' | 'purchases' | 'bank' | 'cash' | 'general' | 'inventory';
    default_debit_account_id?: (string | null);
    default_credit_account_id?: (string | null);
    status?: 'active' | 'inactive' | 'archived';
    is_archived?: boolean;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

