/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreBranding } from './StoreBranding';
import type { StoreCatalogSettings } from './StoreCatalogSettings';
import type { StoreCommerceSettings } from './StoreCommerceSettings';
export type PublicStoreConfig = {
    name: string;
    slug: string;
    status: 'active' | 'inactive' | 'maintenance';
    country_code: string;
    default_currency: string;
    timezone: string;
    locale: string;
    contact_email?: (string | null);
    contact_phone?: (string | null);
    domain?: (string | null);
    logo_url?: (string | null);
    favicon_url?: (string | null);
    branding?: StoreBranding;
    commerce_settings?: StoreCommerceSettings;
    catalog_settings?: StoreCatalogSettings;
    feature_flags?: Record<string, boolean>;
    social_links?: Record<string, string>;
};

