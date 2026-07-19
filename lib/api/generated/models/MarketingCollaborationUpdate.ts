/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCollaborationItemCreate } from './MarketingCollaborationItemCreate';
import type { MarketingCollaborationShipping } from './MarketingCollaborationShipping';
export type MarketingCollaborationUpdate = {
    partner_id?: (string | null);
    campaign_id?: (string | null);
    reason?: (string | null);
    objective?: (string | null);
    items?: (Array<MarketingCollaborationItemCreate> | null);
    shipping?: (MarketingCollaborationShipping | null);
    shipping_required?: (boolean | null);
    shipping_cost?: (number | null);
    partner_fee?: (number | null);
    other_costs?: (number | null);
    return_required?: (boolean | null);
    expected_return_at?: (string | null);
    promo_code_id?: (string | null);
    tracking_link_id?: (string | null);
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    custom_data?: (Record<string, any> | null);
    expected_version?: (number | null);
};

