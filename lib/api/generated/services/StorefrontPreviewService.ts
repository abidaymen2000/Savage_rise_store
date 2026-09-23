/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSPreviewPageOut } from '../models/CMSPreviewPageOut';
import type { CMSPreviewReleaseOut } from '../models/CMSPreviewReleaseOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorefrontPreviewService {
    /**
     * Storefront Cms Preview
     * @returns any Successful Response
     * @throws ApiError
     */
    public static storefrontCmsPreview({
        token,
    }: {
        token: string,
    }): CancelablePromise<(CMSPreviewPageOut | CMSPreviewReleaseOut)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/preview',
            query: {
                'token': token,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
