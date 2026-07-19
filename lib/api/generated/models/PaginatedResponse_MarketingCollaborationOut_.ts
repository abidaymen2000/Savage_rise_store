/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCollaborationOut } from './MarketingCollaborationOut';
export type PaginatedResponse_MarketingCollaborationOut_ = {
    items?: Array<MarketingCollaborationOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
    sort?: (Record<string, any> | null);
    filters?: (Record<string, any> | null);
};

