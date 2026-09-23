/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSGlobalSectionStatus } from './CMSGlobalSectionStatus';
import type { CMSLocaleState } from './CMSLocaleState';
import type { StorePageCardsBlock_Output } from './StorePageCardsBlock_Output';
import type { StorePageContactInfoBlock_Output } from './StorePageContactInfoBlock_Output';
import type { StorePageContentFeedBlock_Output } from './StorePageContentFeedBlock_Output';
import type { StorePageCountdownBlock_Output } from './StorePageCountdownBlock_Output';
import type { StorePageFaqBlock_Output } from './StorePageFaqBlock_Output';
import type { StorePageGlobalSectionRefBlock_Output } from './StorePageGlobalSectionRefBlock_Output';
import type { StorePageHeroBlock_Output } from './StorePageHeroBlock_Output';
import type { StorePageImageBlock_Output } from './StorePageImageBlock_Output';
import type { StorePageMapBlock_Output } from './StorePageMapBlock_Output';
import type { StorePageRichTextBlock_Output } from './StorePageRichTextBlock_Output';
import type { StorePageTableBlock_Output } from './StorePageTableBlock_Output';
export type CMSGlobalSectionOut = {
    id: string;
    key: string;
    name: string;
    description?: (string | null);
    status: CMSGlobalSectionStatus;
    version: number;
    latest_revision?: (number | null);
    published_revision?: (number | null);
    published_locales?: Record<string, Record<string, any>>;
    locale_states?: Array<CMSLocaleState>;
    has_unpublished_changes?: boolean;
    publication_state?: (string | null);
    components?: Array<(StorePageHeroBlock_Output | StorePageCountdownBlock_Output | StorePageRichTextBlock_Output | StorePageImageBlock_Output | StorePageCardsBlock_Output | StorePageFaqBlock_Output | StorePageTableBlock_Output | StorePageContactInfoBlock_Output | StorePageMapBlock_Output | StorePageGlobalSectionRefBlock_Output | StorePageContentFeedBlock_Output)>;
    created_at: string;
    created_by?: (string | null);
    updated_at: string;
    updated_by?: (string | null);
    published_at?: (string | null);
    published_by?: (string | null);
    archived_at?: (string | null);
};

