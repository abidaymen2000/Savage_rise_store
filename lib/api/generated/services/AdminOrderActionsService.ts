/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderActionReasonIn } from '../models/OrderActionReasonIn';
import type { OrderAssignIn } from '../models/OrderAssignIn';
import type { OrderNoteIn } from '../models/OrderNoteIn';
import type { OrderNoteOut } from '../models/OrderNoteOut';
import type { OrderOut } from '../models/OrderOut';
import type { OrderRefundIn } from '../models/OrderRefundIn';
import type { OrderTagsIn } from '../models/OrderTagsIn';
import type { OrderTimelineEventOut } from '../models/OrderTimelineEventOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminOrderActionsService {
    /**
     * Lire une commande par son ID
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static apiGetOrderAdminOrdersOrderIdGet({
        orderId,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
    }): CancelablePromise<OrderOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmer une commande
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiConfirmOrderAdminOrdersOrderIdConfirmPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/confirm',
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
    /**
     * Passer une commande en preparation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiPrepareOrderAdminOrdersOrderIdPreparePost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/prepare',
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
    /**
     * Expedier une commande
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiShipOrderAdminOrdersOrderIdShipPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/ship',
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
    /**
     * Marquer une commande comme livree
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiDeliverOrderAdminOrdersOrderIdDeliverPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/deliver',
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
    /**
     * Annuler une commande
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiCancelOrderAdminOrdersOrderIdCancelPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/cancel',
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
    /**
     * Marquer une commande comme refusee
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRefuseOrderAdminOrdersOrderIdRefusePost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/refuse',
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
    /**
     * Marquer la commande comme payee
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static apiMarkPaidAdminOrdersOrderIdMarkPaidPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<OrderOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/mark-paid',
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
    /**
     * Demander un retour
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRequestReturnAdminOrdersOrderIdRequestReturnPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/request-return',
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
    /**
     * Retour en transit
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiReturnInTransitAdminOrdersOrderIdReturnInTransitPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/return-in-transit',
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
    /**
     * Retour recu
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiReceiveReturnAdminOrdersOrderIdReceiveReturnPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/receive-return',
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
    /**
     * Remettre en stock un retour revendable
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRestockReturnAdminOrdersOrderIdRestockReturnPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/restock-return',
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
    /**
     * Marquer un retour comme non revendable
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiMarkReturnDamagedAdminOrdersOrderIdMarkReturnDamagedPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: (OrderActionReasonIn | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/mark-return-damaged',
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
    /**
     * Rembourser une commande
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRefundOrderAdminOrdersOrderIdRefundPost({
        orderId,
        requestBody,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
        requestBody: OrderRefundIn,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/refund',
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
    /**
     * Api Add Order Note
     * @returns OrderNoteOut Successful Response
     * @throws ApiError
     */
    public static apiAddOrderNoteAdminOrdersOrderIdNotesPost({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: OrderNoteIn,
    }): CancelablePromise<OrderNoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/orders/{order_id}/notes',
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
    /**
     * Api List Order Notes
     * @returns OrderNoteOut Successful Response
     * @throws ApiError
     */
    public static apiListOrderNotesAdminOrdersOrderIdNotesGet({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Array<OrderNoteOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/orders/{order_id}/notes',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Set Order Tags
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiSetOrderTagsAdminOrdersOrderIdTagsPatch({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: OrderTagsIn,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/orders/{order_id}/tags',
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
    /**
     * Api Assign Order
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAssignOrderAdminOrdersOrderIdAssignPatch({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: OrderAssignIn,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/orders/{order_id}/assign',
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
    /**
     * Api Order Timeline
     * @returns OrderTimelineEventOut Successful Response
     * @throws ApiError
     */
    public static apiOrderTimelineAdminOrdersOrderIdTimelineGet({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Array<OrderTimelineEventOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/orders/{order_id}/timeline',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
