/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExternalUrlDestination } from './ExternalUrlDestination';
import type { InternalPathDestination } from './InternalPathDestination';
import type { ResolvedCatalogCategoryDestination } from './ResolvedCatalogCategoryDestination';
import type { ResolvedCatalogProductDestination } from './ResolvedCatalogProductDestination';
import type { ResolvedSystemRouteDestination } from './ResolvedSystemRouteDestination';
export type StoreNavigationPublicItem = {
    id: string;
    label: string;
    position: number;
    visibility: 'all' | 'desktop' | 'mobile';
    open_in_new_tab: boolean;
    icon?: (string | null);
    badge?: (string | null);
    destination: (ResolvedSystemRouteDestination | ResolvedCatalogCategoryDestination | ResolvedCatalogProductDestination | InternalPathDestination | ExternalUrlDestination);
    children?: Array<StoreNavigationPublicItem>;
};

