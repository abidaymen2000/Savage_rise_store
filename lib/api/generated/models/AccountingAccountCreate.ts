/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingAccountCreate = {
    code: string;
    name: string;
    description?: (string | null);
    account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    normal_balance: 'debit' | 'credit';
    parent_id?: (string | null);
    currency?: (string | null);
    subtype?: (string | null);
    statement_section?: (string | null);
    display_order?: (number | null);
    allow_manual_entries?: boolean;
    reconcile?: (boolean | null);
    status?: 'active' | 'inactive' | 'archived';
};

