/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoodsReceiptLineCreate } from './GoodsReceiptLineCreate';
export type GoodsReceiptCreate = {
    reference?: (string | null);
    purchase_order_id: string;
    received_at?: (string | null);
    warehouse_id?: (string | null);
    location_id?: (string | null);
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines: Array<GoodsReceiptLineCreate>;
};

