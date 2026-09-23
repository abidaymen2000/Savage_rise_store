/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSContentEntryCreate } from '../models/CMSContentEntryCreate';
import type { CMSContentEntryLocalizationUpdate } from '../models/CMSContentEntryLocalizationUpdate';
import type { CMSContentEntryOut } from '../models/CMSContentEntryOut';
import type { CMSContentEntryPublishRequest } from '../models/CMSContentEntryPublishRequest';
import type { CMSContentEntryStatus } from '../models/CMSContentEntryStatus';
import type { CMSContentEntryUpdate } from '../models/CMSContentEntryUpdate';
import type { CMSContentTypeDefinition } from '../models/CMSContentTypeDefinition';
import type { PaginatedCMSContentEntriesOut } from '../models/PaginatedCMSContentEntriesOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsContentService {
    /**
     * Admin List Cms Content Types
     * @returns CMSContentTypeDefinition Successful Response
     * @throws ApiError
     */
    public static adminListCmsContentTypes(): CancelablePromise<Array<CMSContentTypeDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content/types',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Cms Content Type
     * @returns CMSContentTypeDefinition Successful Response
     * @throws ApiError
     */
    public static adminGetCmsContentType({
        contentType,
    }: {
        contentType: string,
    }): CancelablePromise<CMSContentTypeDefinition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content/types/{content_type}',
            path: {
                'content_type': contentType,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin List Cms Content Entries
     * @returns PaginatedCMSContentEntriesOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsContentEntries({
        contentType,
        page = 1,
        pageSize = 20,
        q,
        status,
        sortBy = 'updated_at',
        sortDir = 'desc',
    }: {
        contentType?: (string | null),
        page?: number,
        pageSize?: number,
        q?: (string | null),
        status?: (CMSContentEntryStatus | null),
        sortBy?: string,
        sortDir?: string,
    }): CancelablePromise<PaginatedCMSContentEntriesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content/entries',
            query: {
                'content_type': contentType,
                'page': page,
                'page_size': pageSize,
                'q': q,
                'status': status,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Cms Content Entry
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsContentEntry({
        requestBody,
    }: {
        requestBody: CMSContentEntryCreate,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/content/entries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin List Cms Content
     * @returns PaginatedCMSContentEntriesOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsContent({
        contentType,
        page = 1,
        pageSize = 20,
        q,
        locale,
        status,
        sortBy = 'updated_at',
        sortDir = 'desc',
    }: {
        contentType?: (string | null),
        page?: number,
        pageSize?: number,
        q?: (string | null),
        locale?: (string | null),
        status?: (CMSContentEntryStatus | null),
        sortBy?: string,
        sortDir?: string,
    }): CancelablePromise<PaginatedCMSContentEntriesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content',
            query: {
                'content_type': contentType,
                'page': page,
                'page_size': pageSize,
                'q': q,
                'locale': locale,
                'status': status,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Cms Content
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsContent({
        requestBody,
    }: {
        requestBody: CMSContentEntryCreate,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/content',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Cms Content Entry
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsContentEntry({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content/entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Content Entry
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsContentEntry({
        entryId,
        requestBody,
    }: {
        entryId: string,
        requestBody: CMSContentEntryUpdate,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/content/entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Archive Cms Content Entry
     * @returns void
     * @throws ApiError
     */
    public static adminArchiveCmsContentEntry({
        entryId,
        expectedVersion,
    }: {
        entryId: string,
        expectedVersion: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/content/entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Cms Content
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsContent({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/content/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Content
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsContent({
        entryId,
        requestBody,
    }: {
        entryId: string,
        requestBody: CMSContentEntryUpdate,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/content/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Archive Cms Content
     * @returns void
     * @throws ApiError
     */
    public static adminArchiveCmsContent({
        entryId,
        expectedVersion,
    }: {
        entryId: string,
        expectedVersion: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/content/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Publish Cms Content Entry
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminPublishCmsContentEntry({
        entryId,
        requestBody,
        locale,
    }: {
        entryId: string,
        requestBody: CMSContentEntryPublishRequest,
        locale?: (string | null),
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/content/entries/{entry_id}/publish',
            path: {
                'entry_id': entryId,
            },
            query: {
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Publish Cms Content
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminPublishCmsContent({
        entryId,
        requestBody,
        locale,
    }: {
        entryId: string,
        requestBody: CMSContentEntryPublishRequest,
        locale?: (string | null),
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/content/{entry_id}/publish',
            path: {
                'entry_id': entryId,
            },
            query: {
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Unpublish Cms Content Entry
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminUnpublishCmsContentEntry({
        entryId,
        requestBody,
        locale,
    }: {
        entryId: string,
        requestBody: CMSContentEntryPublishRequest,
        locale?: (string | null),
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/content/entries/{entry_id}/unpublish',
            path: {
                'entry_id': entryId,
            },
            query: {
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Unpublish Cms Content
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminUnpublishCmsContent({
        entryId,
        requestBody,
        locale,
    }: {
        entryId: string,
        requestBody: CMSContentEntryPublishRequest,
        locale?: (string | null),
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/content/{entry_id}/unpublish',
            path: {
                'entry_id': entryId,
            },
            query: {
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Content Entry Localization
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsContentEntryLocalization({
        entryId,
        locale,
        requestBody,
    }: {
        entryId: string,
        locale: string,
        requestBody: CMSContentEntryLocalizationUpdate,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/content/entries/{entry_id}/localizations/{locale}',
            path: {
                'entry_id': entryId,
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Content Localization
     * @returns CMSContentEntryOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsContentLocalization({
        entryId,
        locale,
        requestBody,
    }: {
        entryId: string,
        locale: string,
        requestBody: CMSContentEntryLocalizationUpdate,
    }): CancelablePromise<CMSContentEntryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/content/{entry_id}/localizations/{locale}',
            path: {
                'entry_id': entryId,
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS content not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
}
