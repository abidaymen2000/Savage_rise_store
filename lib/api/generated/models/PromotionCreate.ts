/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionDiscountType } from './PromotionDiscountType';
import type { PromotionScopeType } from './PromotionScopeType';
export type PromotionCreate = {
    name: string;
    description?: (string | null);
    enabled?: boolean;
    discount_type: PromotionDiscountType;
    discount_value: (number | string);
    scope_type: PromotionScopeType;
    scope_ids?: Array<string>;
    starts_at?: (string | null);
    ends_at?: (string | null);
    priority?: number;
    stackable?: boolean;
    badge?: (string | null);
};

