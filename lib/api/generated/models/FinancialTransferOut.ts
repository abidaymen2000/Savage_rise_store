/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinancialTransferOut = {
    id: string;
    reference: string;
    from_account_id: string;
    to_account_id: string;
    amount: string;
    currency: string;
    exchange_rate: string;
    amount_base: string;
    base_currency: string;
    occurred_at: string;
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    status?: 'posted' | 'reversed';
    out_transaction_id?: (string | null);
    in_transaction_id?: (string | null);
    reversed_at?: (string | null);
    reversal_transfer_id?: (string | null);
    created_by?: (string | null);
    created_at: string;
    notes?: (string | null);
};

