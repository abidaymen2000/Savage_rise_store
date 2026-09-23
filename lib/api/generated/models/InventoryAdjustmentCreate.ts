/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryAdjustmentLineCreate } from './InventoryAdjustmentLineCreate';
export type InventoryAdjustmentCreate = {
    reference?: (string | null);
    reason?: 'physical_count' | 'damage' | 'loss' | 'found_stock' | 'correction' | 'other';
    location_id?: (string | null);
    occurred_at?: (string | null);
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines: Array<InventoryAdjustmentLineCreate>;
};

