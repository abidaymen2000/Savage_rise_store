/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaxCategoryUpdate = {
    code?: (string | null);
    name?: (string | null);
    description?: (string | null);
    default_sale_tax_ids?: (Array<string> | null);
    default_purchase_tax_ids?: (Array<string> | null);
    status?: ('active' | 'inactive' | null);
    is_archived?: (boolean | null);
    expected_version?: (number | null);
};

