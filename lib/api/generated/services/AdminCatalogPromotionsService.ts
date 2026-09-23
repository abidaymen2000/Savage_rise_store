/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_PromotionRead_ } from '../models/PaginatedResponse_PromotionRead_';
import type { PaginatedResponse_PromotionTargetCategory_ } from '../models/PaginatedResponse_PromotionTargetCategory_';
import type { PaginatedResponse_PromotionTargetProduct_ } from '../models/PaginatedResponse_PromotionTargetProduct_';
import type { PaginatedResponse_PromotionTargetVariant_ } from '../models/PaginatedResponse_PromotionTargetVariant_';
import type { PromotionCreate } from '../models/PromotionCreate';
import type { PromotionPreview } from '../models/PromotionPreview';
import type { PromotionRead } from '../models/PromotionRead';
import type { PromotionTargetResolveRequest } from '../models/PromotionTargetResolveRequest';
import type { PromotionTargetResolveResponse } from '../models/PromotionTargetResolveResponse';
import type { PromotionUpdate } from '../models/PromotionUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCatalogPromotionsService {
    /**
     * List Promotions
     * @returns PaginatedResponse_PromotionRead_ Successful Response
     * @throws ApiError
     */
    public static listPromotionsAdminCatalogPromotionsGet({
        page = 1,
        pageSize = 20,
        status,
        scopeType,
        search,
    }: {
        page?: number,
        pageSize?: number,
        status?: (string | null),
        scopeType?: (string | null),
        search?: (string | null),
    }): CancelablePromise<PaginatedResponse_PromotionRead_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions',
            query: {
                'page': page,
                'page_size': pageSize,
                'status': status,
                'scope_type': scopeType,
                'search': search,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Promotion
     * @returns PromotionRead Successful Response
     * @throws ApiError
     */
    public static createPromotionAdminCatalogPromotionsPost({
        requestBody,
    }: {
        requestBody: PromotionCreate,
    }): CancelablePromise<PromotionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/promotions',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Promotion Product Targets
     * @returns PaginatedResponse_PromotionTargetProduct_ Successful Response
     * @throws ApiError
     */
    public static adminCatalogSearchPromotionProductTargets({
        q,
        page = 1,
        pageSize = 20,
    }: {
        /**
         * Case-insensitive product name prefix.
         */
        q?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PromotionTargetProduct_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions/targets/products',
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Promotion Product Variant Targets
     * @returns PaginatedResponse_PromotionTargetVariant_ Successful Response
     * @throws ApiError
     */
    public static adminCatalogListPromotionProductVariantTargets({
        productId,
        q,
        page = 1,
        pageSize = 30,
    }: {
        productId: string,
        /**
         * Case-insensitive variant title/SKU/reference prefix.
         */
        q?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PromotionTargetVariant_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions/targets/products/{product_id}/variants',
            path: {
                'product_id': productId,
            },
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Promotion Category Targets
     * @returns PaginatedResponse_PromotionTargetCategory_ Successful Response
     * @throws ApiError
     */
    public static adminCatalogSearchPromotionCategoryTargets({
        q,
        page = 1,
        pageSize = 20,
    }: {
        /**
         * Case-insensitive category name prefix.
         */
        q?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PromotionTargetCategory_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions/targets/categories',
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Promotion Variant Targets
     * @returns PaginatedResponse_PromotionTargetVariant_ Successful Response
     * @throws ApiError
     */
    public static adminCatalogSearchPromotionVariantTargets({
        q,
        page = 1,
        pageSize = 20,
    }: {
        /**
         * Case-insensitive variant title prefix.
         */
        q?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PromotionTargetVariant_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions/targets/variants',
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Resolve Promotion Targets
     * @returns PromotionTargetResolveResponse Successful Response
     * @throws ApiError
     */
    public static adminCatalogResolvePromotionTargets({
        requestBody,
    }: {
        requestBody: PromotionTargetResolveRequest,
    }): CancelablePromise<PromotionTargetResolveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/promotions/targets/resolve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Promotion
     * @returns PromotionRead Successful Response
     * @throws ApiError
     */
    public static getPromotionAdminCatalogPromotionsPromotionIdGet({
        promotionId,
    }: {
        promotionId: string,
    }): CancelablePromise<PromotionRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions/{promotion_id}',
            path: {
                'promotion_id': promotionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Promotion
     * @returns PromotionRead Successful Response
     * @throws ApiError
     */
    public static updatePromotionAdminCatalogPromotionsPromotionIdPatch({
        promotionId,
        requestBody,
    }: {
        promotionId: string,
        requestBody: PromotionUpdate,
    }): CancelablePromise<PromotionRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/promotions/{promotion_id}',
            path: {
                'promotion_id': promotionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Promotion
     * @returns void
     * @throws ApiError
     */
    public static deletePromotionAdminCatalogPromotionsPromotionIdDelete({
        promotionId,
    }: {
        promotionId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/catalog/promotions/{promotion_id}',
            path: {
                'promotion_id': promotionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview Promotion
     * @returns PromotionPreview Successful Response
     * @throws ApiError
     */
    public static previewPromotionAdminCatalogPromotionsPromotionIdPreviewGet({
        promotionId,
        limit = 20,
    }: {
        promotionId: string,
        limit?: number,
    }): CancelablePromise<PromotionPreview> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/promotions/{promotion_id}/preview',
            path: {
                'promotion_id': promotionId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
