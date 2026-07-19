/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoyaltyTransactionOut = {
    id: string;
    user_id: string;
    type: 'earn' | 'redeem' | 'refund' | 'adjust';
    points: number;
    value: number;
    order_id?: (string | null);
    reason?: (string | null);
    operation_key?: (string | null);
    balance_after: number;
    created_at: string;
};

