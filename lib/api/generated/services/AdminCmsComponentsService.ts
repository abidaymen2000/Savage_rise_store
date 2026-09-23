/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSComponentDefinition } from '../models/CMSComponentDefinition';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsComponentsService {
    /**
     * Admin List Cms Components
     * @returns CMSComponentDefinition Successful Response
     * @throws ApiError
     */
    public static adminListCmsComponents(): CancelablePromise<Array<CMSComponentDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/components',
        });
    }
    /**
     * Admin Get Cms Component
     * @returns CMSComponentDefinition Successful Response
     * @throws ApiError
     */
    public static adminGetCmsComponent({
        componentKey,
    }: {
        componentKey: string,
    }): CancelablePromise<CMSComponentDefinition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/components/{component_key}',
            path: {
                'component_key': componentKey,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
