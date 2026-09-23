/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentVersionOut } from './CMSContentVersionOut';
export type PaginatedCMSContentVersionsOut = {
    items?: Array<CMSContentVersionOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
};

