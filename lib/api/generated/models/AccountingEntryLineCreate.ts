/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AccountingEntryLineCreate = {
    account_id: string;
    description?: (string | null);
    debit?: (number | string);
    credit?: (number | string);
    currency?: (string | null);
    amount_currency?: (number | string | null);
    exchange_rate?: (number | string | null);
    partner_type?: (string | null);
    partner_id?: (string | null);
    product_id?: (string | null);
    variant_id?: (string | null);
    cost_center_id?: (string | null);
    cost_category_id?: (string | null);
    source_line_id?: (string | null);
    metadata?: Record<string, any>;
};

