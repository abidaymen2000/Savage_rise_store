/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StorePageCardsBlock } from './StorePageCardsBlock';
import type { StorePageContactInfoBlock } from './StorePageContactInfoBlock';
import type { StorePageFaqBlock } from './StorePageFaqBlock';
import type { StorePageHeroBlock } from './StorePageHeroBlock';
import type { StorePageImageBlock } from './StorePageImageBlock';
import type { StorePageMapBlock } from './StorePageMapBlock';
import type { StorePageRichTextBlock } from './StorePageRichTextBlock';
import type { StorePageSeo } from './StorePageSeo';
import type { StorePageTableBlock } from './StorePageTableBlock';
import type { StorePageType } from './StorePageType';
export type StorePageCreate = {
    key: string;
    slug?: (string | null);
    page_type?: StorePageType;
    title: string;
    subtitle?: (string | null);
    content_blocks?: Array<(StorePageHeroBlock | StorePageRichTextBlock | StorePageImageBlock | StorePageCardsBlock | StorePageFaqBlock | StorePageTableBlock | StorePageContactInfoBlock | StorePageMapBlock)>;
    seo?: StorePageSeo;
};

