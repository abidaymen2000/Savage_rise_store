/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingReturnItemCreate } from './MarketingReturnItemCreate';
export type MarketingReturnOut = {
    id: string;
    reference: string;
    collaboration_id: string;
    partner_id?: (string | null);
    status: 'draft' | 'received' | 'completed' | 'cancelled';
    items?: Array<MarketingReturnItemCreate>;
    received_by?: (string | null);
    received_at?: (string | null);
    created_at: string;
    updated_at: string;
};

