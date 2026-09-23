/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSRedirectCreate } from '../models/CMSRedirectCreate';
import type { CMSRedirectOut } from '../models/CMSRedirectOut';
import type { CMSRedirectUpdate } from '../models/CMSRedirectUpdate';
import type { CMSRedirectValidationOut } from '../models/CMSRedirectValidationOut';
import type { CMSRedirectValidationRequest } from '../models/CMSRedirectValidationRequest';
import type { PaginatedCMSRedirectsOut } from '../models/PaginatedCMSRedirectsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsRedirectsService {
    /**
     * Admin List Cms Redirects
     * @returns PaginatedCMSRedirectsOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsRedirects({
        page = 1,
        pageSize = 20,
        q,
        active,
        statusCode,
    }: {
        page?: number,
        pageSize?: number,
        q?: (string | null),
        active?: (boolean | null),
        statusCode?: (number | null),
    }): CancelablePromise<PaginatedCMSRedirectsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/redirects',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'active': active,
                'status_code': statusCode,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Create Cms Redirect
     * @returns CMSRedirectOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsRedirect({
        requestBody,
    }: {
        requestBody: CMSRedirectCreate,
    }): CancelablePromise<CMSRedirectOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/redirects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Validate Cms Redirect
     * @returns CMSRedirectValidationOut Successful Response
     * @throws ApiError
     */
    public static adminValidateCmsRedirect({
        requestBody,
    }: {
        requestBody: CMSRedirectValidationRequest,
    }): CancelablePromise<CMSRedirectValidationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/redirects/validate',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get Cms Redirect
     * @returns CMSRedirectOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsRedirect({
        redirectId,
    }: {
        redirectId: string,
    }): CancelablePromise<CMSRedirectOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/redirects/{redirect_id}',
            path: {
                'redirect_id': redirectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Cms Redirect
     * @returns CMSRedirectOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsRedirect({
        redirectId,
        requestBody,
    }: {
        redirectId: string,
        requestBody: CMSRedirectUpdate,
    }): CancelablePromise<CMSRedirectOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/redirects/{redirect_id}',
            path: {
                'redirect_id': redirectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Delete Cms Redirect
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteCmsRedirect({
        redirectId,
        expectedVersion,
    }: {
        redirectId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/redirects/{redirect_id}',
            path: {
                'redirect_id': redirectId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
