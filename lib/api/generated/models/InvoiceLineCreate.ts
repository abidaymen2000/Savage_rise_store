/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InvoiceLineCreate = {
    kind?: 'product' | 'variant' | 'service' | 'free' | 'shipping' | 'charge';
    product_id?: (string | null);
    variant_id?: (string | null);
    sku?: (string | null);
    designation: string;
    description?: (string | null);
    variant_labels?: Record<string, string>;
    unit?: string;
    quantity: (number | string);
    unit_price: (number | string);
    discount_percent?: (number | string);
    discount_amount?: (number | string);
    tax_ids?: Array<string>;
    cost_center_id?: (string | null);
    cost_category_id?: (string | null);
    revenue_account_id?: (string | null);
};

