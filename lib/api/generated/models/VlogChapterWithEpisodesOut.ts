/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShortFilm } from './ShortFilm';
import type { VlogEpisodeOut } from './VlogEpisodeOut';
export type VlogChapterWithEpisodesOut = {
    title: string;
    slug: string;
    description?: (string | null);
    cover_image_url?: (string | null);
    trailer_video_url?: (string | null);
    status?: 'draft' | 'coming_soon' | 'active' | 'completed' | 'archived';
    order?: number;
    release_date?: (string | null);
    short_film?: (ShortFilm | null);
    id: string;
    created_at: string;
    updated_at: string;
    episodes?: Array<VlogEpisodeOut>;
};

