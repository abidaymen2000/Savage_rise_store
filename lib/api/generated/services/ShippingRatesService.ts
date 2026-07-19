/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ShippingQuoteRequest } from '../models/ShippingQuoteRequest';
import type { ShippingQuoteResponse } from '../models/ShippingQuoteResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ShippingRatesService {
    /**
     * Quote Shipping Rate
     * @returns ShippingQuoteResponse Successful Response
     * @throws ApiError
     */
    public static quoteShippingRateShippingRatesQuotePost({
        requestBody,
    }: {
        requestBody: ShippingQuoteRequest,
    }): CancelablePromise<ShippingQuoteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shipping-rates/quote',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
