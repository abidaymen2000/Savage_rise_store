/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosLimits } from '../models/PosLimits';
import type { PosRecord } from '../models/PosRecord';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlatformPosService {
    /**
     * Limits
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static limitsPlatformCompaniesCompanyIdPosLimitsGet({
        companyId,
    }: {
        companyId: string,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/platform/companies/{company_id}/pos/limits',
            path: {
                'company_id': companyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Save Limits
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static saveLimitsPlatformCompaniesCompanyIdPosLimitsPut({
        companyId,
        idempotencyKey,
        requestBody,
    }: {
        companyId: string,
        idempotencyKey: string,
        requestBody: PosLimits,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/platform/companies/{company_id}/pos/limits',
            path: {
                'company_id': companyId,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
