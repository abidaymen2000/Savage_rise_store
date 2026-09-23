/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseOrderLineCreate } from './PurchaseOrderLineCreate';
export type PurchaseOrderCreate = {
    reference?: (string | null);
    supplier_id: string;
    order_date?: (string | null);
    expected_date?: (string | null);
    currency?: (string | null);
    exchange_rate?: (number | string);
    base_currency?: (string | null);
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines: Array<PurchaseOrderLineCreate>;
};

