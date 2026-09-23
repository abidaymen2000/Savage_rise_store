/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentCommentOut } from '../models/ContentCommentOut';
import type { ContentCommentStatus } from '../models/ContentCommentStatus';
import type { ContentCommentUpdate } from '../models/ContentCommentUpdate';
import type { PaginatedContentCommentsOut } from '../models/PaginatedContentCommentsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminEngagementService {
    /**
     * Admin List Content Comments
     * @returns PaginatedContentCommentsOut Successful Response
     * @throws ApiError
     */
    public static adminListContentCommentsAdminEngagementCommentsGet({
        page = 1,
        pageSize = 20,
        status,
        targetId,
        userId,
        q,
    }: {
        page?: number,
        pageSize?: number,
        status?: (ContentCommentStatus | null),
        targetId?: (string | null),
        userId?: (string | null),
        q?: (string | null),
    }): CancelablePromise<PaginatedContentCommentsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/engagement/comments',
            query: {
                'page': page,
                'page_size': pageSize,
                'status': status,
                'target_id': targetId,
                'user_id': userId,
                'q': q,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Content Comment
     * @returns ContentCommentOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateContentCommentAdminEngagementCommentsCommentIdPatch({
        commentId,
        requestBody,
    }: {
        commentId: string,
        requestBody: ContentCommentUpdate,
    }): CancelablePromise<ContentCommentOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/engagement/comments/{comment_id}',
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
     * Admin Delete Content Comment
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteContentCommentAdminEngagementCommentsCommentIdDelete({
        commentId,
    }: {
        commentId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/engagement/comments/{comment_id}',
            path: {
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
