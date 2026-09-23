/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentAllocationOut } from './PaymentAllocationOut';
export type PaymentOut = {
    id: string;
    reference: string;
    direction: 'in' | 'out';
    financial_account_id: string;
    supplier_id?: (string | null);
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_event_id?: (string | null);
    amount: string;
    currency: string;
    exchange_rate: string;
    amount_base: string;
    base_currency: string;
    payment_method?: (string | null);
    external_reference?: (string | null);
    occurred_at: string;
    notes?: (string | null);
    status?: 'posted' | 'reversed';
    financial_transaction_id?: (string | null);
    created_by?: (string | null);
    created_at: string;
    reversed_at?: (string | null);
    reversal_payment_id?: (string | null);
    allocations?: Array<PaymentAllocationOut>;
};

