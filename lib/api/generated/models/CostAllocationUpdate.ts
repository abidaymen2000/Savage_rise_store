/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostAllocationUpdate = {
    cost_line_id?: (string | null);
    allocation_method?: ('direct' | 'by_quantity' | 'by_revenue' | 'by_weight' | 'equal_split' | 'percentage' | 'manual' | null);
    target_type?: ('product' | 'variant' | 'bundle' | 'order' | 'campaign' | null);
    target_id?: (string | null);
    allocated_amount?: (number | null);
    allocated_unit_cost?: (number | null);
    percentage?: (number | null);
    quantity_basis?: (number | null);
    revenue_basis?: (number | null);
    attributes?: (Record<string, any> | null);
    expected_version?: (number | null);
};

