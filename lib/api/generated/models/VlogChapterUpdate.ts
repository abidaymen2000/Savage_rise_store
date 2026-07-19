/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShortFilm } from './ShortFilm';
export type VlogChapterUpdate = {
    title?: (string | null);
    slug?: (string | null);
    description?: (string | null);
    cover_image_url?: (string | null);
    trailer_video_url?: (string | null);
    status?: ('draft' | 'coming_soon' | 'active' | 'completed' | 'archived' | null);
    order?: (number | null);
    release_date?: (string | null);
    short_film?: (ShortFilm | null);
};

