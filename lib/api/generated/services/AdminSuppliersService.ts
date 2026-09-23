/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_SupplierOut_ } from '../models/PaginatedResponse_SupplierOut_';
import type { SupplierCreate } from '../models/SupplierCreate';
import type { SupplierOut } from '../models/SupplierOut';
import type { SupplierUpdate } from '../models/SupplierUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminSuppliersService {
    /**
     * Api List Suppliers
     * @returns PaginatedResponse_SupplierOut_ Successful Response
     * @throws ApiError
     */
    public static apiListSuppliersAdminSuppliersGet({
        q,
        status,
        currency,
        isArchived = false,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        status?: (string | null),
        currency?: (string | null),
        isArchived?: boolean,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_SupplierOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/suppliers',
            query: {
                'q': q,
                'status': status,
                'currency': currency,
                'is_archived': isArchived,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Supplier
     * @returns SupplierOut Successful Response
     * @throws ApiError
     */
    public static apiCreateSupplierAdminSuppliersPost({
        requestBody,
    }: {
        requestBody: SupplierCreate,
    }): CancelablePromise<SupplierOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/suppliers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Supplier
     * @returns SupplierOut Successful Response
     * @throws ApiError
     */
    public static apiGetSupplierAdminSuppliersSupplierIdGet({
        supplierId,
    }: {
        supplierId: string,
    }): CancelablePromise<SupplierOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/suppliers/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Supplier
     * @returns SupplierOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateSupplierAdminSuppliersSupplierIdPatch({
        supplierId,
        requestBody,
    }: {
        supplierId: string,
        requestBody: SupplierUpdate,
    }): CancelablePromise<SupplierOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/suppliers/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Supplier
     * @returns SupplierOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveSupplierAdminSuppliersSupplierIdDelete({
        supplierId,
    }: {
        supplierId: string,
    }): CancelablePromise<SupplierOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/suppliers/{supplier_id}',
            path: {
                'supplier_id': supplierId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
