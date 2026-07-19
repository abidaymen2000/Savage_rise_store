/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCreate } from '../models/AdminCreate';
import type { AdminPasswordReset } from '../models/AdminPasswordReset';
import type { AdminPublic } from '../models/AdminPublic';
import type { AdminUpdate } from '../models/AdminUpdate';
import type { DashboardLayoutResponse } from '../models/DashboardLayoutResponse';
import type { DashboardLayoutSave } from '../models/DashboardLayoutSave';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAdminsService {
    /**
     * Lister les admins
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listAdminsAdminAdminsGet({
        page = 1,
        pageSize = 20,
        q,
        isActive,
    }: {
        page?: number,
        pageSize?: number,
        q?: (string | null),
        isActive?: (boolean | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/admins',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Creer un admin
     * @returns AdminPublic Successful Response
     * @throws ApiError
     */
    public static createAdminAdminAdminsPost({
        requestBody,
    }: {
        requestBody: AdminCreate,
    }): CancelablePromise<AdminPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/admins',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get My Dashboard Layout
     * @returns DashboardLayoutResponse Successful Response
     * @throws ApiError
     */
    public static getMyDashboardLayoutAdminAdminsMeDashboardLayoutGet(): CancelablePromise<DashboardLayoutResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/admins/me/dashboard-layout',
        });
    }
    /**
     * Save My Dashboard Layout
     * @returns any Successful Response
     * @throws ApiError
     */
    public static saveMyDashboardLayoutAdminAdminsMeDashboardLayoutPut({
        requestBody,
    }: {
        requestBody: DashboardLayoutSave,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/admins/me/dashboard-layout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lire un admin
     * @returns AdminPublic Successful Response
     * @throws ApiError
     */
    public static getAdminAdminAdminsAdminIdGet({
        adminId,
    }: {
        adminId: string,
    }): CancelablePromise<AdminPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/admins/{admin_id}',
            path: {
                'admin_id': adminId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Modifier un admin
     * @returns AdminPublic Successful Response
     * @throws ApiError
     */
    public static updateAdminAdminAdminsAdminIdPatch({
        adminId,
        requestBody,
    }: {
        adminId: string,
        requestBody: AdminUpdate,
    }): CancelablePromise<AdminPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/admins/{admin_id}',
            path: {
                'admin_id': adminId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer un admin
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteAdminAdminAdminsAdminIdDelete({
        adminId,
    }: {
        adminId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/admins/{admin_id}',
            path: {
                'admin_id': adminId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reinitialiser le mot de passe admin
     * @returns AdminPublic Successful Response
     * @throws ApiError
     */
    public static resetAdminPasswordAdminAdminsAdminIdPasswordPatch({
        adminId,
        requestBody,
    }: {
        adminId: string,
        requestBody: AdminPasswordReset,
    }): CancelablePromise<AdminPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/admins/{admin_id}/password',
            path: {
                'admin_id': adminId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
