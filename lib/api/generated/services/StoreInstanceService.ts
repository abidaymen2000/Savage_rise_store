/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicStoreConfig } from '../models/PublicStoreConfig';
import type { StoreInstanceOut } from '../models/StoreInstanceOut';
import type { StoreInstanceUpdate } from '../models/StoreInstanceUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StoreInstanceService {
    /**
     * Storefront Config
     * @returns PublicStoreConfig Successful Response
     * @throws ApiError
     */
    public static storefrontConfigStorefrontConfigGet(): CancelablePromise<PublicStoreConfig> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/config',
        });
    }
    /**
     * Admin Get Instance
     * @returns StoreInstanceOut Successful Response
     * @throws ApiError
     */
    public static adminGetInstanceAdminInstanceGet(): CancelablePromise<StoreInstanceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/instance',
        });
    }
    /**
     * Admin Update Instance
     * @returns StoreInstanceOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateInstanceAdminInstancePatch({
        requestBody,
    }: {
        requestBody: StoreInstanceUpdate,
    }): CancelablePromise<StoreInstanceOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/instance',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
