/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoyaltySettingsOut } from './LoyaltySettingsOut';
import type { LoyaltyTransactionOut } from './LoyaltyTransactionOut';
export type LoyaltyBalanceOut = {
    user_id: string;
    points_balance: number;
    value_balance: number;
    settings: LoyaltySettingsOut;
    recent_transactions?: Array<LoyaltyTransactionOut>;
};

