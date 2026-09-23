/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingAccountUpdate = {
    code?: (string | null);
    name?: (string | null);
    description?: (string | null);
    account_type?: ('asset' | 'liability' | 'equity' | 'revenue' | 'expense' | null);
    normal_balance?: ('debit' | 'credit' | null);
    parent_id?: (string | null);
    currency?: (string | null);
    subtype?: (string | null);
    statement_section?: (string | null);
    display_order?: (number | null);
    allow_manual_entries?: (boolean | null);
    reconcile?: (boolean | null);
    status?: ('active' | 'inactive' | 'archived' | null);
    expected_version?: (number | null);
};

