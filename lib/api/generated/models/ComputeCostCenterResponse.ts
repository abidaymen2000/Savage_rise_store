/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComputedProductCostItem } from './ComputedProductCostItem';
export type ComputeCostCenterResponse = {
    cost_center_id: string;
    currency: string;
    total_cost?: number;
    total_direct_cost?: number;
    total_indirect_cost?: number;
    total_allocated_cost?: number;
    total_unallocated_cost?: number;
    category_breakdown?: Record<string, number>;
    products?: Array<ComputedProductCostItem>;
    warnings?: Array<string>;
};

