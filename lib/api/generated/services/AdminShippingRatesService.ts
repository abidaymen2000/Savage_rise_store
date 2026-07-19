/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_ShippingRateOut_ } from '../models/PaginatedResponse_ShippingRateOut_';
import type { ShippingRateCreate } from '../models/ShippingRateCreate';
import type { ShippingRateOut } from '../models/ShippingRateOut';
import type { ShippingRateUpdate } from '../models/ShippingRateUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminShippingRatesService {
    /**
     * Admin Create Shipping Rate
     * @returns ShippingRateOut Successful Response
     * @throws ApiError
     */
    public static adminCreateShippingRateAdminShippingRatesPost({
        requestBody,
    }: {
        requestBody: ShippingRateCreate,
    }): CancelablePromise<ShippingRateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/shipping-rates/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Shipping Rates
     * @returns ShippingRateOut Successful Response
     * @throws ApiError
     */
    public static adminListShippingRatesAdminShippingRatesGet({
        skip,
        limit = 100,
        isActive,
    }: {
        skip?: number,
        limit?: number,
        isActive?: (boolean | null),
    }): CancelablePromise<Array<ShippingRateOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/shipping-rates/',
            query: {
                'skip': skip,
                'limit': limit,
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Shipping Rates Page
     * @returns PaginatedResponse_ShippingRateOut_ Successful Response
     * @throws ApiError
     */
    public static adminListShippingRatesPageAdminShippingRatesPageGet({
        isActive,
        page = 1,
        pageSize = 20,
    }: {
        isActive?: (boolean | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ShippingRateOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/shipping-rates/page',
            query: {
                'is_active': isActive,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get Shipping Rate
     * @returns ShippingRateOut Successful Response
     * @throws ApiError
     */
    public static adminGetShippingRateAdminShippingRatesRateIdGet({
        rateId,
    }: {
        rateId: string,
    }): CancelablePromise<ShippingRateOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/shipping-rates/{rate_id}',
            path: {
                'rate_id': rateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Shipping Rate
     * @returns ShippingRateOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateShippingRateAdminShippingRatesRateIdPatch({
        rateId,
        requestBody,
    }: {
        rateId: string,
        requestBody: ShippingRateUpdate,
    }): CancelablePromise<ShippingRateOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/shipping-rates/{rate_id}',
            path: {
                'rate_id': rateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Delete Shipping Rate
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteShippingRateAdminShippingRatesRateIdDelete({
        rateId,
    }: {
        rateId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/shipping-rates/{rate_id}',
            path: {
                'rate_id': rateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
