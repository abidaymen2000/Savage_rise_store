/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSGlobalSectionStatus } from './CMSGlobalSectionStatus';
import type { CMSLocalizationPayload_Input } from './CMSLocalizationPayload_Input';
import type { StorePageCardsBlock_Input } from './StorePageCardsBlock_Input';
import type { StorePageContactInfoBlock_Input } from './StorePageContactInfoBlock_Input';
import type { StorePageContentFeedBlock_Input } from './StorePageContentFeedBlock_Input';
import type { StorePageCountdownBlock_Input } from './StorePageCountdownBlock_Input';
import type { StorePageFaqBlock_Input } from './StorePageFaqBlock_Input';
import type { StorePageGlobalSectionRefBlock_Input } from './StorePageGlobalSectionRefBlock_Input';
import type { StorePageHeroBlock_Input } from './StorePageHeroBlock_Input';
import type { StorePageImageBlock_Input } from './StorePageImageBlock_Input';
import type { StorePageMapBlock_Input } from './StorePageMapBlock_Input';
import type { StorePageRichTextBlock_Input } from './StorePageRichTextBlock_Input';
import type { StorePageTableBlock_Input } from './StorePageTableBlock_Input';
export type CMSGlobalSectionCreate = {
    key: string;
    name: string;
    description?: (string | null);
    status?: CMSGlobalSectionStatus;
    components?: Array<(StorePageHeroBlock_Input | StorePageCountdownBlock_Input | StorePageRichTextBlock_Input | StorePageImageBlock_Input | StorePageCardsBlock_Input | StorePageFaqBlock_Input | StorePageTableBlock_Input | StorePageContactInfoBlock_Input | StorePageMapBlock_Input | StorePageGlobalSectionRefBlock_Input | StorePageContentFeedBlock_Input)>;
    localizations?: Record<string, CMSLocalizationPayload_Input>;
};

