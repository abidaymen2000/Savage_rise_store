/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReviewCreate } from '../models/ReviewCreate';
import type { ReviewOut } from '../models/ReviewOut';
import type { ReviewStats } from '../models/ReviewStats';
import type { ReviewUpdate } from '../models/ReviewUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReviewsService {
    /**
     * Add Review
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static addReviewProductsProductIdReviewsPost({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: ReviewCreate,
    }): CancelablePromise<ReviewOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/products/{product_id}/reviews/',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Reviews
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static getReviewsProductsProductIdReviewsGet({
        productId,
        rating,
        sortBest = false,
        skip,
        limit = 10,
    }: {
        productId: string,
        rating?: (number | null),
        /**
         * true pour tri par note desc
         */
        sortBest?: boolean,
        skip?: number,
        limit?: number,
    }): CancelablePromise<Array<ReviewOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{product_id}/reviews/',
            path: {
                'product_id': productId,
            },
            query: {
                'rating': rating,
                'sort_best': sortBest,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Review Stats
     * @returns ReviewStats Successful Response
     * @throws ApiError
     */
    public static reviewStatsProductsProductIdReviewsStatsGet({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<ReviewStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{product_id}/reviews/stats',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mes avis
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static getMyReviewsProductsProductIdReviewsMyreviewGet({
        productId,
        skip,
        limit = 10,
    }: {
        productId: string,
        skip?: number,
        limit?: number,
    }): CancelablePromise<Array<ReviewOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{product_id}/reviews/myreview',
            path: {
                'product_id': productId,
            },
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
     * Read Review
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static readReviewProductsProductIdReviewsReviewIdGet({
        productId,
        reviewId,
    }: {
        productId: string,
        reviewId: string,
    }): CancelablePromise<ReviewOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/products/{product_id}/reviews/{review_id}',
            path: {
                'product_id': productId,
                'review_id': reviewId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Edit Review
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static editReviewProductsProductIdReviewsReviewIdPut({
        productId,
        reviewId,
        requestBody,
    }: {
        productId: string,
        reviewId: string,
        requestBody: ReviewUpdate,
    }): CancelablePromise<ReviewOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/products/{product_id}/reviews/{review_id}',
            path: {
                'product_id': productId,
                'review_id': reviewId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Review
     * @returns void
     * @throws ApiError
     */
    public static removeReviewProductsProductIdReviewsReviewIdDelete({
        productId,
        reviewId,
    }: {
        productId: string,
        reviewId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/products/{product_id}/reviews/{review_id}',
            path: {
                'product_id': productId,
                'review_id': reviewId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
