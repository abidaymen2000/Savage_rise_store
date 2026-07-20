/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoreNavigationDestinationRegistry } from '../models/StoreNavigationDestinationRegistry';
import type { StoreNavigationItemCreate } from '../models/StoreNavigationItemCreate';
import type { StoreNavigationItemUpdate } from '../models/StoreNavigationItemUpdate';
import type { StoreNavigationMenuAdminRead } from '../models/StoreNavigationMenuAdminRead';
import type { StoreNavigationMenuCreate } from '../models/StoreNavigationMenuCreate';
import type { StoreNavigationMenuLocation } from '../models/StoreNavigationMenuLocation';
import type { StoreNavigationMenuSummary } from '../models/StoreNavigationMenuSummary';
import type { StoreNavigationMenuUpdate } from '../models/StoreNavigationMenuUpdate';
import type { StoreNavigationReorderRequest } from '../models/StoreNavigationReorderRequest';
import type { StoreNavigationValidationResult } from '../models/StoreNavigationValidationResult';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminStoreNavigationService {
    /**
     * Admin List Store Navigation Menus
     * @returns StoreNavigationMenuSummary Successful Response
     * @throws ApiError
     */
    public static adminListStoreNavigationMenus({
        isActive,
    }: {
        isActive?: (boolean | null),
    }): CancelablePromise<Array<StoreNavigationMenuSummary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/navigation-menus',
            query: {
                'is_active': isActive,
            },
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Store Navigation Menu
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminCreateStoreNavigationMenu({
        requestBody,
    }: {
        requestBody: StoreNavigationMenuCreate,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/navigation-menus',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin List Store Navigation Menu Locations
     * @returns StoreNavigationMenuLocation Successful Response
     * @throws ApiError
     */
    public static adminListStoreNavigationMenuLocations(): CancelablePromise<Array<StoreNavigationMenuLocation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/navigation-menu-locations',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Store Navigation Menu
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminGetStoreNavigationMenu({
        menuId,
    }: {
        menuId: string,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/navigation-menus/{menu_id}',
            path: {
                'menu_id': menuId,
            },
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Store Navigation Menu
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminUpdateStoreNavigationMenu({
        menuId,
        requestBody,
    }: {
        menuId: string,
        requestBody: StoreNavigationMenuUpdate,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/navigation-menus/{menu_id}',
            path: {
                'menu_id': menuId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Delete Store Navigation Menu
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteStoreNavigationMenu({
        menuId,
    }: {
        menuId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/navigation-menus/{menu_id}',
            path: {
                'menu_id': menuId,
            },
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Store Navigation Item
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminCreateStoreNavigationItem({
        menuId,
        requestBody,
    }: {
        menuId: string,
        requestBody: StoreNavigationItemCreate,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/navigation-menus/{menu_id}/items',
            path: {
                'menu_id': menuId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Store Navigation Item
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminUpdateStoreNavigationItem({
        menuId,
        itemId,
        requestBody,
    }: {
        menuId: string,
        itemId: string,
        requestBody: StoreNavigationItemUpdate,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/navigation-menus/{menu_id}/items/{item_id}',
            path: {
                'menu_id': menuId,
                'item_id': itemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Delete Store Navigation Item
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminDeleteStoreNavigationItem({
        menuId,
        itemId,
        expectedVersion,
        cascade = false,
    }: {
        menuId: string,
        itemId: string,
        expectedVersion: number,
        cascade?: boolean,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/navigation-menus/{menu_id}/items/{item_id}',
            path: {
                'menu_id': menuId,
                'item_id': itemId,
            },
            query: {
                'cascade': cascade,
                'expected_version': expectedVersion,
            },
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Reorder Store Navigation Items
     * @returns StoreNavigationMenuAdminRead Successful Response
     * @throws ApiError
     */
    public static adminReorderStoreNavigationItems({
        menuId,
        requestBody,
    }: {
        menuId: string,
        requestBody: StoreNavigationReorderRequest,
    }): CancelablePromise<StoreNavigationMenuAdminRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/cms/navigation-menus/{menu_id}/items/order',
            path: {
                'menu_id': menuId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Validate Store Navigation Menu
     * @returns StoreNavigationValidationResult Successful Response
     * @throws ApiError
     */
    public static adminValidateStoreNavigationMenu({
        menuId,
    }: {
        menuId: string,
    }): CancelablePromise<StoreNavigationValidationResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/navigation-menus/{menu_id}/validate',
            path: {
                'menu_id': menuId,
            },
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin List Store Navigation Destinations
     * @returns StoreNavigationDestinationRegistry Successful Response
     * @throws ApiError
     */
    public static adminListStoreNavigationDestinations(): CancelablePromise<StoreNavigationDestinationRegistry> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/navigation-destinations',
            errors: {
                404: `Navigation menu or item not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
}
