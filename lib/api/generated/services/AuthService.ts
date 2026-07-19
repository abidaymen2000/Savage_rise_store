/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_login_token_auth_token_post } from '../models/Body_login_token_auth_token_post';
import type { PasswordReset } from '../models/PasswordReset';
import type { PasswordResetRequest } from '../models/PasswordResetRequest';
import type { UserCreate } from '../models/UserCreate';
import type { UserOut } from '../models/UserOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Creer un compte et envoyer un email de verification
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static signupAuthSignupPost({
        requestBody,
    }: {
        requestBody: UserCreate,
    }): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obtenir un JWT apres login (email verifie requis)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static loginTokenAuthTokenPost({
        formData,
    }: {
        formData: Body_login_token_auth_token_post,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/token',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verifier un email
     * @returns any Successful Response
     * @throws ApiError
     */
    public static verifyEmailAuthVerifyEmailGet({
        token,
    }: {
        token: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/verify-email',
            query: {
                'token': token,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Demande de reset de mot de passe
     * @returns any Successful Response
     * @throws ApiError
     */
    public static forgotPasswordAuthForgotPasswordPost({
        requestBody,
    }: {
        requestBody: PasswordResetRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reinitialisation du mot de passe via token
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resetPasswordAuthResetPasswordPost({
        requestBody,
    }: {
        requestBody: PasswordReset,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Renvoyer l'email de verification
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resendVerificationAuthResendVerificationPost({
        requestBody,
    }: {
        requestBody: PasswordResetRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/resend-verification',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
