/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CMSContentFeedProps = {
    content_type: string;
    limit?: number;
    sort?: 'published_at_desc' | 'updated_at_desc' | 'order_asc';
    filters?: Record<string, (string | number | boolean | Array<string>)>;
    display_variant?: 'grid' | 'list' | 'carousel';
    show_excerpt?: boolean;
    show_media?: boolean;
};

