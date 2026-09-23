/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSSEOConfig } from '../models/CMSSEOConfig';
import type { CMSSEOValidationResult } from '../models/CMSSEOValidationResult';
import type { StoreSEOSettingsOut } from '../models/StoreSEOSettingsOut';
import type { StoreSEOSettingsUpdate } from '../models/StoreSEOSettingsUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsSeoService {
    /**
     * Admin Get Cms Seo Settings
     * @returns StoreSEOSettingsOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsSeoSettings(): CancelablePromise<StoreSEOSettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/seo/settings',
        });
    }
    /**
     * Admin Update Cms Seo Settings
     * @returns StoreSEOSettingsOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsSeoSettings({
        requestBody,
    }: {
        requestBody: StoreSEOSettingsUpdate,
    }): CancelablePromise<StoreSEOSettingsOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/seo/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Validate Cms Seo
     * @returns CMSSEOValidationResult Successful Response
     * @throws ApiError
     */
    public static adminValidateCmsSeo({
        requestBody,
    }: {
        requestBody: CMSSEOConfig,
    }): CancelablePromise<CMSSEOValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/seo/validate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
