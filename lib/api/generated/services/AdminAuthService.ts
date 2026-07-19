/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminLogin } from '../models/AdminLogin';
import type { AdminPasswordChange } from '../models/AdminPasswordChange';
import type { AdminPublic } from '../models/AdminPublic';
import type { Token } from '../models/Token';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAuthService {
    /**
     * Admin Login
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static adminLoginAdminAuthTokenPost({
        requestBody,
    }: {
        requestBody: AdminLogin,
    }): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/auth/token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Me
     * @returns AdminPublic Successful Response
     * @throws ApiError
     */
    public static adminMeAdminAuthMeGet(): CancelablePromise<AdminPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/auth/me',
        });
    }
    /**
     * Modifier le mot de passe de l'admin connecte
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changeAdminPasswordAdminAuthChangePasswordPatch({
        requestBody,
    }: {
        requestBody: AdminPasswordChange,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
