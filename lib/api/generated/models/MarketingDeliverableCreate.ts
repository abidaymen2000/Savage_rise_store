/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingDeliverableCreate = {
    deliverable_type: 'instagram_story' | 'instagram_reel' | 'instagram_post' | 'tiktok_video' | 'youtube_video' | 'photos' | 'raw_video' | 'event_appearance' | 'product_review' | 'other';
    title: string;
    description?: (string | null);
    quantity_expected?: number;
    due_at?: (string | null);
};

