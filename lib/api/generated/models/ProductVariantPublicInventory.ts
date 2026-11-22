/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductVariantPublicInventory = {
    availability_status?: "available" | "out_of_stock" | "forced_sold_out" | "inactive" | "invalid_variant" | "unavailable" | null;
    low_stock?: boolean;
    track_inventory: boolean;
    stock_on_hand?: number;
    stock_reserved?: number;
    stock_available?: number;
    in_stock?: boolean;
};

