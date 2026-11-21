/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderBulkResult = {
    order_id: string;
    success: boolean;
    replayed?: boolean;
    status_code: number;
    error?: (string | null);
    order_status?: (string | null);
    payment_status?: (string | null);
    fulfillment_status?: (string | null);
};

