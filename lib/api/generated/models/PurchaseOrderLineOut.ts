/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PurchaseOrderLineOut = {
    id: string;
    purchase_order_id: string;
    product_id: string;
    variant_id?: (string | null);
    sku_snapshot?: (string | null);
    product_name_snapshot?: (string | null);
    variant_label_snapshot?: (string | null);
    option_values_snapshot?: Record<string, any>;
    quantity_ordered: string;
    quantity_received: string;
    quantity_remaining: string;
    unit_purchase_price: string;
    subtotal: string;
    tax_rate?: (string | null);
    tax_definition_ids?: Array<string>;
    tax_category_id?: (string | null);
    tax_profile_id?: (string | null);
    tax_exemption_reason?: (string | null);
    tax_lines?: Array<Record<string, any>>;
    taxable_base?: string;
    recoverable_tax_amount?: string;
    nonrecoverable_tax_amount?: string;
    tax_amount: string;
    total_amount: string;
    currency: string;
    expected_date?: (string | null);
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
};

