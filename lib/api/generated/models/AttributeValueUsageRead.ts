/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeValueUsageSample } from './AttributeValueUsageSample';
export type AttributeValueUsageRead = {
    attribute_id: string;
    attribute_code: string;
    value_id: string;
    code: string;
    label: string;
    status: string;
    products_count: number;
    variants_count: number;
    active_variants_count?: number;
    archived_variants_count?: number;
    product_samples?: Array<AttributeValueUsageSample>;
    merge_conflicts_count?: number;
    merge_conflict_samples?: Array<AttributeValueUsageSample>;
};

