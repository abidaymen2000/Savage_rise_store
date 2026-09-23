/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingJournalUpdate = {
    code?: (string | null);
    name?: (string | null);
    journal_type?: ('sales' | 'purchases' | 'bank' | 'cash' | 'general' | 'inventory' | null);
    default_debit_account_id?: (string | null);
    default_credit_account_id?: (string | null);
    status?: ('active' | 'inactive' | 'archived' | null);
    expected_version?: (number | null);
};

