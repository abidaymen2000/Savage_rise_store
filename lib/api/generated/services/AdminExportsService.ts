/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminExportsService {
    /**
     * Export Inventory
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportInventoryAdminExportsInventoryCsvGet({
        q,
        lowStock,
        threshold = 5,
    }: {
        q?: (string | null),
        lowStock?: (boolean | null),
        threshold?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/exports/inventory.csv',
            query: {
                'q': q,
                'low_stock': lowStock,
                'threshold': threshold,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Orders
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportOrdersAdminExportsOrdersCsvGet({
        status,
        email,
        dateFrom,
        dateTo,
    }: {
        status?: (string | null),
        email?: (string | null),
        dateFrom?: (string | null),
        dateTo?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/exports/orders.csv',
            query: {
                'status': status,
                'email': email,
                'date_from': dateFrom,
                'date_to': dateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export Clients
     * @returns any Successful Response
     * @throws ApiError
     */
    public static exportClientsAdminExportsClientsCsvGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/exports/clients.csv',
        });
    }
}
