/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BundleDefinition_Input } from './BundleDefinition_Input';
import type { CatalogLegacyMediaItem } from './CatalogLegacyMediaItem';
import type { TrackingMethod } from './TrackingMethod';
export type ProductUpdate = {
    name?: (string | null);
    slug?: (string | null);
    description?: (string | null);
    primary_category_id?: (string | null);
    category_ids?: (Array<string> | null);
    attribute_set_id?: (string | null);
    attribute_values?: (Record<string, any> | null);
    default_currency?: (string | null);
    track_inventory?: (boolean | null);
    tracking_method?: (TrackingMethod | null);
    requires_shipping?: (boolean | null);
    /**
     * @deprecated
     */
    media?: (Array<CatalogLegacyMediaItem> | null);
    bundle_definition?: (BundleDefinition_Input | null);
    seo?: (Record<string, any> | null);
    tags?: (Array<string> | null);
    published_at?: (string | null);
    expected_version?: (number | null);
};

