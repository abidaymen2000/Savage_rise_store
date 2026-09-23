/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartySnapshot } from './PartySnapshot';
export type InvoicePolicy_Output = {
    enabled?: boolean;
    seller?: (PartySnapshot | null);
    currency_precisions?: Record<string, number>;
    max_amount?: string;
    rounding_account_id?: (string | null);
    required_customer_fields?: Array<'email' | 'phone' | 'tax_id' | 'registration_id'>;
    invoice_basis?: 'ordered' | 'delivered';
    allow_early_due_date?: boolean;
    prefixes?: Record<string, string>;
    number_padding?: number;
    number_format?: string;
    legal_mentions?: Array<string>;
    logo_url?: (string | null);
    theme?: Record<string, string>;
    payment_methods?: Array<string>;
};

