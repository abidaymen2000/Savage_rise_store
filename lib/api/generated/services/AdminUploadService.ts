/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_images_upload_images_post } from '../models/Body_upload_images_upload_images_post';
import type { MultipleImageUploadOut } from '../models/MultipleImageUploadOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUploadService {
    /**
     * Upload Images
     * @returns MultipleImageUploadOut Successful Response
     * @throws ApiError
     */
    public static uploadImagesUploadImagesPost({
        formData,
    }: {
        formData: Body_upload_images_upload_images_post,
    }): CancelablePromise<MultipleImageUploadOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/upload-images',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
