/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryItemOut = {
    product_id: string;
    product_name: string;
    variant_id: string;
    inventory_item_id?: (string | null);
    variant_name?: (string | null);
    sku?: (string | null);
    option_values_snapshot?: Record<string, string>;
    status?: string;
    stock_on_hand: number;
    stock_reserved: number;
    stock_available: number;
    in_stock?: boolean;
    low_stock?: boolean;
};

