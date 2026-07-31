/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompanyCreate } from '../models/CompanyCreate';
import type { CompanyModulesUpdate } from '../models/CompanyModulesUpdate';
import type { CompanyPermissionsResponse } from '../models/CompanyPermissionsResponse';
import type { CompanyPermissionsUpdate } from '../models/CompanyPermissionsUpdate';
import type { CompanyPublic } from '../models/CompanyPublic';
import type { CompanyStatusUpdate } from '../models/CompanyStatusUpdate';
import type { CompanyUpdate } from '../models/CompanyUpdate';
import type { ErpAccountCreate } from '../models/ErpAccountCreate';
import type { ErpAccountPublic } from '../models/ErpAccountPublic';
import type { ErpAccountUpdate } from '../models/ErpAccountUpdate';
import type { PlatformPermissionsResponse } from '../models/PlatformPermissionsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlatformService {
    /**
     * List Companies
     * @returns CompanyPublic Successful Response
     * @throws ApiError
     */
    public static listCompaniesPlatformCompaniesGet(): CancelablePromise<Array<CompanyPublic>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/platform/companies',
        });
    }
    /**
     * Create Company
     * @returns CompanyPublic Successful Response
     * @throws ApiError
     */
    public static createCompanyPlatformCompaniesPost({
        requestBody,
    }: {
        requestBody: CompanyCreate,
    }): CancelablePromise<CompanyPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/platform/companies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Platform Permissions
     * @returns PlatformPermissionsResponse Successful Response
     * @throws ApiError
     */
    public static getPlatformPermissionsPlatformPermissionsGet(): CancelablePromise<PlatformPermissionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/platform/permissions',
        });
    }
    /**
     * Get Company
     * @returns CompanyPublic Successful Response
     * @throws ApiError
     */
    public static getCompanyPlatformCompaniesCompanyIdGet({
        companyId,
    }: {
        companyId: string,
    }): CancelablePromise<CompanyPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/platform/companies/{company_id}',
            path: {
                'company_id': companyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Company
     * @returns CompanyPublic Successful Response
     * @throws ApiError
     */
    public static updateCompanyPlatformCompaniesCompanyIdPatch({
        companyId,
        requestBody,
    }: {
        companyId: string,
        requestBody: CompanyUpdate,
    }): CancelablePromise<CompanyPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/platform/companies/{company_id}',
            path: {
                'company_id': companyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Archive Company
     * @returns void
     * @throws ApiError
     */
    public static archiveCompanyPlatformCompaniesCompanyIdDelete({
        companyId,
    }: {
        companyId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/platform/companies/{company_id}',
            path: {
                'company_id': companyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Company Status
     * @returns CompanyPublic Successful Response
     * @throws ApiError
     */
    public static updateCompanyStatusPlatformCompaniesCompanyIdStatusPatch({
        companyId,
        requestBody,
    }: {
        companyId: string,
        requestBody: CompanyStatusUpdate,
    }): CancelablePromise<CompanyPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/platform/companies/{company_id}/status',
            path: {
                'company_id': companyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Company Modules
     * @returns CompanyPublic Successful Response
     * @throws ApiError
     */
    public static updateCompanyModulesPlatformCompaniesCompanyIdModulesPatch({
        companyId,
        requestBody,
    }: {
        companyId: string,
        requestBody: CompanyModulesUpdate,
    }): CancelablePromise<CompanyPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/platform/companies/{company_id}/modules',
            path: {
                'company_id': companyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Company Permissions
     * @returns CompanyPermissionsResponse Successful Response
     * @throws ApiError
     */
    public static getCompanyPermissionsPlatformCompaniesCompanyIdPermissionsGet({
        companyId,
    }: {
        companyId: string,
    }): CancelablePromise<CompanyPermissionsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/platform/companies/{company_id}/permissions',
            path: {
                'company_id': companyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Company Permissions
     * @returns CompanyPermissionsResponse Successful Response
     * @throws ApiError
     */
    public static updateCompanyPermissionsPlatformCompaniesCompanyIdPermissionsPatch({
        companyId,
        requestBody,
    }: {
        companyId: string,
        requestBody: CompanyPermissionsUpdate,
    }): CancelablePromise<CompanyPermissionsResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/platform/companies/{company_id}/permissions',
            path: {
                'company_id': companyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Company Accounts
     * @returns ErpAccountPublic Successful Response
     * @throws ApiError
     */
    public static listCompanyAccountsPlatformCompaniesCompanyIdAccountsGet({
        companyId,
    }: {
        companyId: string,
    }): CancelablePromise<Array<ErpAccountPublic>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/platform/companies/{company_id}/accounts',
            path: {
                'company_id': companyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Company Account
     * @returns ErpAccountPublic Successful Response
     * @throws ApiError
     */
    public static createCompanyAccountPlatformCompaniesCompanyIdAccountsPost({
        companyId,
        requestBody,
    }: {
        companyId: string,
        requestBody: ErpAccountCreate,
    }): CancelablePromise<ErpAccountPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/platform/companies/{company_id}/accounts',
            path: {
                'company_id': companyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Company Account
     * @returns ErpAccountPublic Successful Response
     * @throws ApiError
     */
    public static updateCompanyAccountPlatformCompaniesCompanyIdAccountsAccountIdPatch({
        companyId,
        accountId,
        requestBody,
    }: {
        companyId: string,
        accountId: string,
        requestBody: ErpAccountUpdate,
    }): CancelablePromise<ErpAccountPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/platform/companies/{company_id}/accounts/{account_id}',
            path: {
                'company_id': companyId,
                'account_id': accountId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deactivate Company Account
     * @returns void
     * @throws ApiError
     */
    public static deactivateCompanyAccountPlatformCompaniesCompanyIdAccountsAccountIdDelete({
        companyId,
        accountId,
    }: {
        companyId: string,
        accountId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/platform/companies/{company_id}/accounts/{account_id}',
            path: {
                'company_id': companyId,
                'account_id': accountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
