/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VendorBillLineCreate } from './VendorBillLineCreate';
export type VendorBillCreate = {
    reference?: (string | null);
    supplier_id: string;
    purchase_order_id?: (string | null);
    supplier_invoice_number?: (string | null);
    invoice_date: string;
    due_date?: (string | null);
    currency?: (string | null);
    exchange_rate?: (number | string);
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
    lines: Array<VendorBillLineCreate>;
};

