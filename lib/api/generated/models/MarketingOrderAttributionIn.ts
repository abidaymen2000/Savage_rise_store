/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingOrderAttributionIn = {
    partner_id?: (string | null);
    campaign_id?: (string | null);
    collaboration_id?: (string | null);
    method: 'promo_code' | 'tracking_link' | 'utm_mapping' | 'manual' | 'none';
    reason: string;
};

