/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionScopeType } from './PromotionScopeType';
import type { PromotionTargetCategory } from './PromotionTargetCategory';
import type { PromotionTargetProduct } from './PromotionTargetProduct';
import type { PromotionTargetVariant } from './PromotionTargetVariant';
export type PromotionTargetResolveResponse = {
    scope_type: PromotionScopeType;
    requested_ids?: Array<string>;
    items?: Array<(PromotionTargetProduct | PromotionTargetCategory | PromotionTargetVariant)>;
    missing_ids?: Array<string>;
    invalid_ids?: Array<string>;
    archived_ids?: Array<string>;
};

