/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSReleaseOut } from './CMSReleaseOut';
export type PaginatedCMSReleasesOut = {
    items?: Array<CMSReleaseOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
};

