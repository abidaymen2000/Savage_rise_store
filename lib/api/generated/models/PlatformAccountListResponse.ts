/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlatformAccountCompany } from './PlatformAccountCompany';
import type { PlatformAccountListItem } from './PlatformAccountListItem';
import type { PlatformAccountSummary } from './PlatformAccountSummary';
export type PlatformAccountListResponse = {
    items: Array<PlatformAccountListItem>;
    page: number;
    page_size: number;
    total: number;
    pages: number;
    summary: PlatformAccountSummary;
    companies: Array<PlatformAccountCompany>;
};

