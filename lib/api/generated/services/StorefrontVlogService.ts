/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VlogChapterWithEpisodesOut } from '../models/VlogChapterWithEpisodesOut';
import type { VlogCommentCreate } from '../models/VlogCommentCreate';
import type { VlogCommentOut } from '../models/VlogCommentOut';
import type { VlogEpisodeLikeOut } from '../models/VlogEpisodeLikeOut';
import type { VlogEpisodeViewOut } from '../models/VlogEpisodeViewOut';
import type { VlogPageOut } from '../models/VlogPageOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorefrontVlogService {
    /**
     * Read Storefront Vlog
     * @returns VlogPageOut Successful Response
     * @throws ApiError
     */
    public static readStorefrontVlogStorefrontVlogGet(): CancelablePromise<VlogPageOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/vlog',
        });
    }
    /**
     * Read Storefront Vlog Chapter
     * @returns VlogChapterWithEpisodesOut Successful Response
     * @throws ApiError
     */
    public static readStorefrontVlogChapterStorefrontVlogChaptersSlugGet({
        slug,
    }: {
        slug: string,
    }): CancelablePromise<VlogChapterWithEpisodesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/vlog/chapters/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Track Vlog Episode View
     * @returns VlogEpisodeViewOut Successful Response
     * @throws ApiError
     */
    public static trackVlogEpisodeViewStorefrontVlogEpisodesEpisodeIdViewPost({
        episodeId,
    }: {
        episodeId: string,
    }): CancelablePromise<VlogEpisodeViewOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/vlog/episodes/{episode_id}/view',
            path: {
                'episode_id': episodeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Like Vlog Episode
     * @returns VlogEpisodeLikeOut Successful Response
     * @throws ApiError
     */
    public static likeVlogEpisodeStorefrontVlogEpisodesEpisodeIdLikePost({
        episodeId,
    }: {
        episodeId: string,
    }): CancelablePromise<VlogEpisodeLikeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/vlog/episodes/{episode_id}/like',
            path: {
                'episode_id': episodeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unlike Vlog Episode
     * @returns VlogEpisodeLikeOut Successful Response
     * @throws ApiError
     */
    public static unlikeVlogEpisodeStorefrontVlogEpisodesEpisodeIdLikeDelete({
        episodeId,
    }: {
        episodeId: string,
    }): CancelablePromise<VlogEpisodeLikeOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/storefront/vlog/episodes/{episode_id}/like',
            path: {
                'episode_id': episodeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Vlog Episode Comment
     * @returns VlogCommentOut Successful Response
     * @throws ApiError
     */
    public static createVlogEpisodeCommentStorefrontVlogEpisodesEpisodeIdCommentsPost({
        episodeId,
        requestBody,
    }: {
        episodeId: string,
        requestBody: VlogCommentCreate,
    }): CancelablePromise<VlogCommentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/vlog/episodes/{episode_id}/comments',
            path: {
                'episode_id': episodeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Vlog Episode Comments
     * @returns VlogCommentOut Successful Response
     * @throws ApiError
     */
    public static listVlogEpisodeCommentsStorefrontVlogEpisodesEpisodeIdCommentsGet({
        episodeId,
        skip,
        limit = 20,
    }: {
        episodeId: string,
        skip?: number,
        limit?: number,
    }): CancelablePromise<Array<VlogCommentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/vlog/episodes/{episode_id}/comments',
            path: {
                'episode_id': episodeId,
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
     * Delete Own Vlog Episode Comment
     * @returns void
     * @throws ApiError
     */
    public static deleteOwnVlogEpisodeCommentStorefrontVlogEpisodesEpisodeIdCommentsCommentIdDelete({
        episodeId,
        commentId,
    }: {
        episodeId: string,
        commentId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/storefront/vlog/episodes/{episode_id}/comments/{comment_id}',
            path: {
                'episode_id': episodeId,
                'comment_id': commentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
