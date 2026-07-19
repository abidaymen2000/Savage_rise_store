/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryRead } from '../models/CategoryRead';
import type { CategoryTreeNode } from '../models/CategoryTreeNode';
import type { PaginatedResponse_ProductListItem_ } from '../models/PaginatedResponse_ProductListItem_';
import type { ProductStorefrontDetail } from '../models/ProductStorefrontDetail';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CatalogService {
    /**
     * List Products
     * @returns PaginatedResponse_ProductListItem_ Successful Response
     * @throws ApiError
     */
    public static listProductsCatalogProductsGet({
        page = 1,
        pageSize = 20,
        q,
        productKind,
        categoryId,
    }: {
        page?: number,
        pageSize?: number,
        q?: (string | null),
        productKind?: (string | null),
        categoryId?: (string | null),
    }): CancelablePromise<PaginatedResponse_ProductListItem_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/products',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'product_kind': productKind,
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Product
     * @returns ProductStorefrontDetail Successful Response
     * @throws ApiError
     */
    public static getProductCatalogProductsSlugGet({
        slug,
    }: {
        slug: string,
    }): CancelablePromise<ProductStorefrontDetail> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/products/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Categories
     * @returns CategoryRead Successful Response
     * @throws ApiError
     */
    public static listCategoriesCatalogCategoriesGet(): CancelablePromise<Array<CategoryRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/categories',
        });
    }
    /**
     * Category Tree
     * @returns CategoryTreeNode Successful Response
     * @throws ApiError
     */
    public static categoryTreeCatalogCategoriesTreeGet(): CancelablePromise<Array<CategoryTreeNode>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/categories/tree',
        });
    }
    /**
     * Products By Category
     * @returns PaginatedResponse_ProductListItem_ Successful Response
     * @throws ApiError
     */
    public static productsByCategoryCatalogCategoriesSlugProductsGet({
        slug,
        page = 1,
        pageSize = 20,
    }: {
        slug: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ProductListItem_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/catalog/categories/{slug}/products',
            path: {
                'slug': slug,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
