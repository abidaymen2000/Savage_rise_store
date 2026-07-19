/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingCampaignCreate = {
    type_id: string;
    type_version: number;
    name: string;
    description?: (string | null);
    objective?: (string | null);
    starts_at?: (string | null);
    ends_at?: (string | null);
    budget_amount?: (number | null);
    currency?: string;
    product_ids?: Array<string>;
    partner_ids?: Array<string>;
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    owner_admin_id?: (string | null);
    custom_data?: Record<string, any>;
    notes?: (string | null);
};

