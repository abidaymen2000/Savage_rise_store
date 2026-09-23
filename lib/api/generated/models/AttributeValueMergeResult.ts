/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeOptionRead } from './AttributeOptionRead';
import type { AttributeValueUsageRead } from './AttributeValueUsageRead';
export type AttributeValueMergeResult = {
    source: AttributeOptionRead;
    target: AttributeOptionRead;
    usage: AttributeValueUsageRead;
    affected_products: number;
    affected_variants: number;
};

