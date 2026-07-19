/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingCollaborationItemCreate = {
    product_id: string;
    variant_id?: (string | null);
    inventory_item_id?: (string | null);
    sku?: (string | null);
    option_values_snapshot?: (Record<string, any> | null);
    stock_mode?: 'none' | 'gift' | 'loan' | 'mixed';
    quantity: number;
};

