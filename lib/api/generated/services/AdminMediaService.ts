/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__media__ImageKitDirectUploadAuth } from '../models/app__schemas__media__ImageKitDirectUploadAuth';
import type { MediaCleanupResponse } from '../models/MediaCleanupResponse';
import type { MediaRegisterRequest } from '../models/MediaRegisterRequest';
import type { MediaRegisterResponse } from '../models/MediaRegisterResponse';
import type { MediaUploadAuthRequest } from '../models/MediaUploadAuthRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminMediaService {
    /**
     * Admin Get Media Upload Auth
     * @returns app__schemas__media__ImageKitDirectUploadAuth Successful Response
     * @throws ApiError
     */
    public static adminMediaGetUploadAuth({
        requestBody,
    }: {
        requestBody: MediaUploadAuthRequest,
    }): CancelablePromise<app__schemas__media__ImageKitDirectUploadAuth> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/media/upload-auth',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Register Media Upload
     * @returns MediaRegisterResponse Successful Response
     * @throws ApiError
     */
    public static adminMediaRegisterUpload({
        requestBody,
    }: {
        requestBody: MediaRegisterRequest,
    }): CancelablePromise<MediaRegisterResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/media/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Cleanup Media Upload
     * @returns MediaCleanupResponse Successful Response
     * @throws ApiError
     */
    public static adminMediaCleanupUpload({
        requestBody,
    }: {
        requestBody: MediaRegisterRequest,
    }): CancelablePromise<MediaCleanupResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/media/cleanup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
