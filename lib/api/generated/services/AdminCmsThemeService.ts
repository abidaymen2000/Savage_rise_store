/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSTheme } from '../models/CMSTheme';
import type { CMSThemeUpdate } from '../models/CMSThemeUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsThemeService {
    /**
     * Admin Get Cms Theme
     * @returns CMSTheme Successful Response
     * @throws ApiError
     */
    public static adminGetCmsTheme(): CancelablePromise<CMSTheme> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/theme',
        });
    }
    /**
     * Admin Update Cms Theme
     * @returns CMSTheme Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsTheme({
        requestBody,
    }: {
        requestBody: CMSThemeUpdate,
    }): CancelablePromise<CMSTheme> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/theme',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
