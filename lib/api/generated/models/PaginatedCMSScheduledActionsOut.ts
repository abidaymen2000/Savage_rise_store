/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSScheduledActionOut } from './CMSScheduledActionOut';
export type PaginatedCMSScheduledActionsOut = {
    items?: Array<CMSScheduledActionOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
};

