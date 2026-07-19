/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ComputedProductCostItem = {
    product_id?: (string | null);
    product_name?: (string | null);
    variant_id?: (string | null);
    scope: 'product' | 'variant' | 'bundle';
    sku?: (string | null);
    option_values?: (Record<string, any> | null);
    variant_label?: (string | null);
    total_allocated_cost?: number;
    quantity_basis?: number;
    unit_cost?: number;
    selling_price?: (number | null);
    gross_margin?: (number | null);
    gross_margin_rate?: (number | null);
};

