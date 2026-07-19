/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationCreate } from '../models/NotificationCreate';
import type { NotificationOut } from '../models/NotificationOut';
import type { NotificationUnreadCount } from '../models/NotificationUnreadCount';
import type { PaginatedResponse_NotificationOut_ } from '../models/PaginatedResponse_NotificationOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminNotificationsService {
    /**
     * Admin List Notifications
     * @returns PaginatedResponse_NotificationOut_ Successful Response
     * @throws ApiError
     */
    public static adminListNotificationsAdminNotificationsGet({
        status = 'all',
        category,
        priority,
        page = 1,
        pageSize = 20,
    }: {
        status?: 'unread' | 'read' | 'all',
        category?: (string | null),
        priority?: ('low' | 'normal' | 'high' | 'urgent' | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_NotificationOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/notifications',
            query: {
                'status': status,
                'category': category,
                'priority': priority,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Create Notification
     * @returns NotificationOut Successful Response
     * @throws ApiError
     */
    public static adminCreateNotificationAdminNotificationsPost({
        requestBody,
    }: {
        requestBody: NotificationCreate,
    }): CancelablePromise<NotificationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/notifications',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Unread Notifications Count
     * @returns NotificationUnreadCount Successful Response
     * @throws ApiError
     */
    public static adminUnreadNotificationsCountAdminNotificationsUnreadCountGet(): CancelablePromise<NotificationUnreadCount> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/notifications/unread-count',
        });
    }
    /**
     * Admin Mark Notification Read
     * @returns NotificationOut Successful Response
     * @throws ApiError
     */
    public static adminMarkNotificationReadAdminNotificationsNotificationIdReadPatch({
        notificationId,
    }: {
        notificationId: string,
    }): CancelablePromise<NotificationOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/notifications/{notification_id}/read',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Mark All Notifications Read
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adminMarkAllNotificationsReadAdminNotificationsReadAllPatch(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/notifications/read-all',
        });
    }
}
