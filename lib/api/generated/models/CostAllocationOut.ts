/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CostAllocationOut = {
    cost_line_id?: (string | null);
    allocation_method: 'direct' | 'by_quantity' | 'by_revenue' | 'by_weight' | 'equal_split' | 'percentage' | 'manual';
    target_type: 'product' | 'variant' | 'bundle' | 'order' | 'campaign';
    target_id: string;
    allocated_amount?: (number | null);
    allocated_unit_cost?: (number | null);
    percentage?: (number | null);
    quantity_basis?: (number | null);
    revenue_basis?: (number | null);
    attributes?: (Record<string, any> | null);
    id: string;
    cost_center_id: string;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

