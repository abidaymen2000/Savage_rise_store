/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorBillLineCreate } from './VendorBillLineCreate';
export type VendorBillUpdate = {
    reference?: (string | null);
    supplier_id?: (string | null);
    purchase_order_id?: (string | null);
    supplier_invoice_number?: (string | null);
    invoice_date?: (string | null);
    due_date?: (string | null);
    currency?: (string | null);
    exchange_rate?: (number | string | null);
    notes?: (string | null);
    attachments?: null;
    lines?: (Array<VendorBillLineCreate> | null);
    expected_version?: (number | null);
};

