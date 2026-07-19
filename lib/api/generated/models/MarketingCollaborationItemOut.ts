/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MarketingCollaborationItemOut = {
    product_id: string;
    variant_id?: (string | null);
    inventory_item_id?: (string | null);
    sku?: (string | null);
    option_values_snapshot?: (Record<string, any> | null);
    stock_mode?: 'none' | 'gift' | 'loan' | 'mixed';
    quantity: number;
    line_id: string;
    product_name_snapshot?: (string | null);
    sku_snapshot?: (string | null);
    unit_retail_price_snapshot?: (number | null);
    unit_cost_snapshot?: (number | null);
    retail_value_snapshot?: (number | null);
    cost_value_snapshot?: (number | null);
    quantity_reserved?: number;
    quantity_prepared?: number;
    quantity_dispatched?: number;
    quantity_returned?: number;
    quantity_damaged?: number;
    quantity_lost?: number;
};

