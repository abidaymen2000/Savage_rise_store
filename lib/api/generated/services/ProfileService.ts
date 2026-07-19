/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderOut } from '../models/OrderOut';
import type { PasswordChange } from '../models/PasswordChange';
import type { ReviewOut } from '../models/ReviewOut';
import type { UserOut } from '../models/UserOut';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * Recuperer le profil de l'utilisateur connecte
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static readProfileProfileMeGet(): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/me',
        });
    }
    /**
     * Mettre a jour son profil
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static updateProfileProfileMePatch({
        requestBody,
    }: {
        requestBody: UserUpdate,
    }): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/profile/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Recuperer tous mes avis
     * @returns ReviewOut Successful Response
     * @throws ApiError
     */
    public static getMyReviewsProfileReviewsGet({
        skip,
        limit = 10,
    }: {
        skip?: number,
        limit?: number,
    }): CancelablePromise<Array<ReviewOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/reviews',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Changer son mot de passe
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changePasswordProfileChangePasswordPost({
        requestBody,
    }: {
        requestBody: PasswordChange,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/profile/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Historique des commandes de l'utilisateur
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static listMyOrdersProfileOrdersGet(): CancelablePromise<Array<OrderOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/orders',
        });
    }
    /**
     * Recuperer une de ses commandes par son ID
     * @returns OrderOut Successful Response
     * @throws ApiError
     */
    public static profileGetOneOrderProfileOrdersOrderIdGet({
        orderId,
    }: {
        /**
         * ID de la commande
         */
        orderId: string,
    }): CancelablePromise<OrderOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/profile/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
