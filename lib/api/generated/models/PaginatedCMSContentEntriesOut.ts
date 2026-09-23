/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentEntryOut } from './CMSContentEntryOut';
export type PaginatedCMSContentEntriesOut = {
    items?: Array<CMSContentEntryOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
};

