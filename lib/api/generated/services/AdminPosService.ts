/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PosAccountCreate } from '../models/PosAccountCreate';
import type { PosAccountUpdate } from '../models/PosAccountUpdate';
import type { PosAssignmentWrite } from '../models/PosAssignmentWrite';
import type { PosAvailability } from '../models/PosAvailability';
import type { PosCart } from '../models/PosCart';
import type { PosCash } from '../models/PosCash';
import type { PosClose } from '../models/PosClose';
import type { PosContext } from '../models/PosContext';
import type { PosCustomerCreate } from '../models/PosCustomerCreate';
import type { PosHold } from '../models/PosHold';
import type { PosInvoiceCreate } from '../models/PosInvoiceCreate';
import type { PosOpen } from '../models/PosOpen';
import type { PosPage } from '../models/PosPage';
import type { PosQuote } from '../models/PosQuote';
import type { PosRecord } from '../models/PosRecord';
import type { PosRegisterWrite } from '../models/PosRegisterWrite';
import type { PosReport } from '../models/PosReport';
import type { PosReturnCreate } from '../models/PosReturnCreate';
import type { PosSaleCreate } from '../models/PosSaleCreate';
import type { PosShopWrite } from '../models/PosShopWrite';
import type { PosTransferCreate } from '../models/PosTransferCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPosService {
    /**
     * Pos Accounts
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static posAccountsAdminPosAccountsGet({
        page = 1,
        pageSize = 25,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/accounts',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Pos Account
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static createPosAccountAdminPosAccountsPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosAccountCreate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/accounts',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Pos Account
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static updatePosAccountAdminPosAccountsIdentifierPut({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosAccountUpdate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/pos/accounts/{identifier}',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Context
     * @returns PosContext Successful Response
     * @throws ApiError
     */
    public static contextAdminPosContextGet(): CancelablePromise<PosContext> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/context',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
            },
        });
    }
    /**
     * Create Shop
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static createShopAdminPosShopsPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosShopWrite,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/shops',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Shop
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static updateShopAdminPosShopsIdentifierPut({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosShopWrite,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/pos/shops/{identifier}',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Register
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static createRegisterAdminPosRegistersPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosRegisterWrite,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/registers',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Register
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static updateRegisterAdminPosRegistersIdentifierPut({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosRegisterWrite,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/pos/registers/{identifier}',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assignment
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static assignmentAdminPosAssignmentsPut({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosAssignmentWrite,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/pos/assignments',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assignments
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static assignmentsAdminPosAssignmentsGet({
        page = 1,
        pageSize = 25,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/assignments',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Users
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static usersAdminPosUsersGet({
        q = '',
        page = 1,
        pageSize = 25,
    }: {
        q?: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/users',
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Products
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static productsAdminPosCatalogGet({
        shopId,
        productId,
        q = '',
        categoryId,
        page = 1,
        pageSize = 30,
    }: {
        shopId: string,
        productId?: (string | null),
        q?: string,
        categoryId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/catalog',
            query: {
                'shop_id': shopId,
                'product_id': productId,
                'q': q,
                'category_id': categoryId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Categories
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static categoriesAdminPosCategoriesGet({
        page = 1,
        pageSize = 100,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/categories',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Availability
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static availabilityAdminPosCatalogProductIdAvailabilityPut({
        productId,
        idempotencyKey,
        requestBody,
    }: {
        productId: string,
        idempotencyKey: string,
        requestBody: PosAvailability,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/pos/catalog/{product_id}/availability',
            path: {
                'product_id': productId,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Open Session
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static openSessionAdminPosSessionsPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosOpen,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/sessions',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Sessions
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static listSessionsAdminPosSessionsGet({
        status,
        shopId,
        registerId,
        start,
        end,
        page = 1,
        pageSize = 25,
    }: {
        status?: ('open' | 'closed' | null),
        shopId?: (string | null),
        registerId?: (string | null),
        start?: (string | null),
        end?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sessions',
            query: {
                'status': status,
                'shop_id': shopId,
                'register_id': registerId,
                'start': start,
                'end': end,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Close Session
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static closeSessionAdminPosSessionsIdentifierClosePost({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosClose,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/sessions/{identifier}/close',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cash
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static cashAdminPosSessionsIdentifierCashPost({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosCash,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/sessions/{identifier}/cash',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cash History
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static cashHistoryAdminPosSessionsIdentifierCashGet({
        identifier,
        page = 1,
        pageSize = 25,
    }: {
        identifier: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sessions/{identifier}/cash',
            path: {
                'identifier': identifier,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Closing Ticket
     * @returns string Successful Response
     * @throws ApiError
     */
    public static closingTicketAdminPosSessionsIdentifierTicketGet({
        identifier,
        a4 = false,
    }: {
        identifier: string,
        a4?: boolean,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sessions/{identifier}/ticket',
            path: {
                'identifier': identifier,
            },
            query: {
                'a4': a4,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Quote
     * @returns PosQuote Successful Response
     * @throws ApiError
     */
    public static quoteAdminPosQuotePost({
        requestBody,
    }: {
        requestBody: PosCart,
    }): CancelablePromise<PosQuote> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/quote',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sale
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static saleAdminPosSalesPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosSaleCreate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/sales',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Sales
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static listSalesAdminPosSalesGet({
        number = '',
        shopId,
        registerId,
        userId,
        start,
        end,
        page = 1,
        pageSize = 25,
    }: {
        number?: string,
        shopId?: (string | null),
        registerId?: (string | null),
        userId?: (string | null),
        start?: (string | null),
        end?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sales',
            query: {
                'number': number,
                'shop_id': shopId,
                'register_id': registerId,
                'user_id': userId,
                'start': start,
                'end': end,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Recovery
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static recoveryAdminPosIdempotencyKeyGet({
        key,
    }: {
        key: string,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/idempotency/{key}',
            path: {
                'key': key,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sale Detail
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static saleDetailAdminPosSalesIdentifierGet({
        identifier,
    }: {
        identifier: string,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sales/{identifier}',
            path: {
                'identifier': identifier,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sale Ticket
     * @returns string Successful Response
     * @throws ApiError
     */
    public static saleTicketAdminPosSalesIdentifierTicketGet({
        identifier,
        a4 = false,
        reprint = true,
    }: {
        identifier: string,
        a4?: boolean,
        reprint?: boolean,
    }): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sales/{identifier}/ticket',
            path: {
                'identifier': identifier,
            },
            query: {
                'a4': a4,
                'reprint': reprint,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Return Sale
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static returnSaleAdminPosSalesIdentifierReturnsPost({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosReturnCreate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/sales/{identifier}/returns',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Return History
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static returnHistoryAdminPosSalesIdentifierReturnsGet({
        identifier,
        page = 1,
        pageSize = 25,
    }: {
        identifier: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/sales/{identifier}/returns',
            path: {
                'identifier': identifier,
            },
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Hold
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static holdAdminPosHoldsPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosHold,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/holds',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Holds
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static holdsAdminPosHoldsGet({
        page = 1,
        pageSize = 25,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/holds',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Hold
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static removeHoldAdminPosHoldsIdentifierDelete({
        identifier,
    }: {
        identifier: string,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/pos/holds/{identifier}',
            path: {
                'identifier': identifier,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Locations
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static locationsAdminPosLocationsGet({
        page = 1,
        pageSize = 100,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/locations',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Transfers
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static listTransfersAdminPosTransfersGet({
        page = 1,
        pageSize = 25,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/transfers',
            query: {
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Transfer
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static transferAdminPosTransfersPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosTransferCreate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/transfers',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Receive
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static receiveAdminPosTransfersIdentifierReceivePost({
        identifier,
        idempotencyKey,
    }: {
        identifier: string,
        idempotencyKey: string,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/transfers/{identifier}/receive',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Report
     * @returns PosReport Successful Response
     * @throws ApiError
     */
    public static reportAdminPosReportsGet({
        shopId,
        registerId,
        userId,
        start,
        end,
    }: {
        shopId?: (string | null),
        registerId?: (string | null),
        userId?: (string | null),
        start?: (string | null),
        end?: (string | null),
    }): CancelablePromise<PosReport> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/reports',
            query: {
                'shop_id': shopId,
                'register_id': registerId,
                'user_id': userId,
                'start': start,
                'end': end,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Export
     * @returns binary Ventes CSV
     * @throws ApiError
     */
    public static exportAdminPosExportGet({
        shopId,
        registerId,
        userId,
        start,
        end,
    }: {
        shopId?: (string | null),
        registerId?: (string | null),
        userId?: (string | null),
        start?: (string | null),
        end?: (string | null),
    }): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/export',
            query: {
                'shop_id': shopId,
                'register_id': registerId,
                'user_id': userId,
                'start': start,
                'end': end,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Customers
     * @returns PosPage Successful Response
     * @throws ApiError
     */
    public static customersAdminPosCustomersGet({
        q = '',
        page = 1,
        pageSize = 25,
    }: {
        q?: string,
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PosPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/customers',
            query: {
                'q': q,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Customer
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static customerAdminPosCustomersPost({
        idempotencyKey,
        requestBody,
    }: {
        idempotencyKey: string,
        requestBody: PosCustomerCreate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/customers',
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Invoice
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static invoiceAdminPosSalesIdentifierInvoicePost({
        identifier,
        idempotencyKey,
        requestBody,
    }: {
        identifier: string,
        idempotencyKey: string,
        requestBody: PosInvoiceCreate,
    }): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/pos/sales/{identifier}/invoice',
            path: {
                'identifier': identifier,
            },
            headers: {
                'idempotency-key': idempotencyKey,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Invoice Options
     * @returns PosRecord Successful Response
     * @throws ApiError
     */
    public static invoiceOptionsAdminPosInvoiceOptionsGet(): CancelablePromise<PosRecord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/pos/invoice-options',
            errors: {
                401: `Authentification absente, expirée ou révoquée`,
                403: `Module, permission ou affectation non autorisés`,
                404: `Ressource absente dans le contexte autorisé`,
                409: `Conflit métier, concurrence ou clé d'idempotence incompatible`,
            },
        });
    }
}
