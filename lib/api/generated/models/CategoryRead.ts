/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryStatus } from './CategoryStatus';
export type CategoryRead = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    name: string;
    slug: string;
    description?: (string | null);
    parent_id?: (string | null);
    attribute_set_id?: (string | null);
    image?: (Record<string, any> | null);
    icon?: (Record<string, any> | null);
    position?: number;
    seo?: Record<string, any>;
    ancestors: Array<string>;
    path: string;
    level: number;
    status: CategoryStatus;
    archived_at?: (string | null);
};

