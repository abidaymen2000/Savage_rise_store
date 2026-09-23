/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { PromotionPricing } from './PromotionPricing';
export type ProductVariantListSummary = {
    id: string;
    title: string;
    option_values?: Record<string, string>;
    option_value_labels?: Record<string, string>;
    base_price?: (number | null);
    effective_price?: (number | null);
    compare_at_price?: (number | null);
    currency?: (string | null);
    pricing?: (PromotionPricing | null);
    stock_available?: number;
    in_stock?: boolean;
    primary_image?: (CatalogLegacyMediaItem | null);
};

