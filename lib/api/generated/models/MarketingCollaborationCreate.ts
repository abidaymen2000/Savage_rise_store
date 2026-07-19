/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCollaborationItemCreate } from './MarketingCollaborationItemCreate';
import type { MarketingCollaborationShipping } from './MarketingCollaborationShipping';
export type MarketingCollaborationCreate = {
    type_id: string;
    type_version: number;
    partner_id?: (string | null);
    campaign_id?: (string | null);
    reason: string;
    objective: string;
    items?: Array<MarketingCollaborationItemCreate>;
    shipping?: MarketingCollaborationShipping;
    shipping_required?: boolean;
    shipping_cost?: number;
    partner_fee?: number;
    other_costs?: number;
    return_required?: boolean;
    expected_return_at?: (string | null);
    promo_code_id?: (string | null);
    tracking_link_id?: (string | null);
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    custom_data?: Record<string, any>;
};

