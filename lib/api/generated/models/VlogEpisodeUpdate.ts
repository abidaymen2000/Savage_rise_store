/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VlogEpisodeUpdate = {
    episode_number?: (number | null);
    title?: (string | null);
    description?: (string | null);
    video_url?: (string | null);
    thumbnail_url?: (string | null);
    release_date?: (string | null);
    status?: ('draft' | 'coming_soon' | 'released' | 'hidden' | null);
    linked_product_ids?: (Array<string> | null);
    order?: (number | null);
};

