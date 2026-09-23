/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentAllocationCreate = {
    document_type: 'vendor_bill' | 'expense' | 'sales_order' | 'customer_invoice';
    document_id: string;
    amount: (number | string);
};

