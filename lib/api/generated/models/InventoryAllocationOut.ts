/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryAllocationOut = {
    allocation_id?: (string | null);
    location_id?: string;
    location_name?: string;
    source_line_id?: (string | null);
    track_inventory?: boolean;
    quantity_reserved?: number;
    quantity_consumed?: number;
    quantity_released?: number;
    quantity_restocked?: number;
    product_id: string;
    variant_id?: (string | null);
    inventory_item_id?: (string | null);
    sku?: (string | null);
    variant_title_snapshot?: (string | null);
    option_values_snapshot?: (Record<string, string> | null);
    qty: number;
};

