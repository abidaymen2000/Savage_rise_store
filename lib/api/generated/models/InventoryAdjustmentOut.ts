/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryAdjustmentOut = {
    id: string;
    reference: string;
    reason: 'physical_count' | 'damage' | 'loss' | 'found_stock' | 'correction' | 'other';
    status: string;
    location_id?: (string | null);
    occurred_at: string;
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    created_by?: (string | null);
    approved_by?: (string | null);
    created_at: string;
    posted_at?: (string | null);
    cancelled_at?: (string | null);
    lines?: Array<Record<string, any>>;
};

