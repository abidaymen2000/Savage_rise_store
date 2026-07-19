/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedResponse_PromoOut_ } from '../models/PaginatedResponse_PromoOut_';
import type { PromoCreate } from '../models/PromoCreate';
import type { PromoOut } from '../models/PromoOut';
import type { PromoUpdate } from '../models/PromoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPromocodesService {
    /**
     * Creer un code promo (admin)
     * @returns PromoOut Successful Response
     * @throws ApiError
     */
    public static createPromoPromocodesPost({
        requestBody,
    }: {
        requestBody: PromoCreate,
    }): CancelablePromise<PromoOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promocodes/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les codes promo (admin)
     * @returns PromoOut Successful Response
     * @throws ApiError
     */
    public static listPromosPromocodesGet({
        skip,
        limit = 50,
        q,
    }: {
        skip?: number,
        limit?: number,
        q?: (string | null),
    }): CancelablePromise<Array<PromoOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/promocodes/',
            query: {
                'skip': skip,
                'limit': limit,
                'q': q,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lister les codes promo pagines (admin)
     * @returns PaginatedResponse_PromoOut_ Successful Response
     * @throws ApiError
     */
    public static listPromosPagePromocodesPageGet({
        q,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PromoOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/promocodes/page',
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lire un code promo (admin)
     * @returns PromoOut Successful Response
     * @throws ApiError
     */
    public static getPromoPromocodesPromoIdGet({
        promoId,
    }: {
        promoId: string,
    }): CancelablePromise<PromoOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/promocodes/{promo_id}',
            path: {
                'promo_id': promoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mettre a jour un code promo (admin)
     * @returns PromoOut Successful Response
     * @throws ApiError
     */
    public static updatePromoPromocodesPromoIdPatch({
        promoId,
        requestBody,
    }: {
        promoId: string,
        requestBody: PromoUpdate,
    }): CancelablePromise<PromoOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/promocodes/{promo_id}',
            path: {
                'promo_id': promoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Supprimer un code promo (admin)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deletePromoPromocodesPromoIdDelete({
        promoId,
    }: {
        promoId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/promocodes/{promo_id}',
            path: {
                'promo_id': promoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Activer un code promo (admin)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static activatePromocodePromocodesPromoIdActivatePatch({
        promoId,
    }: {
        promoId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/promocodes/{promo_id}/activate',
            path: {
                'promo_id': promoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Desactiver un code promo (admin)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deactivatePromocodePromocodesPromoIdDeactivatePatch({
        promoId,
    }: {
        promoId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/promocodes/{promo_id}/deactivate',
            path: {
                'promo_id': promoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Changer le statut actif/inactif (admin)
     * @returns any Successful Response
     * @throws ApiError
     */
    public static setPromocodeStatusPromocodesPromoIdStatusPatch({
        promoId,
        isActive,
    }: {
        promoId: string,
        /**
         * true=activer, false=desactiver
         */
        isActive: boolean,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/promocodes/{promo_id}/status',
            path: {
                'promo_id': promoId,
            },
            query: {
                'is_active': isActive,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
