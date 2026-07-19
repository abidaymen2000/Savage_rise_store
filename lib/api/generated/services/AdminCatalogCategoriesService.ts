/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryCreate } from '../models/CategoryCreate';
import type { CategoryMoveRequest } from '../models/CategoryMoveRequest';
import type { CategoryRead } from '../models/CategoryRead';
import type { CategoryTreeNode } from '../models/CategoryTreeNode';
import type { CategoryUpdate } from '../models/CategoryUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCatalogCategoriesService {
    /**
     * List Categories
     * @returns CategoryRead Successful Response
     * @throws ApiError
     */
    public static listCategoriesAdminCatalogCategoriesGet(): CancelablePromise<Array<CategoryRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/categories',
        });
    }
    /**
     * Create Category
     * @returns CategoryRead Successful Response
     * @throws ApiError
     */
    public static createCategoryAdminCatalogCategoriesPost({
        requestBody,
    }: {
        requestBody: CategoryCreate,
    }): CancelablePromise<CategoryRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Category Tree
     * @returns CategoryTreeNode Successful Response
     * @throws ApiError
     */
    public static categoryTreeAdminCatalogCategoriesTreeGet(): CancelablePromise<Array<CategoryTreeNode>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/categories/tree',
        });
    }
    /**
     * Get Category
     * @returns CategoryRead Successful Response
     * @throws ApiError
     */
    public static getCategoryAdminCatalogCategoriesCategoryIdGet({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<CategoryRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Category
     * @returns CategoryRead Successful Response
     * @throws ApiError
     */
    public static updateCategoryAdminCatalogCategoriesCategoryIdPatch({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: CategoryUpdate,
    }): CancelablePromise<CategoryRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Category
     * @returns CategoryRead Successful Response
     * @throws ApiError
     */
    public static moveCategoryAdminCatalogCategoriesCategoryIdMovePost({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: CategoryMoveRequest,
    }): CancelablePromise<CategoryRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/categories/{category_id}/move',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
