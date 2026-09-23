/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CMSPageTemplateCreate } from '../models/CMSPageTemplateCreate';
import type { CMSPageTemplateDuplicateRequest } from '../models/CMSPageTemplateDuplicateRequest';
import type { CMSPageTemplateOut } from '../models/CMSPageTemplateOut';
import type { CMSPageTemplateStatus } from '../models/CMSPageTemplateStatus';
import type { CMSPageTemplateTarget } from '../models/CMSPageTemplateTarget';
import type { CMSPageTemplateUpdate } from '../models/CMSPageTemplateUpdate';
import type { PaginatedCMSPageTemplatesOut } from '../models/PaginatedCMSPageTemplatesOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsTemplatesService {
    /**
     * Admin List Cms Page Templates
     * @returns PaginatedCMSPageTemplatesOut Successful Response
     * @throws ApiError
     */
    public static adminListCmsPageTemplates({
        page = 1,
        pageSize = 20,
        q,
        status,
        target,
        sortBy = 'updated_at',
        sortDir = 'desc',
    }: {
        page?: number,
        pageSize?: number,
        q?: (string | null),
        status?: (CMSPageTemplateStatus | null),
        target?: (CMSPageTemplateTarget | null),
        sortBy?: string,
        sortDir?: string,
    }): CancelablePromise<PaginatedCMSPageTemplatesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/templates',
            query: {
                'page': page,
                'page_size': pageSize,
                'q': q,
                'status': status,
                'target': target,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS page template not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Create Cms Page Template
     * @returns CMSPageTemplateOut Successful Response
     * @throws ApiError
     */
    public static adminCreateCmsPageTemplate({
        requestBody,
    }: {
        requestBody: CMSPageTemplateCreate,
    }): CancelablePromise<CMSPageTemplateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/templates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS page template not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Get Cms Page Template
     * @returns CMSPageTemplateOut Successful Response
     * @throws ApiError
     */
    public static adminGetCmsPageTemplate({
        templateId,
    }: {
        templateId: string,
    }): CancelablePromise<CMSPageTemplateOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms/templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS page template not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Update Cms Page Template
     * @returns CMSPageTemplateOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateCmsPageTemplate({
        templateId,
        requestBody,
    }: {
        templateId: string,
        requestBody: CMSPageTemplateUpdate,
    }): CancelablePromise<CMSPageTemplateOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms/templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS page template not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Archive Cms Page Template
     * @returns void
     * @throws ApiError
     */
    public static adminArchiveCmsPageTemplate({
        templateId,
        expectedVersion,
    }: {
        templateId: string,
        expectedVersion: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms/templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                403: `Permission insuffisante`,
                404: `CMS page template not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Admin Duplicate Cms Page Template
     * @returns CMSPageTemplateOut Successful Response
     * @throws ApiError
     */
    public static adminDuplicateCmsPageTemplate({
        templateId,
        requestBody,
    }: {
        templateId: string,
        requestBody: CMSPageTemplateDuplicateRequest,
    }): CancelablePromise<CMSPageTemplateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms/templates/{template_id}/duplicate',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission insuffisante`,
                404: `CMS page template not found`,
                409: `Version conflict or business conflict`,
                422: `Validation error`,
            },
        });
    }
}
