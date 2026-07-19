/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InventoryMovementOut = {
    id: string;
    product_id: string;
    variant_id: string;
    inventory_item_id?: (string | null);
    product_name?: (string | null);
    sku?: (string | null);
    option_values_snapshot?: Record<string, string>;
    movement_type?: string;
    on_hand_delta: number;
    reserved_delta: number;
    on_hand_before: number;
    on_hand_after: number;
    reserved_before: number;
    reserved_after: number;
    reason: string;
    source?: string;
    operation_key?: (string | null);
    admin_id?: (string | null);
    admin_email?: (string | null);
    metadata?: Record<string, any>;
    created_at: string;
};

