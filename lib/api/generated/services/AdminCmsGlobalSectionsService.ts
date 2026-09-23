/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSGlobalSectionCreate } from '../models/CMSGlobalSectionCreate';
import type { CMSGlobalSectionOut } from '../models/CMSGlobalSectionOut';
import type { CMSGlobalSectionPublishRequest } from '../models/CMSGlobalSectionPublishRequest';
import type { CMSGlobalSectionStatus } from '../models/CMSGlobalSectionStatus';
import type { CMSGlobalSectionUpdate } from '../models/CMSGlobalSectionUpdate';
import type { CMSLocalizationUpdate } from '../models/CMSLocalizationUpdate';
import type { PaginatedCMSGlobalSectionsOut } from '../models/PaginatedCMSGlobalSectionsOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsGlobalSectionsService {
    /**
     * Admin List Cms Global Sections
     * @returns PaginatedCMSGlobalSectionsOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsGlobalSections({
        page = 1,
        pageSize = 20,
        q,
        status,
        sortBy = 'updated_at',
        sortDir = 'desc',
    }: {
        page?: number,
        pageSize?: number,
        q?: (string | null),
        status?: (CMSGlobalSectionStatus | null),
        sortBy?: string,
        sortDir?: string,
    }): CancelablePromise<PaginatedCMSGlobalSectionsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/global-sections',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'status': status,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Cms Global Section
     * @returns CMSGlobalSectionOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsGlobalSection({
        requestBody,
    }: {
        requestBody: CMSGlobalSectionCreate,
    }): CancelablePromise<CMSGlobalSectionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/global-sections',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Cms Global Section
     * @returns CMSGlobalSectionOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsGlobalSection({
        sectionId,
    }: {
        sectionId: string,
    }): CancelablePromise<CMSGlobalSectionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/global-sections/{section_id}',
            path: {
                'section_id': sectionId,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Global Section
     * @returns CMSGlobalSectionOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsGlobalSection({
        sectionId,
        requestBody,
    }: {
        sectionId: string,
        requestBody: CMSGlobalSectionUpdate,
    }): CancelablePromise<CMSGlobalSectionOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/global-sections/{section_id}',
            path: {
                'section_id': sectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Archive Cms Global Section
     * @returns void
     * @throws ApiError
     */
    public static adminArchiveCmsGlobalSection({
        sectionId,
        expectedVersion,
    }: {
        sectionId: string,
        expectedVersion: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/global-sections/{section_id}',
            path: {
                'section_id': sectionId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Publish Cms Global Section
     * @returns CMSGlobalSectionOut Successful Response
     * @throws ApiError
     */
    public static adminPublishCmsGlobalSection({
        sectionId,
        requestBody,
        locale,
    }: {
        sectionId: string,
        requestBody: CMSGlobalSectionPublishRequest,
        locale?: (string | null),
    }): CancelablePromise<CMSGlobalSectionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/global-sections/{section_id}/publish',
            path: {
                'section_id': sectionId,
            },
            query: {
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Unpublish Cms Global Section
     * @returns CMSGlobalSectionOut Successful Response
     * @throws ApiError
     */
    public static adminUnpublishCmsGlobalSection({
        sectionId,
        requestBody,
        locale,
    }: {
        sectionId: string,
        requestBody: CMSGlobalSectionPublishRequest,
        locale?: (string | null),
    }): CancelablePromise<CMSGlobalSectionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/global-sections/{section_id}/unpublish',
            path: {
                'section_id': sectionId,
            },
            query: {
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Global Section Localization
     * @returns CMSGlobalSectionOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsGlobalSectionLocalization({
        sectionId,
        locale,
        requestBody,
    }: {
        sectionId: string,
        locale: string,
        requestBody: CMSLocalizationUpdate,
    }): CancelablePromise<CMSGlobalSectionOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/global-sections/{section_id}/localizations/{locale}',
            path: {
                'section_id': sectionId,
                'locale': locale,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS global section not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
}
