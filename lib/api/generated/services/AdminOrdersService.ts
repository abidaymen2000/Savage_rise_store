/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_OrderOut_ } from '../models/PaginatedResponse_OrderOut_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminOrdersService {
    /**
     * Lister toutes les commandes (admin)
     * @returns PaginatedResponse_OrderOut_ Successful Response
     * @throws ApiError
     */
    public static adminListOrdersAdminOrdersGet({
        page = 1,
        pageSize = 20,
        status,
        email,
        paymentStatus,
        paymentMethod,
        fulfillmentStatus,
        isPaid,
        productId,
        variantId,
        assignedAdminId,
        dateFrom,
        dateTo,
        sortBy = '_id',
        sortDir = 'desc',
    }: {
        page?: number,
        pageSize?: number,
        /**
         * Filtrer par statut
         */
        status?: (string | null),
        /**
         * Filtrer par email client (exact ou partiel)
         */
        email?: (string | null),
        /**
         * Filtrer par statut de paiement
         */
        paymentStatus?: (string | null),
        /**
         * Filtrer par methode de paiement
         */
        paymentMethod?: (string | null),
        /**
         * Filtrer par statut logistique
         */
        fulfillmentStatus?: (string | null),
        /**
         * Filtrer par etat de paiement calcule
         */
        isPaid?: (boolean | null),
        /**
         * Filtrer par produit contenu dans la commande
         */
        productId?: (string | null),
        /**
         * Filtrer par variante contenue dans la commande
         */
        variantId?: (string | null),
        /**
         * Filtrer par admin assigne
         */
        assignedAdminId?: (string | null),
        /**
         * ISO date/time (incluse)
         */
        dateFrom?: (string | null),
        /**
         * ISO date/time (incluse)
         */
        dateTo?: (string | null),
        sortBy?: 'created_at' | '_id' | 'total_amount',
        sortDir?: 'asc' | 'desc',
    }): CancelablePromise<PaginatedResponse_OrderOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/orders/',
            query: {
                'page': page,
                'page_size': pageSize,
                'status': status,
                'email': email,
                'payment_status': paymentStatus,
                'payment_method': paymentMethod,
                'fulfillment_status': fulfillmentStatus,
                'is_paid': isPaid,
                'product_id': productId,
                'variant_id': variantId,
                'assigned_admin_id': assignedAdminId,
                'date_from': dateFrom,
                'date_to': dateTo,
                'sort_by': sortBy,
                'sort_dir': sortDir,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
