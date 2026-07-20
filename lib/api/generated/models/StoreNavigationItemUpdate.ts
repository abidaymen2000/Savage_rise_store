/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogCategoryDestination } from './CatalogCategoryDestination';
import type { CatalogProductDestination } from './CatalogProductDestination';
import type { ExternalUrlDestination } from './ExternalUrlDestination';
import type { InternalPathDestination } from './InternalPathDestination';
import type { SystemRouteDestination } from './SystemRouteDestination';
export type StoreNavigationItemUpdate = {
    expected_version: number;
    parent_id?: (string | null);
    label?: (string | null);
    position?: (number | null);
    is_visible?: (boolean | null);
    visibility?: ('all' | 'desktop' | 'mobile' | null);
    open_in_new_tab?: (boolean | null);
    icon?: (string | null);
    badge?: (string | null);
    destination?: ((SystemRouteDestination | CatalogCategoryDestination | CatalogProductDestination | InternalPathDestination | ExternalUrlDestination) | null);
};

