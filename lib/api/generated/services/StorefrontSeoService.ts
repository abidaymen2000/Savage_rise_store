/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorefrontSeoService {
    /**
     * Storefront Resolve Redirect
     * @returns any Successful Response
     * @throws ApiError
     */
    public static storefrontResolveRedirect({
        path,
    }: {
        path: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/redirects/resolve',
            query: {
                'path': path,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront Sitemap Xml
     * @returns any Successful Response
     * @throws ApiError
     */
    public static storefrontSitemapXml(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/sitemap.xml',
        });
    }
    /**
     * Storefront Robots Txt
     * @returns any Successful Response
     * @throws ApiError
     */
    public static storefrontRobotsTxt(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/robots.txt',
        });
    }
}
