/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductKind } from './ProductKind';
import type { ProductStatus } from './ProductStatus';
export type ProductListItem = {
    id: string;
    name: string;
    slug: string;
    product_kind: ProductKind;
    status: ProductStatus;
    primary_category_id?: (string | null);
    default_currency: string;
    published_at?: (string | null);
    version: number;
};

