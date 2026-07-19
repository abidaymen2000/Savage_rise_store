/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_ProductCostSnapshotOut_ } from '../models/PaginatedResponse_ProductCostSnapshotOut_';
import type { ProductCostSnapshotCreate } from '../models/ProductCostSnapshotCreate';
import type { ProductCostSnapshotOut } from '../models/ProductCostSnapshotOut';
import type { ProductCostSnapshotUpdate } from '../models/ProductCostSnapshotUpdate';
import type { ProductCostSummaryOut } from '../models/ProductCostSummaryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminProductCostsService {
    /**
     * Api Create Product Cost Snapshot
     * @returns ProductCostSnapshotOut Successful Response
     * @throws ApiError
     */
    public static apiCreateProductCostSnapshotAdminProductCostsPost({
        requestBody,
    }: {
        requestBody: ProductCostSnapshotCreate,
    }): CancelablePromise<ProductCostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/product-costs',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Current Product Cost
     * @returns ProductCostSnapshotOut Successful Response
     * @throws ApiError
     */
    public static apiCurrentProductCostAdminProductCostsCurrentGet({
        productId,
        variantId,
        sku,
        costType = 'computed_cost',
        atDate,
    }: {
        productId: string,
        variantId?: (string | null),
        sku?: (string | null),
        costType?: string,
        atDate?: (string | null),
    }): CancelablePromise<ProductCostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/product-costs/current',
            query: {
                'product_id': productId,
                'variant_id': variantId,
                'sku': sku,
                'cost_type': costType,
                'at_date': atDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Product Cost Summary
     * @returns ProductCostSummaryOut Successful Response
     * @throws ApiError
     */
    public static apiProductCostSummaryAdminProductCostsSummaryGet(): CancelablePromise<ProductCostSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/product-costs/summary',
        });
    }
    /**
     * Api Product Costs By Product
     * @returns PaginatedResponse_ProductCostSnapshotOut_ Successful Response
     * @throws ApiError
     */
    public static apiProductCostsByProductAdminProductCostsByProductProductIdGet({
        productId,
        page = 1,
        pageSize = 20,
    }: {
        productId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ProductCostSnapshotOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/product-costs/by-product/{product_id}',
            path: {
                'product_id': productId,
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
    /**
     * Api Get Product Cost Snapshot
     * @returns ProductCostSnapshotOut Successful Response
     * @throws ApiError
     */
    public static apiGetProductCostSnapshotAdminProductCostsSnapshotIdGet({
        snapshotId,
    }: {
        snapshotId: string,
    }): CancelablePromise<ProductCostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/product-costs/{snapshot_id}',
            path: {
                'snapshot_id': snapshotId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Product Cost Snapshot
     * @returns ProductCostSnapshotOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateProductCostSnapshotAdminProductCostsSnapshotIdPatch({
        snapshotId,
        requestBody,
    }: {
        snapshotId: string,
        requestBody: ProductCostSnapshotUpdate,
    }): CancelablePromise<ProductCostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/product-costs/{snapshot_id}',
            path: {
                'snapshot_id': snapshotId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Product Cost Snapshot
     * @returns ProductCostSnapshotOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveProductCostSnapshotAdminProductCostsSnapshotIdDelete({
        snapshotId,
    }: {
        snapshotId: string,
    }): CancelablePromise<ProductCostSnapshotOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/product-costs/{snapshot_id}',
            path: {
                'snapshot_id': snapshotId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
