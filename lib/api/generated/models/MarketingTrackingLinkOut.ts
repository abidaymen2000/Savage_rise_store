/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingTrackingLinkOut = {
    id: string;
    code: string;
    partner_id?: (string | null);
    campaign_id?: (string | null);
    collaboration_id?: (string | null);
    destination_url: string;
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    is_active?: boolean;
    expires_at?: (string | null);
    click_count?: number;
    version?: number;
    created_by?: (string | null);
    created_at: string;
    updated_at: string;
};

