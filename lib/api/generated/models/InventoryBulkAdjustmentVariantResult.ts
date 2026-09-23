/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryBulkAdjustmentVariantResult = {
    variant_id: string;
    success: boolean;
    old_stock?: (number | null);
    new_stock?: (number | null);
    movement_id?: (string | null);
    operation_key?: (string | null);
    error?: (Record<string, any> | null);
};

