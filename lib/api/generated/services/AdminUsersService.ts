/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUsersService {
    /**
     * Lister les utilisateurs (admin)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static adminListUsersAdminUsersGet({
        page = 1,
        pageSize = 20,
        q,
        isActive,
        sortBy = '_id',
        sortDir = 'desc',
    }: {
        page?: number,
        pageSize?: number,
        /**
         * recherche email ou nom
         */
        q?: (string | null),
        isActive?: (boolean | null),
        sortBy?: 'created_at' | '_id' | 'email',
        sortDir?: 'asc' | 'desc',
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/users/',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'is_active': isActive,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Activer un utilisateur
     * @returns any Successful Response
     * @throws ApiError
     */
    public static activateUserAdminUsersUserIdActivatePatch({
        userId,
    }: {
        userId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/users/{user_id}/activate',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Desactiver un utilisateur
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deactivateUserAdminUsersUserIdDeactivatePatch({
        userId,
    }: {
        userId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/users/{user_id}/deactivate',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
