/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoyaltyAdjustmentIn } from '../models/LoyaltyAdjustmentIn';
import type { LoyaltyBalanceOut } from '../models/LoyaltyBalanceOut';
import type { LoyaltySettingsOut } from '../models/LoyaltySettingsOut';
import type { LoyaltySettingsUpdate } from '../models/LoyaltySettingsUpdate';
import type { PaginatedLoyaltyTransactionsOut } from '../models/PaginatedLoyaltyTransactionsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminLoyaltyService {
    /**
     * Admin Get Loyalty Settings
     * @returns LoyaltySettingsOut Successful Response
     * @throws ApiError
     */
    public static adminGetLoyaltySettingsAdminLoyaltySettingsGet(): CancelablePromise<LoyaltySettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/loyalty/settings',
        });
    }
    /**
     * Admin Update Loyalty Settings
     * @returns LoyaltySettingsOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateLoyaltySettingsAdminLoyaltySettingsPut({
        requestBody,
    }: {
        requestBody: LoyaltySettingsUpdate,
    }): CancelablePromise<LoyaltySettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/loyalty/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get User Loyalty
     * @returns LoyaltyBalanceOut Successful Response
     * @throws ApiError
     */
    public static adminGetUserLoyaltyAdminLoyaltyUsersUserIdGet({
        userId,
        limit = 20,
    }: {
        userId: string,
        limit?: number,
    }): CancelablePromise<LoyaltyBalanceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/loyalty/users/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Adjust User Loyalty
     * @returns LoyaltyBalanceOut Successful Response
     * @throws ApiError
     */
    public static adminAdjustUserLoyaltyAdminLoyaltyUsersUserIdAdjustPost({
        userId,
        requestBody,
    }: {
        userId: string,
        requestBody: LoyaltyAdjustmentIn,
    }): CancelablePromise<LoyaltyBalanceOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/loyalty/users/{user_id}/adjust',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Loyalty Transactions
     * @returns PaginatedLoyaltyTransactionsOut Successful Response
     * @throws ApiError
     */
    public static adminListLoyaltyTransactionsAdminLoyaltyTransactionsGet({
        page = 1,
        pageSize = 20,
        userId,
        orderId,
    }: {
        page?: number,
        pageSize?: number,
        userId?: (string | null),
        orderId?: (string | null),
    }): CancelablePromise<PaginatedLoyaltyTransactionsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/loyalty/transactions',
            query: {
                'page': page,
                'page_size': pageSize,
                'user_id': userId,
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
