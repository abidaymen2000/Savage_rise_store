/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BundleSelection } from './BundleSelection';
export type OrderItemCreate_Input = {
    product_id: string;
    variant_id?: (string | null);
    sku?: (string | null);
    qty: number;
    bundle_selection?: (BundleSelection | null);
};

