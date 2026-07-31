/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminContextResponse } from '../models/AdminContextResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminContextService {
    /**
     * Admin Context
     * @returns AdminContextResponse Successful Response
     * @throws ApiError
     */
    public static adminContextAdminContextGet(): CancelablePromise<AdminContextResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/context',
        });
    }
}
