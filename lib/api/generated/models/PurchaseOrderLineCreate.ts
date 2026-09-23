/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PurchaseOrderLineCreate = {
    product_id: string;
    variant_id?: (string | null);
    quantity_ordered: (number | string);
    unit_purchase_price: (number | string);
    tax_rate?: (number | string | null);
    tax_definition_ids?: Array<string>;
    tax_category_id?: (string | null);
    tax_profile_id?: (string | null);
    tax_exemption_reason?: (string | null);
    expected_date?: (string | null);
    metadata?: Record<string, any>;
};

