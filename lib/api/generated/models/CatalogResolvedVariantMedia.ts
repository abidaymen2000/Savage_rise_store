/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogResolvedMediaItem } from './CatalogResolvedMediaItem';
export type CatalogResolvedVariantMedia = {
    variant_id: string;
    product_id: string;
    resolution_scope?: ('product' | 'option_selector' | 'variant' | null);
    resolution_selector?: Record<string, string>;
    items?: Array<CatalogResolvedMediaItem>;
};

