/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderOut } from './OrderOut';
import type { OrderSummary } from './OrderSummary';
export type OrderAdminPage = {
    items?: Array<OrderOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
    sort?: (Record<string, any> | null);
    filters?: (Record<string, any> | null);
    next_cursor?: (string | null);
    /**
     * Compteurs et montants sur les filtres globaux, hors vue et page; null si include_summary=false
     */
    summary?: (OrderSummary | null);
};

