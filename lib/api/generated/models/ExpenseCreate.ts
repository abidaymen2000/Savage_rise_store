/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExpenseCreate = {
    reference?: (string | null);
    label: string;
    description?: (string | null);
    category_id?: (string | null);
    amount: (number | string);
    tax_amount?: (number | string);
    tax_definition_ids?: Array<string>;
    tax_category_id?: (string | null);
    tax_profile_id?: (string | null);
    tax_exemption_reason?: (string | null);
    currency?: (string | null);
    exchange_rate?: (number | string);
    occurred_at?: (string | null);
    supplier_id?: (string | null);
    cost_center_id?: (string | null);
    notes?: (string | null);
    attachments?: Array<Record<string, any>>;
};

