/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryAllocationOut } from './InventoryAllocationOut';
import type { LoyaltyQuoteSummaryOut } from './LoyaltyQuoteSummaryOut';
import type { OrderQuoteLineOut } from './OrderQuoteLineOut';
import type { PromotionQuoteOut } from './PromotionQuoteOut';
export type OrderQuoteOut = {
    currency?: string;
    subtotal: number;
    bundle_discount?: number;
    promotion_discount: number;
    loyalty_discount: number;
    shipping_amount: number;
    total: number;
    items?: Array<OrderQuoteLineOut>;
    promotion?: (PromotionQuoteOut | null);
    loyalty?: (LoyaltyQuoteSummaryOut | null);
    warnings?: Array<string>;
    shipping_rate_id?: (string | null);
    shipping_rate_name?: (string | null);
    inventory_allocations?: Array<InventoryAllocationOut>;
    discount_value?: number;
    bundle_discount_value?: number;
    promo_code?: (string | null);
    promo_discount_value?: number;
    loyalty_points_used?: number;
    loyalty_discount_value?: number;
    total_amount: number;
    item_snapshots?: Array<OrderQuoteLineOut>;
};

