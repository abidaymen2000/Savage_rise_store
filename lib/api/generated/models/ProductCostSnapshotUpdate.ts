/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductCostSnapshotUpdate = {
    product_name?: (string | null);
    option_values?: (Record<string, any> | null);
    variant_label?: (string | null);
    attributes?: (Record<string, any> | null);
    currency?: (string | null);
    direct_cost?: (number | null);
    allocated_indirect_cost?: (number | null);
    marketing_cost?: (number | null);
    packaging_cost?: (number | null);
    labor_cost?: (number | null);
    material_cost?: (number | null);
    logistics_cost?: (number | null);
    overhead_cost?: (number | null);
    total_unit_cost?: (number | null);
    selling_price?: (number | null);
    gross_margin?: (number | null);
    gross_margin_rate?: (number | null);
    cost_type?: ('computed_cost' | 'production_cost' | 'purchase_cost' | 'estimated_cost' | 'landed_cost' | 'manual_adjustment' | null);
    source?: ('computed' | 'manual' | 'import' | 'supplier' | 'system' | null);
    valid_from?: (string | null);
    valid_to?: (string | null);
    is_active?: (boolean | null);
    expected_version?: (number | null);
};

