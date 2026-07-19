/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductCostSnapshotOut } from './ProductCostSnapshotOut';
export type ProductCostSummaryOut = {
    total_cost_centers?: number;
    active_cost_centers?: number;
    closed_cost_centers?: number;
    total_cost_lines?: number;
    total_cost_amount?: number;
    total_allocated_amount?: number;
    total_unallocated_amount?: number;
    products_with_cost?: number;
    products_without_cost?: number;
    average_unit_cost?: number;
    currency_breakdown?: Record<string, number>;
    category_breakdown?: Record<string, number>;
    cost_type_breakdown?: Record<string, number>;
    latest_updates?: Array<ProductCostSnapshotOut>;
    missing_cost_products_count?: number;
};

