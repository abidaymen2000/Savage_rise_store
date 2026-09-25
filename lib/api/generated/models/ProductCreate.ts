/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BundleDefinition_Input } from './BundleDefinition_Input';
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { ProductKind } from './ProductKind';
import type { ProductVariantCreate } from './ProductVariantCreate';
import type { TrackingMethod } from './TrackingMethod';
export type ProductCreate = {
    /** Manual permission in admin writes/reads; effective availability in storefront detail. */
    in_stock?: boolean;
    name: string;
    /**
     * Reference metier du produit parent. Si omise, elle est generee automatiquement par le backend. Unique dans le catalogue du tenant. Distincte des SKU des variantes.
     */
    reference?: (string | null);
    /**
     * Optional product slug. When omitted during creation, the backend generates a tenant-unique slug from the product name.
     */
    slug?: (string | null);
    description?: (string | null);
    product_kind: ProductKind;
    primary_category_id?: (string | null);
    category_ids?: Array<string>;
    attribute_set_id?: (string | null);
    attribute_values?: Record<string, any>;
    default_currency?: (string | null);
    tax_category_id?: (string | null);
    track_inventory?: (boolean | null);
    tracking_method?: (TrackingMethod | null);
    requires_shipping?: (boolean | null);
    /**
     * @deprecated
     */
    media?: Array<CatalogLegacyMediaItem>;
    bundle_definition?: (BundleDefinition_Input | null);
    seo?: Record<string, any>;
    tags?: Array<string>;
    published_at?: (string | null);
    created_by?: (string | null);
    variants?: Array<ProductVariantCreate>;
};

