/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosComponent } from './PosComponent';
export type PosLine = {
    product_id: string;
    variant_id: string;
    quantity: number;
    discount_percent?: (number | string);
    components?: Array<PosComponent>;
};

