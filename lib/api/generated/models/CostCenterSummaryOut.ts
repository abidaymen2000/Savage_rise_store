/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CostCenterOut } from './CostCenterOut';
export type CostCenterSummaryOut = {
    cost_center: CostCenterOut;
    line_count?: number;
    allocation_count?: number;
    category_breakdown?: Record<string, number>;
    warnings?: Array<string>;
};

