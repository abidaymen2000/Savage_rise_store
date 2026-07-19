/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingDeliverableOut } from './MarketingDeliverableOut';
export type PaginatedResponse_MarketingDeliverableOut_ = {
    items?: Array<MarketingDeliverableOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
    sort?: (Record<string, any> | null);
    filters?: (Record<string, any> | null);
};

