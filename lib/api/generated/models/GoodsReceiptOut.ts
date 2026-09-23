/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoodsReceiptLineOut } from './GoodsReceiptLineOut';
export type GoodsReceiptOut = {
    id: string;
    reference: string;
    purchase_order_id: string;
    supplier_id: string;
    received_at: string;
    status?: 'draft' | 'posted' | 'cancelled';
    warehouse_id?: (string | null);
    location_id?: (string | null);
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines?: Array<GoodsReceiptLineOut>;
    posted_at?: (string | null);
    cancelled_at?: (string | null);
    created_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

