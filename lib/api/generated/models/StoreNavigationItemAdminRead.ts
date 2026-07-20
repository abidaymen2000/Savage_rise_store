/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogCategoryDestination } from './CatalogCategoryDestination';
import type { CatalogProductDestination } from './CatalogProductDestination';
import type { ExternalUrlDestination } from './ExternalUrlDestination';
import type { InternalPathDestination } from './InternalPathDestination';
import type { SystemRouteDestination } from './SystemRouteDestination';
export type StoreNavigationItemAdminRead = {
    parent_id?: (string | null);
    label: string;
    position?: number;
    is_visible?: boolean;
    visibility?: 'all' | 'desktop' | 'mobile';
    open_in_new_tab?: boolean;
    icon?: (string | null);
    badge?: (string | null);
    destination: (SystemRouteDestination | CatalogCategoryDestination | CatalogProductDestination | InternalPathDestination | ExternalUrlDestination);
    id: string;
    children?: Array<StoreNavigationItemAdminRead>;
};

