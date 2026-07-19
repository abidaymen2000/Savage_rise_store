/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_AuditLogOut_ } from '../models/PaginatedResponse_AuditLogOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAuditService {
    /**
     * Admin List Audit Logs
     * @returns PaginatedResponse_AuditLogOut_ Successful Response
     * @throws ApiError
     */
    public static adminListAuditLogsAdminAuditLogsGet({
        module,
        action,
        adminId,
        entityType,
        entityId,
        page = 1,
        pageSize = 20,
    }: {
        module?: (string | null),
        action?: (string | null),
        adminId?: (string | null),
        entityType?: (string | null),
        entityId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_AuditLogOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/audit-logs',
            query: {
                'module': module,
                'action': action,
                'admin_id': adminId,
                'entity_type': entityType,
                'entity_id': entityId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
