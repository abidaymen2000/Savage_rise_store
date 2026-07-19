/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryAdjustmentIn = {
    product_id: string;
    variant_id: string;
    delta?: (number | null);
    new_stock_on_hand?: (number | null);
    operation_key: string;
    reason: string;
    note?: (string | null);
};

