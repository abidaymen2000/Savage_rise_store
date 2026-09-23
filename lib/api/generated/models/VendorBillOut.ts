/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorBillLineOut } from './VendorBillLineOut';
export type VendorBillOut = {
    id: string;
    reference: string;
    supplier_id: string;
    purchase_order_id?: (string | null);
    supplier_invoice_number?: (string | null);
    invoice_date: string;
    due_date?: (string | null);
    currency: string;
    exchange_rate: string;
    base_currency: string;
    subtotal: string;
    tax_total: string;
    total_amount: string;
    amount_paid: string;
    amount_due: string;
    status?: 'draft' | 'posted' | 'cancelled';
    payment_status?: 'unpaid' | 'partially_paid' | 'paid';
    is_overdue?: boolean;
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines?: Array<VendorBillLineOut>;
    posted_at?: (string | null);
    cancelled_at?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

