/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
};

