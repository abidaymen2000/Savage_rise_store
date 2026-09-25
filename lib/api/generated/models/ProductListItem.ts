/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { ProductKind } from './ProductKind';
import type { ProductPublicOptionAxis } from './ProductPublicOptionAxis';
import type { ProductStatus } from './ProductStatus';
import type { ProductVariantListSummary } from './ProductVariantListSummary';
import type { PromotionPricing } from './PromotionPricing';
export type ProductListItem = {
    /** Read-only projection of persisted in_stock=false; never stored separately. */
    forced_sold_out?: boolean;
    id: string;
    name: string;
    reference?: (string | null);
    slug: string;
    product_kind: ProductKind;
    status: ProductStatus;
    primary_category_id?: (string | null);
    default_currency: string;
    published_at?: (string | null);
    version: number;
    variant_count?: number;
    axis_count?: number;
    min_price?: (number | null);
    max_price?: (number | null);
    min_effective_price?: (number | null);
    max_effective_price?: (number | null);
    pricing?: (PromotionPricing | null);
    currency?: (string | null);
    stock_available?: number;
    in_stock?: boolean;
    primary_image?: (CatalogLegacyMediaItem | null);
    tags?: Array<string>;
    option_axes?: Array<ProductPublicOptionAxis>;
    variant_summary?: (Array<ProductVariantListSummary> | null);
};

