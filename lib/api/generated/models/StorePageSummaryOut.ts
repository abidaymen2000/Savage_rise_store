/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSSEOResolved } from './CMSSEOResolved';
import type { StorePageSeo } from './StorePageSeo';
import type { StorePageType } from './StorePageType';
export type StorePageSummaryOut = {
    key: string;
    slug: string;
    page_type: StorePageType;
    title: string;
    subtitle?: (string | null);
    seo?: StorePageSeo;
    updated_at: string;
    version: number;
    published_revision?: (number | null);
    locale?: (string | null);
    direction?: (string | null);
    fallback_locale_used?: (string | null);
    translation_status?: (string | null);
    resolved_seo?: (CMSSEOResolved | null);
};

