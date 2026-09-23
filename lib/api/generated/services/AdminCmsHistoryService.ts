/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentVersionOut } from '../models/CMSContentVersionOut';
import type { CMSHistoryResourceType } from '../models/CMSHistoryResourceType';
import type { CMSRestoreRevisionOut } from '../models/CMSRestoreRevisionOut';
import type { CMSRestoreRevisionRequest } from '../models/CMSRestoreRevisionRequest';
import type { PaginatedCMSContentVersionsOut } from '../models/PaginatedCMSContentVersionsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsHistoryService {
    /**
     * Admin List Cms History
     * @returns PaginatedCMSContentVersionsOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsHistory({
        resourceType,
        resourceId,
        page = 1,
        pageSize = 20,
    }: {
        resourceType: CMSHistoryResourceType,
        resourceId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedCMSContentVersionsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/history/{resource_type}/{resource_id}',
            path: {
                'resource_type': resourceType,
                'resource_id': resourceId,
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
     * Admin Get Cms History Revision
     * @returns CMSContentVersionOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsHistoryRevision({
        resourceType,
        resourceId,
        revision,
    }: {
        resourceType: CMSHistoryResourceType,
        resourceId: string,
        revision: number,
    }): CancelablePromise<CMSContentVersionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/history/{resource_type}/{resource_id}/{revision}',
            path: {
                'resource_type': resourceType,
                'resource_id': resourceId,
                'revision': revision,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Restore Cms History Revision
     * @returns CMSRestoreRevisionOut Successful Response
     * @throws ApiError
     */
    public static adminRestoreCmsHistoryRevision({
        resourceType,
        resourceId,
        revision,
        requestBody,
    }: {
        resourceType: CMSHistoryResourceType,
        resourceId: string,
        revision: number,
        requestBody: CMSRestoreRevisionRequest,
    }): CancelablePromise<CMSRestoreRevisionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/history/{resource_type}/{resource_id}/{revision}/restore',
            path: {
                'resource_type': resourceType,
                'resource_id': resourceId,
                'revision': revision,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
