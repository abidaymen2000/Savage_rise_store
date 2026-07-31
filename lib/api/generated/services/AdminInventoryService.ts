/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InventoryAdjustmentIn } from '../models/InventoryAdjustmentIn';
import type { InventoryFacetsOut } from '../models/InventoryFacetsOut';
import type { InventoryMovementOut } from '../models/InventoryMovementOut';
import type { PaginatedResponse_InventoryItemOut_ } from '../models/PaginatedResponse_InventoryItemOut_';
import type { PaginatedResponse_InventoryMovementOut_ } from '../models/PaginatedResponse_InventoryMovementOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminInventoryService {
    /**
     * Admin List Inventory
     * @returns PaginatedResponse_InventoryItemOut_ Successful Response
     * @throws ApiError
     */
    public static adminListInventoryAdminInventoryGet({
        q,
        productId,
        variantId,
        inventoryItemId,
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
        size,
        color,
        sortBy = 'stock_available',
        sortDir = 'asc',
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        inventoryItemId?: (string | null),
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
        /**
         * Filtre repetable au format cle:valeur, ex: option=color:White
         */
        option?: (Array<string> | null),
        /**
         * Alias deprecie de option=size:<valeur>
         * @deprecated
         */
        size?: (string | null),
        /**
         * Alias deprecie de option=color:<valeur>
         * @deprecated
         */
        color?: (string | null),
        sortBy?: string,
        sortDir?: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_InventoryItemOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/inventory',
            query: {
                'q': q,
                'product_id': productId,
                'variant_id': variantId,
                'inventory_item_id': inventoryItemId,
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
                'size': size,
                'color': color,
                'sort_by': sortBy,
                'sort_dir': sortDir,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Inventory Facets
     * @returns InventoryFacetsOut Successful Response
     * @throws ApiError
     */
    public static adminInventoryFacetsAdminInventoryFacetsGet({
        q,
        productId,
        variantId,
        inventoryItemId,
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
        size,
        color,
    }: {
        q?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        inventoryItemId?: (string | null),
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
        /**
         * Filtre repetable au format cle:valeur, ex: option=color:White
         */
        option?: (Array<string> | null),
        /**
         * Alias deprecie de option=size:<valeur>
         * @deprecated
         */
        size?: (string | null),
        /**
         * Alias deprecie de option=color:<valeur>
         * @deprecated
         */
        color?: (string | null),
    }): CancelablePromise<InventoryFacetsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/inventory/facets',
            query: {
                'q': q,
                'product_id': productId,
                'variant_id': variantId,
                'inventory_item_id': inventoryItemId,
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
                'size': size,
                'color': color,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Adjust Inventory
     * @returns InventoryMovementOut Successful Response
     * @throws ApiError
     */
    public static adminAdjustInventoryAdminInventoryAdjustPost({
        requestBody,
    }: {
        requestBody: InventoryAdjustmentIn,
    }): CancelablePromise<InventoryMovementOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/inventory/adjust',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Inventory Movements
     * @returns PaginatedResponse_InventoryMovementOut_ Successful Response
     * @throws ApiError
     */
    public static adminListInventoryMovementsAdminInventoryMovementsGet({
        productId,
        source,
        page = 1,
        pageSize = 20,
    }: {
        productId?: (string | null),
        source?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_InventoryMovementOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/inventory/movements',
            query: {
                'product_id': productId,
                'source': source,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
