/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminCompanyOption } from '../models/AdminCompanyOption';
import type { AdminLogin } from '../models/AdminLogin';
import type { AdminPasswordChange } from '../models/AdminPasswordChange';
import type { AdminPublic } from '../models/AdminPublic';
import type { AdminSwitchCompanyRequest } from '../models/AdminSwitchCompanyRequest';
import type { AdminSwitchCompanyResponse } from '../models/AdminSwitchCompanyResponse';
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
     * Admin Companies
     * @returns AdminCompanyOption Successful Response
     * @throws ApiError
     */
    public static adminCompaniesAdminAuthCompaniesGet(): CancelablePromise<Array<AdminCompanyOption>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/auth/companies',
        });
    }
    /**
     * Admin Switch Company
     * @returns AdminSwitchCompanyResponse Successful Response
     * @throws ApiError
     */
    public static adminSwitchCompanyAdminAuthSwitchCompanyPost({
        requestBody,
    }: {
        requestBody: AdminSwitchCompanyRequest,
    }): CancelablePromise<AdminSwitchCompanyResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/auth/switch-company',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Leave Company
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static adminLeaveCompanyAdminAuthLeaveCompanyPost(): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/auth/leave-company',
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
