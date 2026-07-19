/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationOut } from './NotificationOut';
export type PaginatedResponse_NotificationOut_ = {
    items?: Array<NotificationOut>;
    total: number;
    page: number;
    page_size: number;
    pages: number;
    has_next?: boolean;
    has_prev?: boolean;
    sort?: (Record<string, any> | null);
    filters?: (Record<string, any> | null);
};

