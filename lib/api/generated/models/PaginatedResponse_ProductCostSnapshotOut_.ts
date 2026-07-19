/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductCostSnapshotOut } from './ProductCostSnapshotOut';
export type PaginatedResponse_ProductCostSnapshotOut_ = {
    items?: Array<ProductCostSnapshotOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
    sort?: (Record<string, any> | null);
    filters?: (Record<string, any> | null);
};

