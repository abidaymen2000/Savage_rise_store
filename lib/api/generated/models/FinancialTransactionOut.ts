/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinancialTransactionOut = {
    id: string;
    reference: string;
    type: 'payment' | 'refund' | 'transfer' | 'adjustment' | 'opening_balance' | 'expense_payment' | 'order_collection';
    direction: 'in' | 'out';
    financial_account_id: string;
    amount: string;
    currency: string;
    amount_base: string;
    base_currency: string;
    exchange_rate?: string;
    occurred_at: string;
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_event_id?: (string | null);
    description?: (string | null);
    created_by?: (string | null);
    created_at: string;
    reversal_of_transaction_id?: (string | null);
    reversed_by_transaction_id?: (string | null);
};

