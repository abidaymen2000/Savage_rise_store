/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinancialAccountCreate = {
    code: string;
    name: string;
    type: 'cash' | 'bank' | 'card' | 'wallet' | 'payment_gateway' | 'clearing' | 'other';
    currency?: (string | null);
    status?: 'active' | 'inactive';
    opening_balance?: (number | string);
    accounting_account_id?: (string | null);
};

