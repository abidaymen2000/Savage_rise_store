/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentTypeDefinition } from '../models/CMSContentTypeDefinition';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsContentTypesService {
    /**
     * Admin List Cms Content Type Definitions
     * @returns CMSContentTypeDefinition Successful Response
     * @throws ApiError
     */
    public static adminListCmsContentTypeDefinitions(): CancelablePromise<Array<CMSContentTypeDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content-types',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Cms Content Type Definition
     * @returns CMSContentTypeDefinition Successful Response
     * @throws ApiError
     */
    public static adminGetCmsContentTypeDefinition({
        contentType,
    }: {
        contentType: string,
    }): CancelablePromise<CMSContentTypeDefinition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content-types/{content_type}',
            path: {
                'content_type': contentType,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
}
