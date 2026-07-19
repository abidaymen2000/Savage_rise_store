/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryAdjustmentIn } from '../models/InventoryAdjustmentIn';
import type { InventoryMovementOut } from '../models/InventoryMovementOut';
import type { PaginatedResponse_InventoryItemOut_ } from '../models/PaginatedResponse_InventoryItemOut_';
import type { PaginatedResponse_InventoryMovementOut_ } from '../models/PaginatedResponse_InventoryMovementOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminInventoryService {
    /**
     * Admin List Inventory
     * @returns PaginatedResponse_InventoryItemOut_ Successful Response
     * @throws ApiError
     */
    public static adminListInventoryAdminInventoryGet({
        q,
        lowStock,
        threshold = 5,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        lowStock?: (boolean | null),
        threshold?: number,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_InventoryItemOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/inventory',
            query: {
                'q': q,
                'low_stock': lowStock,
                'threshold': threshold,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Adjust Inventory
     * @returns InventoryMovementOut Successful Response
     * @throws ApiError
     */
    public static adminAdjustInventoryAdminInventoryAdjustPost({
        requestBody,
    }: {
        requestBody: InventoryAdjustmentIn,
    }): CancelablePromise<InventoryMovementOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/inventory/adjust',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Inventory Movements
     * @returns PaginatedResponse_InventoryMovementOut_ Successful Response
     * @throws ApiError
     */
    public static adminListInventoryMovementsAdminInventoryMovementsGet({
        productId,
        source,
        page = 1,
        pageSize = 20,
    }: {
        productId?: (string | null),
        source?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_InventoryMovementOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/inventory/movements',
            query: {
                'product_id': productId,
                'source': source,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
