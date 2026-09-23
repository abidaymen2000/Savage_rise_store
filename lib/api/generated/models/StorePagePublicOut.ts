/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSSEOResolved } from './CMSSEOResolved';
import type { StorePageCardsBlockPublic } from './StorePageCardsBlockPublic';
import type { StorePageContactInfoBlockPublic } from './StorePageContactInfoBlockPublic';
import type { StorePageContentFeedBlockPublic } from './StorePageContentFeedBlockPublic';
import type { StorePageCountdownBlockPublic } from './StorePageCountdownBlockPublic';
import type { StorePageFaqBlockPublic } from './StorePageFaqBlockPublic';
import type { StorePageGlobalSectionRefBlockPublic } from './StorePageGlobalSectionRefBlockPublic';
import type { StorePageHeroBlockPublic } from './StorePageHeroBlockPublic';
import type { StorePageImageBlockPublic } from './StorePageImageBlockPublic';
import type { StorePageMapBlockPublic } from './StorePageMapBlockPublic';
import type { StorePageRichTextBlockPublic } from './StorePageRichTextBlockPublic';
import type { StorePageSeo } from './StorePageSeo';
import type { StorePageTableBlockPublic } from './StorePageTableBlockPublic';
import type { StorePageType } from './StorePageType';
export type StorePagePublicOut = {
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
    content_blocks?: Array<(StorePageHeroBlockPublic | StorePageCountdownBlockPublic | StorePageRichTextBlockPublic | StorePageImageBlockPublic | StorePageCardsBlockPublic | StorePageFaqBlockPublic | StorePageTableBlockPublic | StorePageContactInfoBlockPublic | StorePageMapBlockPublic | StorePageGlobalSectionRefBlockPublic | StorePageContentFeedBlockPublic)>;
    published_at?: (string | null);
};

