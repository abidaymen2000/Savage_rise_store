/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StorePagePublicOut } from '../models/StorePagePublicOut';
import type { StorePageSummaryOut } from '../models/StorePageSummaryOut';
import type { StorePageType } from '../models/StorePageType';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorefrontPagesService {
    /**
     * Storefront List Store Pages
     * @returns StorePageSummaryOut Successful Response
     * @throws ApiError
     */
    public static storefrontListStorePages({
        keys,
        slugs,
        pageType,
    }: {
        keys?: (string | null),
        slugs?: (string | null),
        pageType?: (StorePageType | null),
    }): CancelablePromise<Array<StorePageSummaryOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/pages',
            query: {
                'keys': keys,
                'slugs': slugs,
                'page_type': pageType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront Get Store Page
     * @returns StorePagePublicOut Successful Response
     * @throws ApiError
     */
    public static storefrontGetStorePage({
        slug,
    }: {
        slug: string,
    }): CancelablePromise<StorePagePublicOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/pages/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
