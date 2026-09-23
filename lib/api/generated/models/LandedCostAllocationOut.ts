/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LandedCostAllocationOut = {
    id: string;
    landed_cost_id: string;
    goods_receipt_line_id: string;
    product_id: string;
    variant_id?: (string | null);
    base_amount: string;
    allocated_amount: string;
    allocation_ratio: string;
    currency: string;
    product_cost_snapshot_id?: (string | null);
    created_at: string;
    updated_at: string;
};

