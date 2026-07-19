/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ShippingRateCreate = {
    name: string;
    country: string;
    city?: (string | null);
    price: number;
    free_shipping_threshold?: (number | null);
    is_active?: boolean;
};

