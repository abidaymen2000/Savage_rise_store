/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingCampaignOut = {
    id: string;
    reference: string;
    type_id: string;
    type_version: number;
    type_snapshot: Record<string, any>;
    name: string;
    description?: (string | null);
    objective?: (string | null);
    status: 'draft' | 'planned' | 'active' | 'paused' | 'completed' | 'cancelled' | 'archived';
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
    version?: number;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    activated_at?: (string | null);
    completed_at?: (string | null);
    cancelled_at?: (string | null);
};

