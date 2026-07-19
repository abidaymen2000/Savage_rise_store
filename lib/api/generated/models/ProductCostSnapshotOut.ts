/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductCostSnapshotOut = {
    id: string;
    cost_center_id?: (string | null);
    product_id?: (string | null);
    product_name?: (string | null);
    variant_id?: (string | null);
    sku?: (string | null);
    option_values?: (Record<string, any> | null);
    variant_label?: (string | null);
    scope: 'product' | 'variant' | 'bundle';
    attributes?: (Record<string, any> | null);
    currency: string;
    direct_cost?: number;
    allocated_indirect_cost?: number;
    marketing_cost?: number;
    packaging_cost?: number;
    labor_cost?: number;
    material_cost?: number;
    logistics_cost?: number;
    overhead_cost?: number;
    total_unit_cost?: number;
    selling_price?: (number | null);
    gross_margin?: (number | null);
    gross_margin_rate?: (number | null);
    cost_type: 'computed_cost' | 'production_cost' | 'purchase_cost' | 'estimated_cost' | 'landed_cost' | 'manual_adjustment';
    source: 'computed' | 'manual' | 'import' | 'supplier' | 'system';
    valid_from: string;
    valid_to?: (string | null);
    version?: number;
    is_active?: boolean;
    is_archived?: boolean;
    migrated_from?: (Record<string, any> | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
};

