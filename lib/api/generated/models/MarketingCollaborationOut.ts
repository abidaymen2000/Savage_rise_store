/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingCollaborationItemOut } from './MarketingCollaborationItemOut';
import type { MarketingCollaborationShipping } from './MarketingCollaborationShipping';
export type MarketingCollaborationOut = {
    id: string;
    reference: string;
    type_id: string;
    type_version: number;
    type_snapshot: Record<string, any>;
    partner_id?: (string | null);
    campaign_id?: (string | null);
    reason: string;
    objective: string;
    workflow_status: 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
    stock_status: 'none' | 'reserved' | 'prepared' | 'dispatched' | 'partially_returned' | 'returned' | 'consumed' | 'damaged' | 'lost' | 'mixed';
    deliverable_status: 'not_required' | 'pending' | 'partial' | 'completed' | 'overdue' | 'cancelled';
    commission_status?: string;
    items?: Array<MarketingCollaborationItemOut>;
    shipping?: MarketingCollaborationShipping;
    shipping_required?: boolean;
    shipping_cost?: number;
    partner_fee?: number;
    other_costs?: number;
    total_retail_value?: number;
    total_product_cost?: number;
    total_collaboration_cost?: number;
    return_required?: boolean;
    expected_return_at?: (string | null);
    promo_code_id?: (string | null);
    promo_code_snapshot?: (Record<string, any> | null);
    tracking_link_id?: (string | null);
    utm_source?: (string | null);
    utm_medium?: (string | null);
    utm_campaign?: (string | null);
    utm_content?: (string | null);
    custom_data?: Record<string, any>;
    requested_by?: (string | null);
    approved_by?: (string | null);
    prepared_by?: (string | null);
    dispatched_by?: (string | null);
    completed_by?: (string | null);
    submitted_at?: (string | null);
    approved_at?: (string | null);
    prepared_at?: (string | null);
    dispatched_at?: (string | null);
    completed_at?: (string | null);
    cancelled_at?: (string | null);
    version?: number;
    created_at: string;
    updated_at: string;
};

