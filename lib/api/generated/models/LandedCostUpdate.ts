/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LandedCostLineCreate } from './LandedCostLineCreate';
import type { LandedCostManualAllocationCreate_Input } from './LandedCostManualAllocationCreate_Input';
export type LandedCostUpdate = {
    purchase_order_id?: (string | null);
    goods_receipt_ids?: (Array<string> | null);
    currency?: (string | null);
    exchange_rate?: (number | string | null);
    base_currency?: (string | null);
    allocation_method?: ('by_quantity' | 'by_purchase_value' | 'manual' | null);
    notes?: (string | null);
    attachments?: null;
    lines?: (Array<LandedCostLineCreate> | null);
    manual_allocations?: (Array<LandedCostManualAllocationCreate_Input> | null);
    expected_version?: (number | null);
};

