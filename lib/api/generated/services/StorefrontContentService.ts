/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentPublicEntryOut } from '../models/CMSContentPublicEntryOut';
import type { ContentCommentCreate } from '../models/ContentCommentCreate';
import type { ContentCommentOut } from '../models/ContentCommentOut';
import type { ContentEngagementStatsOut } from '../models/ContentEngagementStatsOut';
import type { ContentReactionOut } from '../models/ContentReactionOut';
import type { PaginatedCMSContentPublicEntriesOut } from '../models/PaginatedCMSContentPublicEntriesOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorefrontContentService {
    /**
     * Storefront List Content Entry Comments
     * @returns ContentCommentOut Successful Response
     * @throws ApiError
     */
    public static storefrontListContentEntryComments({
        entryId,
        skip,
        limit = 20,
    }: {
        entryId: string,
        skip?: number,
        limit?: number,
    }): CancelablePromise<Array<ContentCommentOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/content/entries/{entry_id}/comments',
            path: {
                'entry_id': entryId,
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
     * Storefront Create Content Entry Comment
     * @returns ContentCommentOut Successful Response
     * @throws ApiError
     */
    public static storefrontCreateContentEntryComment({
        entryId,
        requestBody,
    }: {
        entryId: string,
        requestBody: ContentCommentCreate,
    }): CancelablePromise<ContentCommentOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/content/entries/{entry_id}/comments',
            path: {
                'entry_id': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront View Content Entry
     * @returns ContentEngagementStatsOut Successful Response
     * @throws ApiError
     */
    public static storefrontViewContentEntry({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<ContentEngagementStatsOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/content/entries/{entry_id}/view',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront Like Content Entry
     * @returns ContentReactionOut Successful Response
     * @throws ApiError
     */
    public static storefrontLikeContentEntry({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<ContentReactionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/storefront/content/entries/{entry_id}/like',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront Unlike Content Entry
     * @returns ContentReactionOut Successful Response
     * @throws ApiError
     */
    public static storefrontUnlikeContentEntry({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<ContentReactionOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/storefront/content/entries/{entry_id}/like',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront List Cms Content Entries
     * @returns PaginatedCMSContentPublicEntriesOut Successful Response
     * @throws ApiError
     */
    public static storefrontListCmsContentEntries({
        contentType,
        page = 1,
        pageSize = 20,
        locale,
        sortBy = 'published_at_desc',
    }: {
        contentType: string,
        page?: number,
        pageSize?: number,
        locale?: (string | null),
        sortBy?: string,
    }): CancelablePromise<PaginatedCMSContentPublicEntriesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/content/{content_type}',
            path: {
                'content_type': contentType,
            },
            query: {
                'page': page,
                'page_size': pageSize,
                'locale': locale,
                'sort_by': sortBy,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Storefront Get Cms Content Entry
     * @returns CMSContentPublicEntryOut Successful Response
     * @throws ApiError
     */
    public static storefrontGetCmsContentEntry({
        contentType,
        slug,
        locale,
    }: {
        contentType: string,
        slug: string,
        locale?: (string | null),
    }): CancelablePromise<CMSContentPublicEntryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/storefront/content/{content_type}/{slug}',
            path: {
                'content_type': contentType,
                'slug': slug,
            },
            query: {
                'locale': locale,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
