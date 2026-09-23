/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreLocalesOut } from '../models/StoreLocalesOut';
import type { StoreLocalesSettings } from '../models/StoreLocalesSettings';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsLocalesService {
    /**
     * Admin Get Cms Locales
     * @returns StoreLocalesOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsLocales(): CancelablePromise<StoreLocalesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/locales',
        });
    }
    /**
     * Admin Update Cms Locales
     * @returns StoreLocalesOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsLocales({
        requestBody,
    }: {
        requestBody: StoreLocalesSettings,
    }): CancelablePromise<StoreLocalesOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/locales',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
