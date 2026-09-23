/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSReleaseActionRequest } from '../models/CMSReleaseActionRequest';
import type { CMSReleaseCreate } from '../models/CMSReleaseCreate';
import type { CMSReleaseItemCreate } from '../models/CMSReleaseItemCreate';
import type { CMSReleaseOut } from '../models/CMSReleaseOut';
import type { CMSReleaseScheduleRequest } from '../models/CMSReleaseScheduleRequest';
import type { CMSReleaseStatus } from '../models/CMSReleaseStatus';
import type { CMSReleaseUpdate } from '../models/CMSReleaseUpdate';
import type { CMSReleaseValidationOut } from '../models/CMSReleaseValidationOut';
import type { PaginatedCMSReleasesOut } from '../models/PaginatedCMSReleasesOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsReleasesService {
    /**
     * Admin List Cms Releases
     * @returns PaginatedCMSReleasesOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsReleases({
        page = 1,
        pageSize = 20,
        status,
    }: {
        page?: number,
        pageSize?: number,
        status?: (CMSReleaseStatus | null),
    }): CancelablePromise<PaginatedCMSReleasesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/releases',
            query: {
                'page': page,
                'page_size': pageSize,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Create Cms Release
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsRelease({
        requestBody,
    }: {
        requestBody: CMSReleaseCreate,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/releases',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get Cms Release
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsRelease({
        releaseId,
    }: {
        releaseId: string,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/releases/{release_id}',
            path: {
                'release_id': releaseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Cms Release
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsRelease({
        releaseId,
        requestBody,
    }: {
        releaseId: string,
        requestBody: CMSReleaseUpdate,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/releases/{release_id}',
            path: {
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Archive Cms Release
     * @returns void
     * @throws ApiError
     */
    public static adminArchiveCmsRelease({
        releaseId,
        expectedVersion,
    }: {
        releaseId: string,
        expectedVersion: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/releases/{release_id}',
            path: {
                'release_id': releaseId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Add Cms Release Item
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminAddCmsReleaseItem({
        releaseId,
        requestBody,
    }: {
        releaseId: string,
        requestBody: CMSReleaseItemCreate,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/releases/{release_id}/items',
            path: {
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Remove Cms Release Item
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminRemoveCmsReleaseItem({
        releaseId,
        itemId,
    }: {
        releaseId: string,
        itemId: string,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/releases/{release_id}/items/{item_id}',
            path: {
                'release_id': releaseId,
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Validate Cms Release
     * @returns CMSReleaseValidationOut Successful Response
     * @throws ApiError
     */
    public static adminValidateCmsRelease({
        releaseId,
    }: {
        releaseId: string,
    }): CancelablePromise<CMSReleaseValidationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/releases/{release_id}/validate',
            path: {
                'release_id': releaseId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Publish Cms Release
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminPublishCmsRelease({
        releaseId,
        requestBody,
    }: {
        releaseId: string,
        requestBody: CMSReleaseActionRequest,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/releases/{release_id}/publish',
            path: {
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Schedule Cms Release
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminScheduleCmsRelease({
        releaseId,
        requestBody,
    }: {
        releaseId: string,
        requestBody: CMSReleaseScheduleRequest,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/releases/{release_id}/schedule',
            path: {
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Cancel Cms Release Schedule
     * @returns CMSReleaseOut Successful Response
     * @throws ApiError
     */
    public static adminCancelCmsReleaseSchedule({
        releaseId,
        requestBody,
    }: {
        releaseId: string,
        requestBody: CMSReleaseActionRequest,
    }): CancelablePromise<CMSReleaseOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/releases/{release_id}/cancel-schedule',
            path: {
                'release_id': releaseId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
