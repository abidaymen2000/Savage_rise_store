/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountingFiscalYearOut } from './AccountingFiscalYearOut';
export type PaginatedResponse_AccountingFiscalYearOut_ = {
    items?: Array<AccountingFiscalYearOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
    sort?: (Record<string, any> | null);
    filters?: (Record<string, any> | null);
};

