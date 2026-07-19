/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AnalyticsEventRead = {
    id: string;
    event_id?: (string | null);
    event_name: string;
    event_version?: number;
    event_source?: (string | null);
    occurred_at?: (string | null);
    received_at?: (string | null);
    user_id?: (string | null);
    anonymous_id?: (string | null);
    session_id?: (string | null);
    page_view_id?: (string | null);
    checkout_id?: (string | null);
    product_id?: (string | null);
    variant_id?: (string | null);
    order_id?: (string | null);
    event_category?: (string | null);
    page_path?: (string | null);
    page_title?: (string | null);
    action_target?: (string | null);
    device_type?: string;
    currency?: (string | null);
    value?: (number | null);
    metadata?: Record<string, any>;
    properties?: Record<string, any>;
    ip_address?: (string | null);
    user_agent?: (string | null);
    referrer?: (string | null);
    source?: string;
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    utm_term?: (string | null);
    fbclid?: (string | null);
    fbp?: (string | null);
    fbc?: (string | null);
    channel_group?: (string | null);
    deduplication_key?: (string | null);
    has_account?: boolean;
    created_at: string;
};

