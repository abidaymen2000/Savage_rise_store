/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GoodsReceiptLineOut = {
    id: string;
    goods_receipt_id: string;
    purchase_order_line_id: string;
    product_id: string;
    variant_id?: (string | null);
    quantity_received: string;
    unit_purchase_price_snapshot: string;
    currency: string;
    inventory_movement_id?: (string | null);
    product_cost_snapshot_id?: (string | null);
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
};

