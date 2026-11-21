/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminManualOrderCreate } from '../models/AdminManualOrderCreate';
import type { OrderAdminPage } from '../models/OrderAdminPage';
import type { OrderOut } from '../models/OrderOut';
import type { OrderPrintIn } from '../models/OrderPrintIn';
import type { OrderQuoteOut } from '../models/OrderQuoteOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminOrdersService {
    /**
     * Generer des bons logistiques PDF (1-50 commandes)
     * @returns binary PDF de bons logistiques
     * @throws ApiError
     */
    public static adminPrintOrdersAdminOrdersPrintPost({
        requestBody,
    }: {
        requestBody: OrderPrintIn,
    }): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/print',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Permission orders.read/orders requise`,
                404: `Une commande est introuvable dans l'entreprise active`,
                422: `Lot ou type de document invalide`,
            },
        });
    }
    /**
     * Calculer une commande manuelle ERP sans enregistrer ni reserver
     * @returns OrderQuoteOut Successful Response
     * @throws ApiError
     */
    public static adminQuoteOrderAdminOrdersQuotePost({
        requestBody,
    }: {
        requestBody: AdminManualOrderCreate,
    }): CancelablePromise<OrderQuoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/quote',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Aucune societe active ou permission insuffisante`,
                404: `Produit ou variante introuvable dans la societe active`,
                409: `Stock insuffisant`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Creer une commande manuelle ERP
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static adminCreateOrderAdminOrdersPost({
        idempotencyKey,
        requestBody,
    }: {
        /**
         * Cle d'idempotence obligatoire pour la creation de commande
         */
        idempotencyKey: string,
        requestBody: AdminManualOrderCreate,
    }): CancelablePromise<OrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Idempotency-Key manquant ou payload invalide`,
                403: `Aucune societe active ou permission insuffisante`,
                404: `Produit ou variante introuvable dans la societe active`,
                409: `Stock insuffisant ou conflit d'idempotence`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Rechercher et paginer les commandes (admin)
     * @returns OrderAdminPage Page, total et synthese globale
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
        q,
        orderStatuses,
        paymentStatuses,
        fulfillmentStatuses,
        view = 'all',
        cursor,
        includeSummary = true,
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
        paymentMethod?: ('cod' | 'stripe' | 'paypal' | null),
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
        /**
         * Recherche litterale sur reference, client, livraison et articles
         */
        q?: (string | null),
        /**
         * Statuts commande repetables; intersection avec status
         */
        orderStatuses?: Array<string>,
        /**
         * Statuts paiement repetables; intersection avec payment_status
         */
        paymentStatuses?: Array<string>,
        /**
         * Statuts logistiques repetables; intersection avec fulfillment_status
         */
        fulfillmentStatuses?: Array<string>,
        view?: 'all' | 'pending' | 'prepare' | 'ship' | 'delivery' | 'delivered_unpaid' | 'delivered' | 'returns' | 'cancelled' | 'confirmed' | 'preparing' | 'shipped' | 'to_collect' | 'cancellations',
        /**
         * Curseur opaque lie a l'entreprise, aux filtres, a la vue et au tri. Page est ignoree si present.
         */
        cursor?: (string | null),
        /**
         * Calculer les compteurs et KPI; false accelere les pages suivantes
         */
        includeSummary?: boolean,
    }): CancelablePromise<OrderAdminPage> {
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
                'q': q,
                'order_statuses': orderStatuses,
                'payment_statuses': paymentStatuses,
                'fulfillment_statuses': fulfillmentStatuses,
                'view': view,
                'cursor': cursor,
                'include_summary': includeSummary,
            },
            errors: {
                403: `Entreprise active ou permission orders.read/orders requise`,
                422: `Filtre, date ou curseur invalide`,
            },
        });
    }
}
