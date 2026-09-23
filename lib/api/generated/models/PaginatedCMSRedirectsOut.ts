/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSRedirectOut } from './CMSRedirectOut';
export type PaginatedCMSRedirectsOut = {
    items?: Array<CMSRedirectOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
};

