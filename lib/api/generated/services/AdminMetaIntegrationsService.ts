/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetaIntegrationConfigIn } from '../models/MetaIntegrationConfigIn';
import type { MetaIntegrationStatus } from '../models/MetaIntegrationStatus';
import type { MetaTestRequest } from '../models/MetaTestRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminMetaIntegrationsService {
    /**
     * Meta Status
     * @returns MetaIntegrationStatus Successful Response
     * @throws ApiError
     */
    public static metaStatusAdminIntegrationsMetaStatusGet(): CancelablePromise<MetaIntegrationStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/integrations/meta/status',
        });
    }
    /**
     * Meta Config
     * @returns MetaIntegrationStatus Successful Response
     * @throws ApiError
     */
    public static metaConfigAdminIntegrationsMetaConfigPut({
        requestBody,
    }: {
        requestBody: MetaIntegrationConfigIn,
    }): CancelablePromise<MetaIntegrationStatus> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/integrations/meta/config',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Meta Config
     * @returns void
     * @throws ApiError
     */
    public static deleteMetaConfigAdminIntegrationsMetaConfigDelete(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/integrations/meta/config',
        });
    }
    /**
     * Test Meta Config
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testMetaConfigAdminIntegrationsMetaTestPost({
        requestBody,
    }: {
        requestBody: MetaTestRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/integrations/meta/test',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
