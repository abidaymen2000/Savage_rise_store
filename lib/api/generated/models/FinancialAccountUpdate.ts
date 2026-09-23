/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinancialAccountUpdate = {
    code?: (string | null);
    name?: (string | null);
    type?: ('cash' | 'bank' | 'card' | 'wallet' | 'payment_gateway' | 'clearing' | 'other' | null);
    currency?: (string | null);
    status?: ('active' | 'inactive' | null);
    expected_version?: (number | null);
    accounting_account_id?: (string | null);
};

