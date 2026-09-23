/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinancialAccountOut = {
    id: string;
    code: string;
    name: string;
    type: 'cash' | 'bank' | 'card' | 'wallet' | 'payment_gateway' | 'clearing' | 'other';
    currency: string;
    status?: 'active' | 'inactive';
    opening_balance?: string;
    current_balance?: string;
    accounting_account_id?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
    is_archived?: boolean;
};

