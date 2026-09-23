/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSLocalizationPayload_Input } from './CMSLocalizationPayload_Input';
import type { StorePageSeo } from './StorePageSeo';
import type { StorePageType } from './StorePageType';
export type StorePageUpdate = {
    expected_version: number;
    key?: (string | null);
    slug?: (string | null);
    page_type?: (StorePageType | null);
    title?: (string | null);
    subtitle?: (string | null);
    content_blocks?: null;
    seo?: (StorePageSeo | null);
    localizations?: (Record<string, CMSLocalizationPayload_Input> | null);
};

