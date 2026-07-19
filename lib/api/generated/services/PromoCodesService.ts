/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApplyRequest } from '../models/ApplyRequest';
import type { ApplyResponse } from '../models/ApplyResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PromoCodesService {
    /**
     * Verifier/appliquer un code promo (public)
     * @returns ApplyResponse Successful Response
     * @throws ApiError
     */
    public static applyCodePromocodesApplyPost({
        requestBody,
    }: {
        requestBody: ApplyRequest,
    }): CancelablePromise<ApplyResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/promocodes/apply',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
