/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PartnerCommissionOut = {
    id: string;
    partner_id: string;
    campaign_id?: (string | null);
    collaboration_id?: (string | null);
    order_id?: (string | null);
    transaction_type: 'earn' | 'adjustment' | 'reversal' | 'payment';
    status: 'pending' | 'approved' | 'payable' | 'paid' | 'cancelled' | 'reversed';
    commission_type?: ('percentage' | 'fixed_amount' | null);
    commission_value?: (number | null);
    commission_base_amount?: number;
    commission_amount?: number;
    currency?: string;
    operation_key: string;
    approved_at?: (string | null);
    paid_at?: (string | null);
    cancelled_at?: (string | null);
    reason?: (string | null);
    created_at: string;
    updated_at: string;
};

