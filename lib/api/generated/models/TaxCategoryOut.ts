/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaxCategoryOut = {
    id: string;
    code: string;
    name: string;
    description?: (string | null);
    default_sale_tax_ids?: Array<string>;
    default_purchase_tax_ids?: Array<string>;
    status?: 'active' | 'inactive';
    is_archived?: boolean;
    created_by?: (string | null);
    updated_by?: (string | null);
    created_at: string;
    updated_at: string;
    version?: number;
};

