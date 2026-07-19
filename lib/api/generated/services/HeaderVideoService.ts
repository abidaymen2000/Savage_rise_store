/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_admin_upload_header_image_admin_header_image_upload_post } from '../models/Body_admin_upload_header_image_admin_header_image_upload_post';
import type { Body_admin_upload_header_video_admin_header_video_upload_post } from '../models/Body_admin_upload_header_video_admin_header_video_upload_post';
import type { HeaderVideoAsset } from '../models/HeaderVideoAsset';
import type { HeaderVideoConfig } from '../models/HeaderVideoConfig';
import type { HeaderVideoListOut } from '../models/HeaderVideoListOut';
import type { HeaderVideoUpdate } from '../models/HeaderVideoUpdate';
import type { HeaderVideoUploadOut } from '../models/HeaderVideoUploadOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HeaderVideoService {
    /**
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
    /**
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
     * Admin Upload Header Video
     * @returns HeaderVideoUploadOut Successful Response
     * @throws ApiError
     */
    public static adminUploadHeaderVideoAdminHeaderVideoUploadPost({
        formData,
        setActive = true,
    }: {
        formData: Body_admin_upload_header_video_admin_header_video_upload_post,
        /**
         * Definir cette video comme video active du header
         */
        setActive?: boolean,
    }): CancelablePromise<HeaderVideoUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/header-video/upload',
            query: {
                'set_active': setActive,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
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
     * Admin Upload Header Image
     * @returns HeaderVideoUploadOut Successful Response
     * @throws ApiError
     */
    public static adminUploadHeaderImageAdminHeaderImageUploadPost({
        formData,
        setActive = true,
    }: {
        formData: Body_admin_upload_header_image_admin_header_image_upload_post,
        /**
         * Definir cette image comme image active du hero
         */
        setActive?: boolean,
    }): CancelablePromise<HeaderVideoUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/header-image/upload',
            query: {
                'set_active': setActive,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
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
}
