/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreNavigationPublicMenu } from '../models/StoreNavigationPublicMenu';
import type { StoreNavigationPublicMenus } from '../models/StoreNavigationPublicMenus';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorefrontNavigationService {
    /**
     * Storefront List Navigation Menus
     * @returns StoreNavigationPublicMenus Successful Response
     * @throws ApiError
     */
    public static storefrontListNavigationMenus({
        codes,
        surface = 'all',
    }: {
        codes?: (string | null),
        surface?: 'all' | 'desktop' | 'mobile',
    }): CancelablePromise<StoreNavigationPublicMenus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/navigation',
            query: {
                'codes': codes,
                'surface': surface,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront Get Navigation Menu
     * @returns StoreNavigationPublicMenu Successful Response
     * @throws ApiError
     */
    public static storefrontGetNavigationMenu({
        code,
        surface = 'all',
    }: {
        code: string,
        surface?: 'all' | 'desktop' | 'mobile',
    }): CancelablePromise<StoreNavigationPublicMenu> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/navigation/{code}',
            path: {
                'code': code,
            },
            query: {
                'surface': surface,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
