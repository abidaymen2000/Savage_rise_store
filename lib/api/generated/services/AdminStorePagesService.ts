/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedStorePagesOut } from '../models/PaginatedStorePagesOut';
import type { StorePageAdminOut } from '../models/StorePageAdminOut';
import type { StorePageCreate } from '../models/StorePageCreate';
import type { StorePagePublishRequest } from '../models/StorePagePublishRequest';
import type { StorePageStatus } from '../models/StorePageStatus';
import type { StorePageType } from '../models/StorePageType';
import type { StorePageUpdate } from '../models/StorePageUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminStorePagesService {
    /**
     * Admin List Store Pages
     * @returns PaginatedStorePagesOut Successful Response
     * @throws ApiError
     */
    public static adminListStorePages({
        page = 1,
        pageSize = 20,
        q,
        status,
        pageType,
        sortBy = 'updated_at',
        sortDir = 'desc',
    }: {
        page?: number,
        pageSize?: number,
        q?: (string | null),
        status?: (StorePageStatus | null),
        pageType?: (StorePageType | null),
        sortBy?: string,
        sortDir?: string,
    }): CancelablePromise<PaginatedStorePagesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/store-pages',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'status': status,
                'page_type': pageType,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Store Page
     * @returns StorePageAdminOut Successful Response
     * @throws ApiError
     */
    public static adminCreateStorePage({
        requestBody,
    }: {
        requestBody: StorePageCreate,
    }): CancelablePromise<StorePageAdminOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/store-pages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Store Page
     * @returns StorePageAdminOut Successful Response
     * @throws ApiError
     */
    public static adminGetStorePage({
        pageId,
    }: {
        pageId: string,
    }): CancelablePromise<StorePageAdminOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/store-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Store Page
     * @returns StorePageAdminOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateStorePage({
        pageId,
        requestBody,
    }: {
        pageId: string,
        requestBody: StorePageUpdate,
    }): CancelablePromise<StorePageAdminOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/store-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Archive Store Page
     * @returns void
     * @throws ApiError
     */
    public static adminArchiveStorePage({
        pageId,
        expectedVersion,
    }: {
        pageId: string,
        expectedVersion: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/store-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Publish Store Page
     * @returns StorePageAdminOut Successful Response
     * @throws ApiError
     */
    public static adminPublishStorePage({
        pageId,
        requestBody,
    }: {
        pageId: string,
        requestBody: StorePagePublishRequest,
    }): CancelablePromise<StorePageAdminOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/store-pages/{page_id}/publish',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Unpublish Store Page
     * @returns StorePageAdminOut Successful Response
     * @throws ApiError
     */
    public static adminUnpublishStorePage({
        pageId,
        requestBody,
    }: {
        pageId: string,
        requestBody: StorePagePublishRequest,
    }): CancelablePromise<StorePageAdminOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/store-pages/{page_id}/unpublish',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `Store page not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
}
