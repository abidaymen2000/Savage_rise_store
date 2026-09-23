/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MetaCatalogService {
    /**
     * Flux CSV catalogue Meta multi-tenant
     * @returns string Flux CSV catalogue Meta
     * @throws ApiError
     */
    public static metaCatalogCsvForCompanyMetaCompanySlugCatalogCsvGet({
        companySlug,
        includeOutOfStock = true,
        includeMissingImages = false,
    }: {
        companySlug: string,
        /**
         * Inclure les articles hors stock dans le feed Meta
         */
        includeOutOfStock?: boolean,
        /**
         * Inclure les lignes sans image_link
         */
        includeMissingImages?: boolean,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/meta/{company_slug}/catalog.csv',
            path: {
                'company_slug': companySlug,
            },
            query: {
                'include_out_of_stock': includeOutOfStock,
                'include_missing_images': includeMissingImages,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
