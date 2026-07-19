/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeSetCreate } from '../models/AttributeSetCreate';
import type { AttributeSetRead } from '../models/AttributeSetRead';
import type { AttributeSetUpdate } from '../models/AttributeSetUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCatalogAttributeSetsService {
    /**
     * List Attribute Sets
     * @returns AttributeSetRead Successful Response
     * @throws ApiError
     */
    public static listAttributeSetsAdminCatalogAttributeSetsGet(): CancelablePromise<Array<AttributeSetRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/attribute-sets',
        });
    }
    /**
     * Create Attribute Set
     * @returns AttributeSetRead Successful Response
     * @throws ApiError
     */
    public static createAttributeSetAdminCatalogAttributeSetsPost({
        requestBody,
    }: {
        requestBody: AttributeSetCreate,
    }): CancelablePromise<AttributeSetRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/attribute-sets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Attribute Set
     * @returns AttributeSetRead Successful Response
     * @throws ApiError
     */
    public static getAttributeSetAdminCatalogAttributeSetsAttributeSetIdGet({
        attributeSetId,
    }: {
        attributeSetId: string,
    }): CancelablePromise<AttributeSetRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/attribute-sets/{attribute_set_id}',
            path: {
                'attribute_set_id': attributeSetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Attribute Set
     * @returns AttributeSetRead Successful Response
     * @throws ApiError
     */
    public static updateAttributeSetAdminCatalogAttributeSetsAttributeSetIdPatch({
        attributeSetId,
        requestBody,
    }: {
        attributeSetId: string,
        requestBody: AttributeSetUpdate,
    }): CancelablePromise<AttributeSetRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/attribute-sets/{attribute_set_id}',
            path: {
                'attribute_set_id': attributeSetId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
