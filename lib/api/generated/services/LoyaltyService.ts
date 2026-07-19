/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoyaltyBalanceOut } from '../models/LoyaltyBalanceOut';
import type { LoyaltyQuoteIn } from '../models/LoyaltyQuoteIn';
import type { LoyaltyQuoteOut } from '../models/LoyaltyQuoteOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoyaltyService {
    /**
     * Get My Loyalty Balance
     * @returns LoyaltyBalanceOut Successful Response
     * @throws ApiError
     */
    public static getMyLoyaltyBalanceLoyaltyMeGet({
        limit = 10,
    }: {
        limit?: number,
    }): CancelablePromise<LoyaltyBalanceOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/loyalty/me',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Quote Loyalty Redemption
     * @returns LoyaltyQuoteOut Successful Response
     * @throws ApiError
     */
    public static quoteLoyaltyRedemptionLoyaltyQuotePost({
        requestBody,
    }: {
        requestBody: LoyaltyQuoteIn,
    }): CancelablePromise<LoyaltyQuoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/loyalty/quote',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
