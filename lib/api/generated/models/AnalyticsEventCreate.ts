/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnalyticsAttributionIn } from './AnalyticsAttributionIn';
import type { AnalyticsContextIn } from './AnalyticsContextIn';
import type { AnalyticsEventItemIn } from './AnalyticsEventItemIn';
export type AnalyticsEventCreate = {
    event_id?: (string | null);
    /**
     * Nom de l'evenement analytics
     */
    event_name: string;
    event_version?: number;
    event_source?: (string | null);
    event_time?: (string | null);
    occurred_at?: (string | null);
    anonymous_id?: (string | null);
    session_id?: (string | null);
    page_view_id?: (string | null);
    checkout_id?: (string | null);
    user_id?: (string | null);
    product_id?: (string | null);
    variant_id?: (string | null);
    order_id?: (string | null);
    currency?: (string | null);
    value?: (number | null);
    revenue?: (number | null);
    page_url?: (string | null);
    page_path?: (string | null);
    page_title?: (string | null);
    action_target?: (string | null);
    source?: (string | null);
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    utm_term?: (string | null);
    device_type?: (string | null);
    fbclid?: (string | null);
    fbp?: (string | null);
    fbc?: (string | null);
    landing_page?: (string | null);
    landing_url?: (string | null);
    referrer?: (string | null);
    context?: AnalyticsContextIn;
    attribution?: AnalyticsAttributionIn;
    items?: Array<AnalyticsEventItemIn>;
    metadata?: Record<string, any>;
    properties?: Record<string, any>;
};

