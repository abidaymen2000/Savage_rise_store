/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreNavigationItemAdminRead } from './StoreNavigationItemAdminRead';
export type StoreNavigationMenuAdminRead = {
    id: string;
    code: string;
    label: string;
    description?: (string | null);
    is_active: boolean;
    items?: Array<StoreNavigationItemAdminRead>;
    item_tree?: Array<StoreNavigationItemAdminRead>;
    version: number;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at?: (string | null);
    updated_at?: (string | null);
};

