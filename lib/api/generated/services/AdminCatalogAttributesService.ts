/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttributeCreate } from '../models/AttributeCreate';
import type { AttributeOptionCreate } from '../models/AttributeOptionCreate';
import type { AttributeOptionRead } from '../models/AttributeOptionRead';
import type { AttributeRead } from '../models/AttributeRead';
import type { AttributeUpdate } from '../models/AttributeUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCatalogAttributesService {
    /**
     * List Attributes
     * @returns AttributeRead Successful Response
     * @throws ApiError
     */
    public static listAttributesAdminCatalogAttributesGet({
        isActive,
    }: {
        isActive?: (boolean | null),
    }): CancelablePromise<Array<AttributeRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/attributes',
            query: {
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Attribute
     * @returns AttributeRead Successful Response
     * @throws ApiError
     */
    public static createAttributeAdminCatalogAttributesPost({
        requestBody,
    }: {
        requestBody: AttributeCreate,
    }): CancelablePromise<AttributeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/attributes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Attribute
     * @returns AttributeRead Successful Response
     * @throws ApiError
     */
    public static getAttributeAdminCatalogAttributesAttributeIdGet({
        attributeId,
    }: {
        attributeId: string,
    }): CancelablePromise<AttributeRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/attributes/{attribute_id}',
            path: {
                'attribute_id': attributeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Attribute
     * @returns AttributeRead Successful Response
     * @throws ApiError
     */
    public static updateAttributeAdminCatalogAttributesAttributeIdPatch({
        attributeId,
        requestBody,
    }: {
        attributeId: string,
        requestBody: AttributeUpdate,
    }): CancelablePromise<AttributeRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/attributes/{attribute_id}',
            path: {
                'attribute_id': attributeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Activate Attribute
     * @returns AttributeRead Successful Response
     * @throws ApiError
     */
    public static activateAttributeAdminCatalogAttributesAttributeIdActivatePost({
        attributeId,
    }: {
        attributeId: string,
    }): CancelablePromise<AttributeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/attributes/{attribute_id}/activate',
            path: {
                'attribute_id': attributeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deactivate Attribute
     * @returns AttributeRead Successful Response
     * @throws ApiError
     */
    public static deactivateAttributeAdminCatalogAttributesAttributeIdDeactivatePost({
        attributeId,
    }: {
        attributeId: string,
    }): CancelablePromise<AttributeRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/attributes/{attribute_id}/deactivate',
            path: {
                'attribute_id': attributeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Attribute Values
     * @returns AttributeOptionRead Successful Response
     * @throws ApiError
     */
    public static listAttributeValuesAdminCatalogAttributesAttributeIdValuesGet({
        attributeId,
    }: {
        attributeId: string,
    }): CancelablePromise<Array<AttributeOptionRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/attributes/{attribute_id}/values',
            path: {
                'attribute_id': attributeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Attribute Value
     * @returns AttributeOptionRead Successful Response
     * @throws ApiError
     */
    public static createAttributeValueAdminCatalogAttributesAttributeIdValuesPost({
        attributeId,
        requestBody,
    }: {
        attributeId: string,
        requestBody: AttributeOptionCreate,
    }): CancelablePromise<AttributeOptionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/attributes/{attribute_id}/values',
            path: {
                'attribute_id': attributeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Attribute Value
     * @returns AttributeOptionRead Successful Response
     * @throws ApiError
     */
    public static updateAttributeValueAdminCatalogAttributeValuesValueIdPatch({
        valueId,
        requestBody,
    }: {
        valueId: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<AttributeOptionRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/attribute-values/{value_id}',
            path: {
                'value_id': valueId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archive Attribute Value
     * @returns AttributeOptionRead Successful Response
     * @throws ApiError
     */
    public static archiveAttributeValueAdminCatalogAttributeValuesValueIdArchivePost({
        valueId,
    }: {
        valueId: string,
    }): CancelablePromise<AttributeOptionRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/attribute-values/{value_id}/archive',
            path: {
                'value_id': valueId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
