/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryBulkAdjustmentIn = {
    product_id: string;
    variant_ids: Array<string>;
    operation: 'increase' | 'decrease' | 'set';
    quantity: number;
    operation_key: string;
    reason: string;
    note?: (string | null);
};

