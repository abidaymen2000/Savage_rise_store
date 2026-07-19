/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogMediaAssetRead } from './CatalogMediaAssetRead';
export type CatalogMediaAssignmentRead = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    product_id: string;
    media_asset_id: string;
    scope: 'product' | 'option_selector' | 'variant';
    selector?: Record<string, string>;
    variant_id?: (string | null);
    target_key: string;
    role?: string;
    position?: number;
    is_primary?: boolean;
    is_active?: boolean;
    created_by?: (string | null);
    updated_by?: (string | null);
    asset?: (CatalogMediaAssetRead | null);
};

