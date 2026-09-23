/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PurchaseOrderLineCreate } from './PurchaseOrderLineCreate';
export type PurchaseOrderUpdate = {
    reference?: (string | null);
    supplier_id?: (string | null);
    order_date?: (string | null);
    expected_date?: (string | null);
    currency?: (string | null);
    exchange_rate?: (number | string | null);
    base_currency?: (string | null);
    notes?: (string | null);
    attachments?: null;
    lines?: (Array<PurchaseOrderLineCreate> | null);
    expected_version?: (number | null);
};

