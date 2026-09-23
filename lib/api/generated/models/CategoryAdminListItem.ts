/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryStatus } from './CategoryStatus';
import type { CMSSEOResolved } from './CMSSEOResolved';
export type CategoryAdminListItem = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    name: string;
    description?: (string | null);
    parent_id?: (string | null);
    attribute_set_id?: (string | null);
    image?: (Record<string, any> | null);
    icon?: (Record<string, any> | null);
    seo?: Record<string, any>;
    slug: string;
    ancestors: Array<string>;
    path: string;
    level: number;
    position: number;
    status: CategoryStatus;
    archived_at?: (string | null);
    resolved_seo?: (CMSSEOResolved | null);
    parent_name?: (string | null);
    parent_slug?: (string | null);
    product_count?: number;
    subcategory_count?: number;
};

