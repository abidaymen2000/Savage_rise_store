/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductSummary } from './ProductSummary';
export type VlogEpisodeOut = {
    episode_number: number;
    title: string;
    description?: (string | null);
    video_url?: (string | null);
    thumbnail_url?: (string | null);
    release_date?: (string | null);
    status?: 'draft' | 'coming_soon' | 'released' | 'hidden';
    linked_product_ids?: Array<string>;
    order?: number;
    id: string;
    chapter_id: string;
    products?: Array<ProductSummary>;
    view_count?: number;
    like_count?: number;
    comment_count?: number;
    liked_by_current_user?: boolean;
    created_at: string;
    updated_at: string;
};

