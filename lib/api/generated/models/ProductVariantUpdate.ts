/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { TrackingMethod } from './TrackingMethod';
import type { VariantStatus } from './VariantStatus';
export type ProductVariantUpdate = {
    title?: (string | null);
    sku?: (string | null);
    barcode?: (string | null);
    attribute_values?: (Record<string, any> | null);
    base_price?: (number | string | null);
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
    media?: (Array<CatalogLegacyMediaItem> | null);
    status?: (VariantStatus | null);
    position?: (number | null);
    expected_version?: (number | null);
};

