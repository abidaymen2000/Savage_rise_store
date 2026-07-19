/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CmsPageCreate } from '../models/CmsPageCreate';
import type { CmsPageUpdate } from '../models/CmsPageUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCmsPagesService {
    /**
     * Sidebar CMS de l'admin connecte
     * @returns any Successful Response
     * @throws ApiError
     */
    public static currentAdminSidebarAdminCmsPagesSidebarGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms-pages/sidebar',
        });
    }
    /**
     * Lister les pages CMS
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listAdminCmsPagesAdminCmsPagesGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/cms-pages',
        });
    }
    /**
     * Creer une page CMS / permission
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createAdminCmsPageAdminCmsPagesPost({
        requestBody,
    }: {
        requestBody: CmsPageCreate,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/cms-pages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Modifier une page CMS
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateAdminCmsPageAdminCmsPagesPageIdPatch({
        pageId,
        requestBody,
    }: {
        pageId: string,
        requestBody: CmsPageUpdate,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/cms-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer une page CMS / permission
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteAdminCmsPageAdminCmsPagesPageIdDelete({
        pageId,
    }: {
        pageId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/cms-pages/{page_id}',
            path: {
                'page_id': pageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
