/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_adminCatalogUploadMediaAssets } from '../models/Body_adminCatalogUploadMediaAssets';
import type { CatalogMediaAssetRead } from '../models/CatalogMediaAssetRead';
import type { CatalogMediaAssetUploadResponse } from '../models/CatalogMediaAssetUploadResponse';
import type { CatalogMediaAssignmentCreate } from '../models/CatalogMediaAssignmentCreate';
import type { CatalogMediaAssignmentCreateResponse } from '../models/CatalogMediaAssignmentCreateResponse';
import type { CatalogMediaAssignmentPatch } from '../models/CatalogMediaAssignmentPatch';
import type { CatalogMediaAssignmentRead } from '../models/CatalogMediaAssignmentRead';
import type { CatalogMediaRegister } from '../models/CatalogMediaRegister';
import type { CatalogMediaTarget } from '../models/CatalogMediaTarget';
import type { CatalogMediaTargetPreviewResponse } from '../models/CatalogMediaTargetPreviewResponse';
import type { CatalogMediaUploadAuth } from '../models/CatalogMediaUploadAuth';
import type { CatalogResolvedVariantMedia } from '../models/CatalogResolvedVariantMedia';
import type { PaginatedResponse_ProductListItem_ } from '../models/PaginatedResponse_ProductListItem_';
import type { ProductCreate } from '../models/ProductCreate';
import type { ProductOptionAxisWrite } from '../models/ProductOptionAxisWrite';
import type { ProductOptionsRead } from '../models/ProductOptionsRead';
import type { ProductRead } from '../models/ProductRead';
import type { ProductUpdate } from '../models/ProductUpdate';
import type { ProductVariantCreate } from '../models/ProductVariantCreate';
import type { ProductVariantGenerationRequest } from '../models/ProductVariantGenerationRequest';
import type { ProductVariantRead } from '../models/ProductVariantRead';
import type { ProductVariantUpdate } from '../models/ProductVariantUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCatalogProductsService {
    /**
     * List Products
     * @returns PaginatedResponse_ProductListItem_ Successful Response
     * @throws ApiError
     */
    public static listProductsAdminCatalogProductsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ProductListItem_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/products',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static createProductAdminCatalogProductsPost({
        requestBody,
    }: {
        requestBody: ProductCreate,
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static getProductAdminCatalogProductsProductIdGet({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/products/{product_id}',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static updateProductAdminCatalogProductsProductIdPatch({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: ProductUpdate,
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/products/{product_id}',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Activate Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static activateProductAdminCatalogProductsProductIdActivatePost({
        productId,
        expectedVersion,
    }: {
        productId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/activate',
            path: {
                'product_id': productId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deactivate Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static deactivateProductAdminCatalogProductsProductIdDeactivatePost({
        productId,
        expectedVersion,
    }: {
        productId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/deactivate',
            path: {
                'product_id': productId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archive Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static archiveProductAdminCatalogProductsProductIdArchivePost({
        productId,
        expectedVersion,
    }: {
        productId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/archive',
            path: {
                'product_id': productId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Restore Product
     * @returns ProductRead Successful Response
     * @throws ApiError
     */
    public static restoreProductAdminCatalogProductsProductIdRestorePost({
        productId,
        expectedVersion,
    }: {
        productId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/restore',
            path: {
                'product_id': productId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Product Options
     * @returns ProductOptionsRead Successful Response
     * @throws ApiError
     */
    public static getProductOptionsAdminCatalogProductsProductIdOptionsGet({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<ProductOptionsRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/products/{product_id}/options',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Product Options
     * @returns ProductOptionsRead Successful Response
     * @throws ApiError
     */
    public static setProductOptionsAdminCatalogProductsProductIdOptionsPut({
        productId,
        requestBody,
        expectedVersion,
    }: {
        productId: string,
        requestBody: Array<ProductOptionAxisWrite>,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductOptionsRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/catalog/products/{product_id}/options',
            path: {
                'product_id': productId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Variants
     * @returns ProductVariantRead Successful Response
     * @throws ApiError
     */
    public static listVariantsAdminCatalogProductsProductIdVariantsGet({
        productId,
    }: {
        productId: string,
    }): CancelablePromise<Array<ProductVariantRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/products/{product_id}/variants',
            path: {
                'product_id': productId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Variant
     * @returns ProductVariantRead Successful Response
     * @throws ApiError
     */
    public static createVariantAdminCatalogProductsProductIdVariantsPost({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: ProductVariantCreate,
    }): CancelablePromise<ProductVariantRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/variants',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Variants
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateVariantsAdminCatalogProductsProductIdVariantsGeneratePost({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: ProductVariantGenerationRequest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/variants/generate',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Catalog Media Assets
     * @returns CatalogMediaAssetUploadResponse Successful Response
     * @throws ApiError
     */
    public static adminCatalogUploadMediaAssets({
        formData,
    }: {
        formData: Body_adminCatalogUploadMediaAssets,
    }): CancelablePromise<CatalogMediaAssetUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/media/assets/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Catalog Media Upload Auth
     * @returns CatalogMediaUploadAuth Successful Response
     * @throws ApiError
     */
    public static adminCatalogGetMediaUploadAuth(): CancelablePromise<CatalogMediaUploadAuth> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/media/upload-auth',
        });
    }
    /**
     * Register Catalog Media
     * @returns CatalogMediaAssetRead Successful Response
     * @throws ApiError
     */
    public static adminCatalogRegisterMedia({
        requestBody,
    }: {
        requestBody: CatalogMediaRegister,
    }): CancelablePromise<CatalogMediaAssetRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/media/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assign Product Media
     * @returns CatalogMediaAssignmentCreateResponse Successful Response
     * @throws ApiError
     */
    public static adminCatalogAssignProductMedia({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: CatalogMediaAssignmentCreate,
    }): CancelablePromise<CatalogMediaAssignmentCreateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/media-assignments',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Product Media Assignments
     * @returns CatalogMediaAssignmentRead Successful Response
     * @throws ApiError
     */
    public static adminCatalogListProductMediaAssignments({
        productId,
        scope,
        variantId,
        assetId,
    }: {
        productId: string,
        scope?: ('product' | 'option_selector' | 'variant' | null),
        variantId?: (string | null),
        assetId?: (string | null),
    }): CancelablePromise<Array<CatalogMediaAssignmentRead>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/products/{product_id}/media-assignments',
            path: {
                'product_id': productId,
            },
            query: {
                'scope': scope,
                'variant_id': variantId,
                'asset_id': assetId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview Product Media Target
     * @returns CatalogMediaTargetPreviewResponse Successful Response
     * @throws ApiError
     */
    public static adminCatalogPreviewMediaTarget({
        productId,
        requestBody,
    }: {
        productId: string,
        requestBody: CatalogMediaTarget,
    }): CancelablePromise<CatalogMediaTargetPreviewResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/products/{product_id}/media-targets/preview',
            path: {
                'product_id': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Media Assignment
     * @returns CatalogMediaAssignmentRead Successful Response
     * @throws ApiError
     */
    public static adminCatalogUpdateMediaAssignment({
        assignmentId,
        requestBody,
    }: {
        assignmentId: string,
        requestBody: CatalogMediaAssignmentPatch,
    }): CancelablePromise<CatalogMediaAssignmentRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/media-assignments/{assignment_id}',
            path: {
                'assignment_id': assignmentId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Media Assignment
     * @returns void
     * @throws ApiError
     */
    public static adminCatalogDeleteMediaAssignment({
        assignmentId,
    }: {
        assignmentId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/catalog/media-assignments/{assignment_id}',
            path: {
                'assignment_id': assignmentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Variant
     * @returns ProductVariantRead Successful Response
     * @throws ApiError
     */
    public static getVariantAdminCatalogVariantsVariantIdGet({
        variantId,
    }: {
        variantId: string,
    }): CancelablePromise<ProductVariantRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/variants/{variant_id}',
            path: {
                'variant_id': variantId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Variant
     * @returns ProductVariantRead Successful Response
     * @throws ApiError
     */
    public static updateVariantAdminCatalogVariantsVariantIdPatch({
        variantId,
        requestBody,
    }: {
        variantId: string,
        requestBody: ProductVariantUpdate,
    }): CancelablePromise<ProductVariantRead> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/catalog/variants/{variant_id}',
            path: {
                'variant_id': variantId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Variant Resolved Media
     * @returns CatalogResolvedVariantMedia Successful Response
     * @throws ApiError
     */
    public static adminCatalogResolveVariantMedia({
        variantId,
    }: {
        variantId: string,
    }): CancelablePromise<CatalogResolvedVariantMedia> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/catalog/variants/{variant_id}/resolved-media',
            path: {
                'variant_id': variantId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archive Variant
     * @returns ProductVariantRead Successful Response
     * @throws ApiError
     */
    public static archiveVariantAdminCatalogVariantsVariantIdArchivePost({
        variantId,
        expectedVersion,
    }: {
        variantId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductVariantRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/variants/{variant_id}/archive',
            path: {
                'variant_id': variantId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Restore Variant
     * @returns ProductVariantRead Successful Response
     * @throws ApiError
     */
    public static restoreVariantAdminCatalogVariantsVariantIdRestorePost({
        variantId,
        expectedVersion,
    }: {
        variantId: string,
        expectedVersion?: (number | null),
    }): CancelablePromise<ProductVariantRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/catalog/variants/{variant_id}/restore',
            path: {
                'variant_id': variantId,
            },
            query: {
                'expected_version': expectedVersion,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
