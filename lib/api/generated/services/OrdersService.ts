/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderActionReasonIn } from '../models/OrderActionReasonIn';
import type { OrderCreate } from '../models/OrderCreate';
import type { OrderOut } from '../models/OrderOut';
import type { OrderQuoteOut } from '../models/OrderQuoteOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Calculer les totaux commande sans reserver stock ni promo
     * @returns OrderQuoteOut Successful Response
     * @throws ApiError
     */
    public static apiQuoteOrderOrdersQuotePost({
        requestBody,
    }: {
        requestBody: OrderCreate,
    }): CancelablePromise<OrderQuoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/quote',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Order
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static apiCreateOrderOrdersPost({
        idempotencyKey,
        requestBody,
    }: {
        /**
         * Cle d'idempotence obligatoire pour la creation de commande
         */
        idempotencyKey: string,
        requestBody: OrderCreate,
    }): CancelablePromise<OrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/orders/',
            headers: {
                'Idempotency-Key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Idempotency-Key manquant ou payload invalide`,
                409: `Conflit d'idempotence: payload different ou requete deja en cours`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Permet au client d'annuler sa commande si elle est encore en pending
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static apiCancelOrderOrdersOrderIdCancelPatch({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande a annuler
         */
        orderId: string,
        requestBody?: (OrderActionReasonIn | null),
    }): CancelablePromise<OrderOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/orders/{order_id}/cancel',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
