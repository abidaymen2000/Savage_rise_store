/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentPublicEntryOut } from './CMSContentPublicEntryOut';
export type PaginatedCMSContentPublicEntriesOut = {
    items?: Array<CMSContentPublicEntryOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
};

