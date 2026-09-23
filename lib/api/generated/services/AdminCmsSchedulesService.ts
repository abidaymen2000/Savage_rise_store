/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSScheduledActionCreate } from '../models/CMSScheduledActionCreate';
import type { CMSScheduledActionOut } from '../models/CMSScheduledActionOut';
import type { CMSScheduledActionStatus } from '../models/CMSScheduledActionStatus';
import type { CMSScheduledResourceType } from '../models/CMSScheduledResourceType';
import type { PaginatedCMSScheduledActionsOut } from '../models/PaginatedCMSScheduledActionsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsSchedulesService {
    /**
     * Admin Create Cms Schedule
     * @returns CMSScheduledActionOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsSchedule({
        requestBody,
    }: {
        requestBody: CMSScheduledActionCreate,
    }): CancelablePromise<CMSScheduledActionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/schedules',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Cms Schedules
     * @returns PaginatedCMSScheduledActionsOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsSchedules({
        page = 1,
        pageSize = 20,
        resourceType,
        resourceId,
        status,
        dateFrom,
        dateTo,
    }: {
        page?: number,
        pageSize?: number,
        resourceType?: (CMSScheduledResourceType | null),
        resourceId?: (string | null),
        status?: (CMSScheduledActionStatus | null),
        dateFrom?: (string | null),
        dateTo?: (string | null),
    }): CancelablePromise<PaginatedCMSScheduledActionsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/schedules',
            query: {
                'page': page,
                'page_size': pageSize,
                'resource_type': resourceType,
                'resource_id': resourceId,
                'status': status,
                'date_from': dateFrom,
                'date_to': dateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get Cms Schedule
     * @returns CMSScheduledActionOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsSchedule({
        scheduleId,
    }: {
        scheduleId: string,
    }): CancelablePromise<CMSScheduledActionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Cancel Cms Schedule
     * @returns CMSScheduledActionOut Successful Response
     * @throws ApiError
     */
    public static adminCancelCmsSchedule({
        scheduleId,
    }: {
        scheduleId: string,
    }): CancelablePromise<CMSScheduledActionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/schedules/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
