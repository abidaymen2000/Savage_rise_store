/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaxCategoryCreate = {
    code: string;
    name: string;
    description?: (string | null);
    default_sale_tax_ids?: Array<string>;
    default_purchase_tax_ids?: Array<string>;
    status?: 'active' | 'inactive';
};

