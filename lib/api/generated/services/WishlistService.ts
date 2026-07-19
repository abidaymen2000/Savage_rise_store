/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { WishlistCreate } from '../models/WishlistCreate';
import type { WishlistOut } from '../models/WishlistOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WishlistService {
    /**
     * Add Wish
     * @returns WishlistOut Successful Response
     * @throws ApiError
     */
    public static addWishProfileWishlistPost({
        requestBody,
    }: {
        requestBody: WishlistCreate,
    }): CancelablePromise<WishlistOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profile/wishlist/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Wishlist
     * @returns WishlistOut Successful Response
     * @throws ApiError
     */
    public static getWishlistProfileWishlistGet({
        skip,
        limit = 20,
    }: {
        skip?: number,
        limit?: number,
    }): CancelablePromise<Array<WishlistOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/wishlist/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Wish
     * @returns void
     * @throws ApiError
     */
    public static removeWishProfileWishlistProductIdDelete({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/profile/wishlist/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
