/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BundleDefinition_Output } from './BundleDefinition_Output';
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { ProductKind } from './ProductKind';
import type { ProductStatus } from './ProductStatus';
import type { ProductVariantRead } from './ProductVariantRead';
import type { TrackingMethod } from './TrackingMethod';
export type ProductRead = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    name: string;
    slug: string;
    description?: (string | null);
    product_kind: ProductKind;
    primary_category_id?: (string | null);
    category_ids?: Array<string>;
    attribute_set_id?: (string | null);
    attribute_values?: Record<string, any>;
    default_currency: string;
    track_inventory?: (boolean | null);
    tracking_method?: (TrackingMethod | null);
    requires_shipping?: (boolean | null);
    /**
     * @deprecated
     */
    media?: Array<CatalogLegacyMediaItem>;
    bundle_definition?: (BundleDefinition_Output | null);
    seo?: Record<string, any>;
    tags?: Array<string>;
    published_at?: (string | null);
    created_by?: (string | null);
    variants?: Array<ProductVariantRead>;
    status: ProductStatus;
    archived_at?: (string | null);
    archived_by?: (string | null);
};

