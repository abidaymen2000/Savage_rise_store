/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderQuoteLineOut = {
    item_type: 'single' | 'bundle' | 'bundle_component';
    product_id: string;
    variant_id?: (string | null);
    sku?: (string | null);
    meta_content_id?: (string | null);
    product_name: string;
    variant_title_snapshot?: (string | null);
    option_values_snapshot?: (Record<string, string> | null);
    qty: number;
    unit_price_original: number;
    unit_price: number;
    unit_price_final: number;
    discount_amount?: number;
    tax_category_id?: (string | null);
    tax_profile_id?: (string | null);
    tax_exemption_reason?: (string | null);
    tax_lines?: Array<Record<string, any>>;
    taxable_base?: number;
    tax_amount?: number;
    line_total_excluding_tax?: number;
    line_total_including_tax?: number;
    line_total: number;
    product_kind?: (string | null);
    currency?: (string | null);
    bundle_parent_line_id?: (string | null);
    bundle_component_id?: (string | null);
    bundle_definition_version?: (number | null);
    pricing_policy_snapshot?: (Record<string, any> | null);
    selected_components?: Array<Record<string, any>>;
    stock_available?: (number | null);
    base_unit_price?: (number | null);
    discount_percentage?: number;
    promotion_id?: (string | null);
    promotion_name?: (string | null);
    promotion_badge?: (string | null);
    unit_cost_snapshot?: (string | null);
    cost_snapshot_id?: (string | null);
    cogs_amount?: (string | null);
    gross_margin_amount?: (string | null);
    gross_margin_rate?: (string | null);
};

