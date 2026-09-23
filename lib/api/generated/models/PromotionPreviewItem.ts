/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionPricing } from './PromotionPricing';
export type PromotionPreviewItem = {
    product_id: string;
    product_name: string;
    variant_id: string;
    variant_title: string;
    base_price: number;
    effective_price: number;
    discount_amount: number;
    discount_percentage: number;
    currency?: (string | null);
    pricing: PromotionPricing;
};

