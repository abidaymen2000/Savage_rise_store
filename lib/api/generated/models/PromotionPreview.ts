/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionPreviewItem } from './PromotionPreviewItem';
import type { PromotionStatus } from './PromotionStatus';
export type PromotionPreview = {
    promotion_id: string;
    status: PromotionStatus;
    affected_products: number;
    affected_variants: number;
    items?: Array<PromotionPreviewItem>;
};

