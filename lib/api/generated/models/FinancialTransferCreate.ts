/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FinancialTransferCreate = {
    reference?: (string | null);
    from_account_id: string;
    to_account_id: string;
    amount: (number | string);
    currency?: (string | null);
    exchange_rate?: (number | string);
    occurred_at?: (string | null);
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    notes?: (string | null);
};

