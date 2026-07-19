/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingAddress } from './MarketingAddress';
import type { MarketingSocialAccount } from './MarketingSocialAccount';
export type MarketingPartnerUpdate = {
    display_name?: (string | null);
    legal_name?: (string | null);
    email?: (string | null);
    phone?: (string | null);
    user_id?: (string | null);
    social_accounts?: (Array<MarketingSocialAccount> | null);
    address?: (MarketingAddress | null);
    status?: ('active' | 'inactive' | 'blocked' | 'archived' | null);
    internal_owner_admin_id?: (string | null);
    tags?: (Array<string> | null);
    notes?: (string | null);
    expected_version?: (number | null);
};

