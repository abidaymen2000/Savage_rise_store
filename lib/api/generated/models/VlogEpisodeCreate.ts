/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VlogEpisodeCreate = {
    episode_number: number;
    title: string;
    description?: (string | null);
    video_url?: (string | null);
    thumbnail_url?: (string | null);
    release_date?: (string | null);
    status?: 'draft' | 'coming_soon' | 'released' | 'hidden';
    linked_product_ids?: Array<string>;
    order?: number;
};

