/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_import_file_admin_imports__job_id__file_post } from '../models/Body_upload_import_file_admin_imports__job_id__file_post';
import type { ImportExecuteResponse } from '../models/ImportExecuteResponse';
import type { ImportJobCreate } from '../models/ImportJobCreate';
import type { ImportJobRead } from '../models/ImportJobRead';
import type { ImportJobUploadResponse } from '../models/ImportJobUploadResponse';
import type { ImportMappingUpdate } from '../models/ImportMappingUpdate';
import type { ImportPreviewRead } from '../models/ImportPreviewRead';
import type { ImportSchemaRead } from '../models/ImportSchemaRead';
import type { PaginatedResponse_ImportJobRead_ } from '../models/PaginatedResponse_ImportJobRead_';
import type { PaginatedResponse_ImportRowRead_ } from '../models/PaginatedResponse_ImportRowRead_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminImportsService {
    /**
     * Get Product Import Schema
     * @returns ImportSchemaRead Successful Response
     * @throws ApiError
     */
    public static getProductImportSchemaAdminImportsSchemaProductsGet(): CancelablePromise<ImportSchemaRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/imports/schema/products',
        });
    }
    /**
     * Create Import Job
     * @returns ImportJobRead Successful Response
     * @throws ApiError
     */
    public static createImportJobAdminImportsPost({
        requestBody,
    }: {
        requestBody: ImportJobCreate,
    }): CancelablePromise<ImportJobRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/imports',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Import Jobs
     * @returns PaginatedResponse_ImportJobRead_ Successful Response
     * @throws ApiError
     */
    public static listImportJobsAdminImportsGet({
        status,
        entity,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        entity?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ImportJobRead_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/imports',
            query: {
                'status': status,
                'entity': entity,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Import Job
     * @returns ImportJobRead Successful Response
     * @throws ApiError
     */
    public static getImportJobAdminImportsJobIdGet({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<ImportJobRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/imports/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Import File
     * @returns ImportJobUploadResponse Successful Response
     * @throws ApiError
     */
    public static uploadImportFileAdminImportsJobIdFilePost({
        jobId,
        formData,
    }: {
        jobId: string,
        formData: Body_upload_import_file_admin_imports__job_id__file_post,
    }): CancelablePromise<ImportJobUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/imports/{job_id}/file',
            path: {
                'job_id': jobId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Import Mapping
     * @returns ImportJobRead Successful Response
     * @throws ApiError
     */
    public static updateImportMappingAdminImportsJobIdMappingPut({
        jobId,
        requestBody,
    }: {
        jobId: string,
        requestBody: ImportMappingUpdate,
    }): CancelablePromise<ImportJobRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/imports/{job_id}/mapping',
            path: {
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Validate Import Job
     * @returns ImportJobRead Successful Response
     * @throws ApiError
     */
    public static validateImportJobAdminImportsJobIdValidatePost({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<ImportJobRead> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/imports/{job_id}/validate',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview Import Job
     * @returns ImportPreviewRead Successful Response
     * @throws ApiError
     */
    public static previewImportJobAdminImportsJobIdPreviewGet({
        jobId,
        page = 1,
        pageSize = 20,
    }: {
        jobId: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<ImportPreviewRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/imports/{job_id}/preview',
            path: {
                'job_id': jobId,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Import Rows
     * @returns PaginatedResponse_ImportRowRead_ Successful Response
     * @throws ApiError
     */
    public static listImportRowsAdminImportsJobIdRowsGet({
        jobId,
        status,
        page = 1,
        pageSize = 20,
    }: {
        jobId: string,
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_ImportRowRead_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/imports/{job_id}/rows',
            path: {
                'job_id': jobId,
            },
            query: {
                'status': status,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Execute Import Job
     * @returns ImportExecuteResponse Successful Response
     * @throws ApiError
     */
    public static executeImportJobAdminImportsJobIdExecutePost({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<ImportExecuteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/imports/{job_id}/execute',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
