/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminReviewUpdate } from '../models/AdminReviewUpdate';
import type { PaginatedReviewsOut } from '../models/PaginatedReviewsOut';
import type { PaginatedVlogCommentsOut } from '../models/PaginatedVlogCommentsOut';
import type { ReviewOut } from '../models/ReviewOut';
import type { VlogCommentOut } from '../models/VlogCommentOut';
import type { VlogCommentUpdate } from '../models/VlogCommentUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCommentsService {
    /**
     * Admin List Comments
     * @returns PaginatedVlogCommentsOut Successful Response
     * @throws ApiError
     */
    public static adminListCommentsAdminCommentsGet({
        page = 1,
        pageSize = 20,
        status,
        episodeId,
        userId,
        q,
    }: {
        page?: number,
        pageSize?: number,
        status?: ('visible' | 'hidden' | null),
        episodeId?: (string | null),
        userId?: (string | null),
        /**
         * Recherche dans le contenu du commentaire
         */
        q?: (string | null),
    }): CancelablePromise<PaginatedVlogCommentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/comments',
            query: {
                'page': page,
                'page_size': pageSize,
                'status': status,
                'episode_id': episodeId,
                'user_id': userId,
                'q': q,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Product Reviews
     * @returns PaginatedReviewsOut Successful Response
     * @throws ApiError
     */
    public static adminListProductReviewsAdminCommentsProductReviewsGet({
        page = 1,
        pageSize = 20,
        status,
        productId,
        userId,
        rating,
        q,
    }: {
        page?: number,
        pageSize?: number,
        status?: ('visible' | 'hidden' | null),
        productId?: (string | null),
        userId?: (string | null),
        rating?: (number | null),
        /**
         * Recherche dans le titre ou commentaire
         */
        q?: (string | null),
    }): CancelablePromise<PaginatedReviewsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/comments/product-reviews',
            query: {
                'page': page,
                'page_size': pageSize,
                'status': status,
                'product_id': productId,
                'user_id': userId,
                'rating': rating,
                'q': q,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Product Review
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateProductReviewAdminCommentsProductReviewsReviewIdPatch({
        reviewId,
        requestBody,
    }: {
        reviewId: string,
        requestBody: AdminReviewUpdate,
    }): CancelablePromise<ReviewOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/comments/product-reviews/{review_id}',
            path: {
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
     * Admin Delete Product Review
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteProductReviewAdminCommentsProductReviewsReviewIdDelete({
        reviewId,
    }: {
        reviewId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/comments/product-reviews/{review_id}',
            path: {
                'review_id': reviewId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Comment
     * @returns VlogCommentOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCommentAdminCommentsCommentIdPatch({
        commentId,
        requestBody,
    }: {
        commentId: string,
        requestBody: VlogCommentUpdate,
    }): CancelablePromise<VlogCommentOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/comments/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Delete Comment
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteCommentAdminCommentsCommentIdDelete({
        commentId,
    }: {
        commentId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/comments/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
