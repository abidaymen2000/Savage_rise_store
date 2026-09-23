/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LandedCostAllocationOut } from './LandedCostAllocationOut';
import type { LandedCostLineOut } from './LandedCostLineOut';
import type { LandedCostManualAllocationCreate_Output } from './LandedCostManualAllocationCreate_Output';
export type LandedCostOut = {
    id: string;
    reference: string;
    purchase_order_id?: (string | null);
    goods_receipt_ids?: Array<string>;
    currency: string;
    exchange_rate: string;
    base_currency: string;
    allocation_method: 'by_quantity' | 'by_purchase_value' | 'manual';
    total_amount: string;
    status?: 'draft' | 'computed' | 'applied' | 'cancelled';
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines?: Array<LandedCostLineOut>;
    allocations?: Array<LandedCostAllocationOut>;
    manual_allocations?: Array<LandedCostManualAllocationCreate_Output>;
    computed_at?: (string | null);
    applied_at?: (string | null);
    cancelled_at?: (string | null);
    created_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

