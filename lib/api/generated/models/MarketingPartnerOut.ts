/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingAddress } from './MarketingAddress';
import type { MarketingSocialAccount } from './MarketingSocialAccount';
export type MarketingPartnerOut = {
    id: string;
    reference: string;
    partner_type: 'influencer' | 'model' | 'ambassador' | 'photographer' | 'content_creator' | 'press' | 'media' | 'affiliate' | 'partner' | 'other';
    display_name: string;
    legal_name?: (string | null);
    email?: (string | null);
    phone?: (string | null);
    user_id?: (string | null);
    social_accounts?: Array<MarketingSocialAccount>;
    address?: MarketingAddress;
    status: 'active' | 'inactive' | 'blocked' | 'archived';
    internal_owner_admin_id?: (string | null);
    tags?: Array<string>;
    notes?: (string | null);
    version?: number;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    archived_at?: (string | null);
};

