/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { TrackingMethod } from './TrackingMethod';
import type { VariantStatus } from './VariantStatus';
export type ProductVariantCreate = {
    title: string;
    sku?: (string | null);
    barcode?: (string | null);
    option_values?: Record<string, string>;
    attribute_values?: Record<string, any>;
    base_price: (number | string);
    compare_at_price?: (number | string | null);
    currency?: (string | null);
    cost_reference?: (Record<string, any> | null);
    weight?: (number | string | null);
    weight_unit?: (string | null);
    requires_shipping?: (boolean | null);
    track_inventory?: (boolean | null);
    tracking_method?: (TrackingMethod | null);
    /**
     * @deprecated
     */
    media?: Array<CatalogLegacyMediaItem>;
    status?: VariantStatus;
    position?: number;
};

