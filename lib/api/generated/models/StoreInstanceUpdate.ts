/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreBranding } from './StoreBranding';
import type { StoreCatalogSettings } from './StoreCatalogSettings';
import type { StoreCommerceSettings } from './StoreCommerceSettings';
import type { StoreFooterSettings } from './StoreFooterSettings';
import type { StoreLocaleConfig } from './StoreLocaleConfig';
import type { StorePhysicalLocation } from './StorePhysicalLocation';
import type { StoreRobotsSettings } from './StoreRobotsSettings';
import type { StoreSEODefaults } from './StoreSEODefaults';
export type StoreInstanceUpdate = {
    name?: (string | null);
    slug?: (string | null);
    legal_name?: (string | null);
    status?: ('active' | 'inactive' | 'maintenance' | null);
    country_code?: (string | null);
    default_currency?: (string | null);
    timezone?: (string | null);
    locale?: (string | null);
    locales?: (Array<StoreLocaleConfig> | null);
    contact_email?: (string | null);
    contact_phone?: (string | null);
    domain?: (string | null);
    logo_url?: (string | null);
    favicon_url?: (string | null);
    branding?: (StoreBranding | null);
    commerce_settings?: (StoreCommerceSettings | null);
    catalog_settings?: (StoreCatalogSettings | null);
    feature_flags?: (Record<string, boolean> | null);
    social_links?: (Record<string, string> | null);
    footer?: (StoreFooterSettings | null);
    physical_stores?: (Array<StorePhysicalLocation> | null);
    seo_defaults?: (StoreSEODefaults | null);
    robots?: (StoreRobotsSettings | null);
    expected_version?: (number | null);
};

