/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LandedCostLineCreate } from './LandedCostLineCreate';
import type { LandedCostManualAllocationCreate_Input } from './LandedCostManualAllocationCreate_Input';
export type LandedCostCreate = {
    reference?: (string | null);
    purchase_order_id?: (string | null);
    goods_receipt_ids?: Array<string>;
    currency?: (string | null);
    exchange_rate?: (number | string);
    base_currency?: (string | null);
    allocation_method?: 'by_quantity' | 'by_purchase_value' | 'manual';
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines: Array<LandedCostLineCreate>;
    manual_allocations?: Array<LandedCostManualAllocationCreate_Input>;
};

