/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionDiscountType } from './PromotionDiscountType';
import type { PromotionScopeType } from './PromotionScopeType';
export type PromotionUpdate = {
    name?: (string | null);
    description?: (string | null);
    enabled?: (boolean | null);
    discount_type?: (PromotionDiscountType | null);
    discount_value?: (number | string | null);
    scope_type?: (PromotionScopeType | null);
    scope_ids?: (Array<string> | null);
    starts_at?: (string | null);
    ends_at?: (string | null);
    priority?: (number | null);
    stackable?: (boolean | null);
    badge?: (string | null);
    expected_version?: (number | null);
};

