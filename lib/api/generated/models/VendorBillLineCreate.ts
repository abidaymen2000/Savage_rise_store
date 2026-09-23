/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VendorBillLineCreate = {
    description: string;
    accounting_account_id?: (string | null);
    inventory_cost_treatment?: 'expense' | 'inventory_purchase' | 'landed_cost_capitalizable';
    product_id?: (string | null);
    variant_id?: (string | null);
    sku_snapshot?: (string | null);
    purchase_order_line_id?: (string | null);
    goods_receipt_line_id?: (string | null);
    quantity: (number | string);
    unit_price: (number | string);
    tax_rate?: (number | string | null);
    tax_definition_ids?: Array<string>;
    tax_category_id?: (string | null);
    tax_profile_id?: (string | null);
    tax_exemption_reason?: (string | null);
    cost_category_id?: (string | null);
    cost_center_id?: (string | null);
    metadata?: Record<string, any>;
};

