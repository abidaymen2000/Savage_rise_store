/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingJournalCreate = {
    code: string;
    name: string;
    journal_type: 'sales' | 'purchases' | 'bank' | 'cash' | 'general' | 'inventory';
    default_debit_account_id?: (string | null);
    default_credit_account_id?: (string | null);
    status?: 'active' | 'inactive' | 'archived';
};

