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
        productId,
        variantId,
        productStatus,
        variantStatus,
        productKind,
        categoryId,
        trackInventory,
        includeArchived = false,
        stockState = 'all',
        lowStock,
        threshold = 5,
        stockOnHandMin,
        stockOnHandMax,
        stockReservedMin,
        stockReservedMax,
        stockAvailableMin,
        stockAvailableMax,
        hasReservations,
        option,
        sortBy = 'stock_available',
        sortDir = 'asc',
    }: {
        q?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        productStatus?: (string | null),
        variantStatus?: (string | null),
        productKind?: (string | null),
        categoryId?: (string | null),
        trackInventory?: (boolean | null),
        includeArchived?: boolean,
        stockState?: string,
        lowStock?: (boolean | null),
        threshold?: number,
        stockOnHandMin?: (number | null),
        stockOnHandMax?: (number | null),
        stockReservedMin?: (number | null),
        stockReservedMax?: (number | null),
        stockAvailableMin?: (number | null),
        stockAvailableMax?: (number | null),
        hasReservations?: (boolean | null),
        option?: (Array<string> | null),
        sortBy?: string,
        sortDir?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/exports/inventory.csv',
            query: {
                'q': q,
                'product_id': productId,
                'variant_id': variantId,
                'product_status': productStatus,
                'variant_status': variantStatus,
                'product_kind': productKind,
                'category_id': categoryId,
                'track_inventory': trackInventory,
                'include_archived': includeArchived,
                'stock_state': stockState,
                'low_stock': lowStock,
                'threshold': threshold,
                'stock_on_hand_min': stockOnHandMin,
                'stock_on_hand_max': stockOnHandMax,
                'stock_reserved_min': stockReservedMin,
                'stock_reserved_max': stockReservedMax,
                'stock_available_min': stockAvailableMin,
                'stock_available_max': stockAvailableMax,
                'has_reservations': hasReservations,
                'option': option,
                'sort_by': sortBy,
                'sort_dir': sortDir,
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
