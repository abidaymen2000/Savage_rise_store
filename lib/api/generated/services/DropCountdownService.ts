/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DropCountdownOut } from '../models/DropCountdownOut';
import type { DropCountdownUpdate } from '../models/DropCountdownUpdate';
import type { DropNotificationStatus } from '../models/DropNotificationStatus';
import type { DropSubscribersPage } from '../models/DropSubscribersPage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DropCountdownService {
    /**
     * Read Storefront Drop Countdown
     * @returns DropCountdownOut Successful Response
     * @throws ApiError
     */
    public static readStorefrontDropCountdownStorefrontDropCountdownGet(): CancelablePromise<DropCountdownOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/drop-countdown',
        });
    }
    /**
     * Read Drop Notification Status
     * @returns DropNotificationStatus Successful Response
     * @throws ApiError
     */
    public static readDropNotificationStatusStorefrontDropCountdownNotificationStatusGet(): CancelablePromise<DropNotificationStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/drop-countdown/notification-status',
        });
    }
    /**
     * Subscribe Drop Notification
     * @returns DropNotificationStatus Successful Response
     * @throws ApiError
     */
    public static subscribeDropNotificationStorefrontDropCountdownNotifyMePost(): CancelablePromise<DropNotificationStatus> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/drop-countdown/notify-me',
        });
    }
    /**
     * Unsubscribe Drop Notification
     * @returns DropNotificationStatus Successful Response
     * @throws ApiError
     */
    public static unsubscribeDropNotificationStorefrontDropCountdownNotifyMeDelete(): CancelablePromise<DropNotificationStatus> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/storefront/drop-countdown/notify-me',
        });
    }
    /**
     * Admin Get Drop Countdown
     * @returns DropCountdownOut Successful Response
     * @throws ApiError
     */
    public static adminGetDropCountdownAdminDropCountdownGet(): CancelablePromise<DropCountdownOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/drop-countdown',
        });
    }
    /**
     * Admin Update Drop Countdown
     * @returns DropCountdownOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateDropCountdownAdminDropCountdownPut({
        requestBody,
    }: {
        requestBody: DropCountdownUpdate,
    }): CancelablePromise<DropCountdownOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/drop-countdown',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Drop Subscribers
     * @returns DropSubscribersPage Successful Response
     * @throws ApiError
     */
    public static adminListDropSubscribersAdminDropCountdownSubscribersGet({
        page = 1,
        pageSize = 20,
        q,
        currentDropOnly = true,
    }: {
        page?: number,
        pageSize?: number,
        /**
         * Recherche email ou nom
         */
        q?: (string | null),
        currentDropOnly?: boolean,
    }): CancelablePromise<DropSubscribersPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/drop-countdown/subscribers',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'current_drop_only': currentDropOnly,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
