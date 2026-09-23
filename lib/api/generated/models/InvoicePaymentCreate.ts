/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InvoicePaymentCreate = {
    financial_account_id: string;
    amount: (number | string);
    payment_method: string;
    external_reference?: (string | null);
    occurred_at?: (string | null);
    allow_unallocated?: boolean;
};

