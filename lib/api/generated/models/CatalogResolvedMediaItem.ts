/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CatalogResolvedMediaItem = {
    asset_id: string;
    url: string;
    thumbnail_url?: (string | null);
    role?: string;
    position?: number;
    is_primary?: boolean;
    source_scope: 'product' | 'option_selector' | 'variant';
    source_selector?: Record<string, string>;
    source_variant_id?: (string | null);
};

