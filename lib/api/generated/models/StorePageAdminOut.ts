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
import type { StorePageStatus } from './StorePageStatus';
import type { StorePageTableBlock } from './StorePageTableBlock';
import type { StorePageType } from './StorePageType';
export type StorePageAdminOut = {
    id: string;
    version: number;
    key: string;
    slug: string;
    page_type: StorePageType;
    title: string;
    subtitle?: (string | null);
    status: StorePageStatus;
    content_blocks?: Array<(StorePageHeroBlock | StorePageRichTextBlock | StorePageImageBlock | StorePageCardsBlock | StorePageFaqBlock | StorePageTableBlock | StorePageContactInfoBlock | StorePageMapBlock)>;
    seo?: StorePageSeo;
    published_at?: (string | null);
    published_by?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    archived_at?: (string | null);
};

