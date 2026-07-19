/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MarketingRedirectService {
    /**
     * Redirect Marketing Code
     * @returns any Successful Response
     * @throws ApiError
     */
    public static redirectMarketingCodeRCodeGet({
        code,
    }: {
        code: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/r/{code}',
            path: {
                'code': code,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
