/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionDiscountType } from './PromotionDiscountType';
import type { PromotionScopeType } from './PromotionScopeType';
import type { PromotionStatus } from './PromotionStatus';
export type PromotionRead = {
    id: string;
    version: number;
    created_at?: (string | null);
    updated_at?: (string | null);
    name: string;
    description?: (string | null);
    enabled?: boolean;
    discount_type: PromotionDiscountType;
    discount_value: string;
    scope_type: PromotionScopeType;
    scope_ids?: Array<string>;
    starts_at?: (string | null);
    ends_at?: (string | null);
    priority?: number;
    stackable?: boolean;
    badge?: (string | null);
    status: PromotionStatus;
    archived_at?: (string | null);
    created_by?: (string | null);
    updated_by?: (string | null);
};

