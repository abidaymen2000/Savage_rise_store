/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentAllocationCreate } from './PaymentAllocationCreate';
export type PaymentCreate = {
    reference?: (string | null);
    direction?: 'in' | 'out';
    financial_account_id: string;
    supplier_id?: (string | null);
    source_document_type?: (string | null);
    source_document_id?: (string | null);
    source_event_id?: (string | null);
    amount: (number | string);
    currency?: (string | null);
    exchange_rate?: (number | string);
    payment_method?: (string | null);
    external_reference?: (string | null);
    occurred_at?: (string | null);
    notes?: (string | null);
    allocations?: Array<PaymentAllocationCreate>;
};

