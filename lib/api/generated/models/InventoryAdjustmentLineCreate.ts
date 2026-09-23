/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryAdjustmentLineCreate = {
    product_id: string;
    variant_id: string;
    quantity_delta: number;
    unit_cost?: (number | string | null);
    expected_quantity?: (number | null);
    counted_quantity?: (number | null);
    reason?: ('physical_count' | 'damage' | 'loss' | 'found_stock' | 'correction' | 'other' | null);
    metadata?: Record<string, any>;
};

