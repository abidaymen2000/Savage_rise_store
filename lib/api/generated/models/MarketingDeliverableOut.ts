/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingDeliverableOut = {
    id: string;
    collaboration_id: string;
    campaign_id?: (string | null);
    partner_id?: (string | null);
    deliverable_type: 'instagram_story' | 'instagram_reel' | 'instagram_post' | 'tiktok_video' | 'youtube_video' | 'photos' | 'raw_video' | 'event_appearance' | 'product_review' | 'other';
    title: string;
    description?: (string | null);
    quantity_expected: number;
    quantity_completed?: number;
    due_at?: (string | null);
    status: string;
    publication_url?: (string | null);
    published_at?: (string | null);
    metrics?: Record<string, (number | null)>;
    validated_by?: (string | null);
    validated_at?: (string | null);
    version?: number;
    created_at: string;
    updated_at: string;
};

