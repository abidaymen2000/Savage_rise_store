/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSPreviewCreate } from '../models/CMSPreviewCreate';
import type { CMSPreviewTokenOut } from '../models/CMSPreviewTokenOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsPreviewService {
    /**
     * Admin Create Cms Preview
     * @returns CMSPreviewTokenOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsPreview({
        requestBody,
    }: {
        requestBody: CMSPreviewCreate,
    }): CancelablePromise<CMSPreviewTokenOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/preview',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
