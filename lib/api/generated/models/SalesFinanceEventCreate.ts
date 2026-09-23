/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SalesFinanceEventCreate = {
    event_id: string;
    event_type: 'order_payment_received' | 'order_payment_collected' | 'order_refunded';
    order_id: string;
    amount: (number | string);
    financial_account_id: string;
    currency?: (string | null);
    payment_method?: (string | null);
    occurred_at?: (string | null);
    metadata?: Record<string, any>;
};

