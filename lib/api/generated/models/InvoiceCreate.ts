/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceLineCreate } from './InvoiceLineCreate';
import type { PartySnapshot } from './PartySnapshot';
import type { PaymentTerms } from './PaymentTerms';
export type InvoiceCreate = {
    document_type?: 'invoice' | 'debit_note';
    customer_id?: (string | null);
    customer: PartySnapshot;
    currency: string;
    exchange_rate?: (number | string);
    language?: string;
    locale?: string;
    issue_date: string;
    supply_date?: (string | null);
    due_date?: (string | null);
    payment_terms?: PaymentTerms;
    customer_reference?: (string | null);
    external_references?: Array<string>;
    customer_notes?: (string | null);
    internal_notes?: (string | null);
    metadata?: Record<string, string>;
    lines: Array<InvoiceLineCreate>;
    discount_percent?: (number | string);
    discount_amount?: (number | string);
    expected_total?: ((number | string) | null);
};

