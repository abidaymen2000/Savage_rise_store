/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseOrderLineOut } from './PurchaseOrderLineOut';
export type PurchaseOrderOut = {
    id: string;
    reference: string;
    supplier_id: string;
    order_date: string;
    expected_date?: (string | null);
    currency: string;
    exchange_rate: string;
    base_currency: string;
    subtotal: string;
    tax_total: string;
    total_amount: string;
    status?: 'draft' | 'confirmed' | 'partially_received' | 'received' | 'closed' | 'cancelled';
    matching_status?: 'not_applicable' | 'pending' | 'matched' | 'quantity_mismatch' | 'price_mismatch' | 'quantity_and_price_mismatch';
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines?: Array<PurchaseOrderLineOut>;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    confirmed_at?: (string | null);
    cancelled_at?: (string | null);
    closed_at?: (string | null);
    version?: number;
};

