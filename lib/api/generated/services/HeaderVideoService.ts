/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__media__ImageKitDirectUploadAuth } from '../models/app__schemas__media__ImageKitDirectUploadAuth';
import type { HeaderVideoAsset } from '../models/HeaderVideoAsset';
import type { HeaderVideoConfig } from '../models/HeaderVideoConfig';
import type { HeaderVideoListOut } from '../models/HeaderVideoListOut';
import type { HeaderVideoUpdate } from '../models/HeaderVideoUpdate';
import type { HeaderVideoUploadOut } from '../models/HeaderVideoUploadOut';
import type { MediaRegisterRequest } from '../models/MediaRegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HeaderVideoService {
    /**
     * @deprecated
     * Admin List Header Videos
     * @returns HeaderVideoListOut Successful Response
     * @throws ApiError
     */
    public static adminListHeaderVideosAdminHeaderVideosGet({
        limit = 50,
        skip,
    }: {
        limit?: number,
        skip?: number,
    }): CancelablePromise<HeaderVideoListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/header-videos',
            query: {
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin Get Header Video
     * @returns HeaderVideoConfig Successful Response
     * @throws ApiError
     */
    public static adminGetHeaderVideoAdminHeaderVideoGet(): CancelablePromise<HeaderVideoConfig> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/header-video',
        });
    }
    /**
     * @deprecated
     * Admin Update Header Video
     * @returns HeaderVideoConfig Successful Response
     * @throws ApiError
     */
    public static adminUpdateHeaderVideoAdminHeaderVideoPut({
        requestBody,
    }: {
        requestBody: HeaderVideoUpdate,
    }): CancelablePromise<HeaderVideoConfig> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/header-video',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin Get Header Video Upload Auth
     * @returns app__schemas__media__ImageKitDirectUploadAuth Successful Response
     * @throws ApiError
     */
    public static adminGetHeaderVideoUploadAuthAdminHeaderVideoUploadAuthPost(): CancelablePromise<app__schemas__media__ImageKitDirectUploadAuth> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/header-video/upload-auth',
        });
    }
    /**
     * @deprecated
     * Admin Register Header Video
     * @returns HeaderVideoUploadOut Successful Response
     * @throws ApiError
     */
    public static adminRegisterHeaderVideoAdminHeaderVideoRegisterPost({
        requestBody,
    }: {
        requestBody: MediaRegisterRequest,
    }): CancelablePromise<HeaderVideoUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/header-video/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin List Header Images
     * @returns HeaderVideoListOut Successful Response
     * @throws ApiError
     */
    public static adminListHeaderImagesAdminHeaderImagesGet({
        limit = 50,
        skip,
    }: {
        limit?: number,
        skip?: number,
    }): CancelablePromise<HeaderVideoListOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/header-images',
            query: {
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin Get Header Image Upload Auth
     * @returns app__schemas__media__ImageKitDirectUploadAuth Successful Response
     * @throws ApiError
     */
    public static adminGetHeaderImageUploadAuthAdminHeaderImageUploadAuthPost(): CancelablePromise<app__schemas__media__ImageKitDirectUploadAuth> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/header-image/upload-auth',
        });
    }
    /**
     * @deprecated
     * Admin Register Header Image
     * @returns HeaderVideoUploadOut Successful Response
     * @throws ApiError
     */
    public static adminRegisterHeaderImageAdminHeaderImageRegisterPost({
        requestBody,
    }: {
        requestBody: MediaRegisterRequest,
    }): CancelablePromise<HeaderVideoUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/header-image/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin Select Header Image
     * @returns HeaderVideoConfig Successful Response
     * @throws ApiError
     */
    public static adminSelectHeaderImageAdminHeaderImagePut({
        requestBody,
    }: {
        requestBody: HeaderVideoAsset,
    }): CancelablePromise<HeaderVideoConfig> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/header-image',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin Delete Header Video
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteHeaderVideoAdminHeaderVideosFileIdDelete({
        fileId,
    }: {
        fileId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/header-videos/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Admin Delete Header Image
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteHeaderImageAdminHeaderImagesFileIdDelete({
        fileId,
    }: {
        fileId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/header-images/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * @deprecated
     * Read Storefront Header Video
     * @returns HeaderVideoConfig Successful Response
     * @throws ApiError
     */
    public static readStorefrontHeaderVideoStorefrontHeaderVideoGet(): CancelablePromise<HeaderVideoConfig> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/header-video',
        });
    }
}
