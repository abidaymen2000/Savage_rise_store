/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardPerformanceResponse } from '../models/DashboardPerformanceResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminDashboardService {
    /**
     * Admin Dashboard Summary
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adminDashboardSummaryAdminDashboardGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/dashboard',
        });
    }
    /**
     * Admin Dashboard Performance
     * @returns DashboardPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static adminDashboardPerformanceAdminDashboardPerformanceGet({
        dateFrom,
        dateTo,
        interval = 'day',
    }: {
        /**
         * ISO date/time (inclusive); naive values use finance timezone
         */
        dateFrom?: (string | null),
        /**
         * ISO date/time (inclusive); naive values use finance timezone
         */
        dateTo?: (string | null),
        interval?: 'day' | 'week' | 'month',
    }): CancelablePromise<DashboardPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/dashboard/performance',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'interval': interval,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
