/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryBulkAdjustmentVariantResult } from './InventoryBulkAdjustmentVariantResult';
export type InventoryBulkAdjustmentOut = {
    product_id: string;
    operation: 'increase' | 'decrease' | 'set';
    quantity: number;
    operation_key: string;
    requested_count: number;
    succeeded_count: number;
    failed_count: number;
    transaction?: string;
    results?: Array<InventoryBulkAdjustmentVariantResult>;
};

