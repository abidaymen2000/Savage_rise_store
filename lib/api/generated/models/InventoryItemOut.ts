/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryItemOut = {
    product_id: string;
    product_name: string;
    product_status?: string;
    product_kind?: (string | null);
    variant_id: string;
    inventory_item_id?: (string | null);
    variant_name?: (string | null);
    variant_status?: string;
    sku?: (string | null);
    barcode?: (string | null);
    option_values_snapshot?: Record<string, string>;
    track_inventory?: boolean;
    tracking_method?: string;
    status?: string;
    stock_on_hand: number;
    stock_reserved: number;
    stock_available: number;
    in_stock?: boolean;
    low_stock?: boolean;
    stock_state?: string;
    updated_at?: (string | null);
};

