/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountingAccountCreate } from '../models/AccountingAccountCreate';
import type { AccountingAccountOut } from '../models/AccountingAccountOut';
import type { AccountingAccountUpdate } from '../models/AccountingAccountUpdate';
import type { AccountingEntryCreate } from '../models/AccountingEntryCreate';
import type { AccountingEntryOut } from '../models/AccountingEntryOut';
import type { AccountingEntryUpdate } from '../models/AccountingEntryUpdate';
import type { AccountingFiscalYearCreate } from '../models/AccountingFiscalYearCreate';
import type { AccountingFiscalYearOut } from '../models/AccountingFiscalYearOut';
import type { AccountingFiscalYearUpdate } from '../models/AccountingFiscalYearUpdate';
import type { AccountingJournalCreate } from '../models/AccountingJournalCreate';
import type { AccountingJournalOut } from '../models/AccountingJournalOut';
import type { AccountingJournalUpdate } from '../models/AccountingJournalUpdate';
import type { AccountingPeriodCreate } from '../models/AccountingPeriodCreate';
import type { AccountingPeriodOut } from '../models/AccountingPeriodOut';
import type { AccountingPeriodUpdate } from '../models/AccountingPeriodUpdate';
import type { InventoryActivationCreateIn } from '../models/InventoryActivationCreateIn';
import type { InventoryActivationLineCostIn } from '../models/InventoryActivationLineCostIn';
import type { PaginatedResponse_AccountingAccountOut_ } from '../models/PaginatedResponse_AccountingAccountOut_';
import type { PaginatedResponse_AccountingEntryOut_ } from '../models/PaginatedResponse_AccountingEntryOut_';
import type { PaginatedResponse_AccountingFiscalYearOut_ } from '../models/PaginatedResponse_AccountingFiscalYearOut_';
import type { PaginatedResponse_AccountingJournalOut_ } from '../models/PaginatedResponse_AccountingJournalOut_';
import type { PaginatedResponse_AccountingPeriodOut_ } from '../models/PaginatedResponse_AccountingPeriodOut_';
import type { PaginatedResponse_TaxCategoryOut_ } from '../models/PaginatedResponse_TaxCategoryOut_';
import type { PaginatedResponse_TaxDefinitionOut_ } from '../models/PaginatedResponse_TaxDefinitionOut_';
import type { PaginatedResponse_TaxProfileOut_ } from '../models/PaginatedResponse_TaxProfileOut_';
import type { ReopenIn } from '../models/ReopenIn';
import type { TaxCategoryCreate } from '../models/TaxCategoryCreate';
import type { TaxCategoryOut } from '../models/TaxCategoryOut';
import type { TaxCategoryUpdate } from '../models/TaxCategoryUpdate';
import type { TaxDefinitionCreate } from '../models/TaxDefinitionCreate';
import type { TaxDefinitionOut } from '../models/TaxDefinitionOut';
import type { TaxDefinitionUpdate } from '../models/TaxDefinitionUpdate';
import type { TaxProfileCreate } from '../models/TaxProfileCreate';
import type { TaxProfileOut } from '../models/TaxProfileOut';
import type { TaxProfileUpdate } from '../models/TaxProfileUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAccountingService {
    /**
     * Api List Taxes
     * @returns PaginatedResponse_TaxDefinitionOut_ Successful Response
     * @throws ApiError
     */
    public static apiListTaxesAdminAccountingTaxesGet({
        scope,
        page = 1,
        pageSize = 20,
    }: {
        scope?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_TaxDefinitionOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/taxes',
            query: {
                'scope': scope,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Tax
     * @returns TaxDefinitionOut Successful Response
     * @throws ApiError
     */
    public static apiCreateTaxAdminAccountingTaxesPost({
        requestBody,
    }: {
        requestBody: TaxDefinitionCreate,
    }): CancelablePromise<TaxDefinitionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/taxes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Tax Precheck
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiTaxPrecheckAdminAccountingTaxesPrecheckGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/taxes/precheck',
        });
    }
    /**
     * Api Get Tax
     * @returns TaxDefinitionOut Successful Response
     * @throws ApiError
     */
    public static apiGetTaxAdminAccountingTaxesTaxIdGet({
        taxId,
    }: {
        taxId: string,
    }): CancelablePromise<TaxDefinitionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/taxes/{tax_id}',
            path: {
                'tax_id': taxId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Tax
     * @returns TaxDefinitionOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateTaxAdminAccountingTaxesTaxIdPatch({
        taxId,
        requestBody,
    }: {
        taxId: string,
        requestBody: TaxDefinitionUpdate,
    }): CancelablePromise<TaxDefinitionOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/taxes/{tax_id}',
            path: {
                'tax_id': taxId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Tax Categories
     * @returns PaginatedResponse_TaxCategoryOut_ Successful Response
     * @throws ApiError
     */
    public static apiListTaxCategoriesAdminAccountingTaxCategoriesGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_TaxCategoryOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/tax-categories',
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
     * Api Create Tax Category
     * @returns TaxCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiCreateTaxCategoryAdminAccountingTaxCategoriesPost({
        requestBody,
    }: {
        requestBody: TaxCategoryCreate,
    }): CancelablePromise<TaxCategoryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/tax-categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Tax Category
     * @returns TaxCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiGetTaxCategoryAdminAccountingTaxCategoriesCategoryIdGet({
        categoryId,
    }: {
        categoryId: string,
    }): CancelablePromise<TaxCategoryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/tax-categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Tax Category
     * @returns TaxCategoryOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateTaxCategoryAdminAccountingTaxCategoriesCategoryIdPatch({
        categoryId,
        requestBody,
    }: {
        categoryId: string,
        requestBody: TaxCategoryUpdate,
    }): CancelablePromise<TaxCategoryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/tax-categories/{category_id}',
            path: {
                'category_id': categoryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Tax Profiles
     * @returns PaginatedResponse_TaxProfileOut_ Successful Response
     * @throws ApiError
     */
    public static apiListTaxProfilesAdminAccountingTaxProfilesGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_TaxProfileOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/tax-profiles',
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
     * Api Create Tax Profile
     * @returns TaxProfileOut Successful Response
     * @throws ApiError
     */
    public static apiCreateTaxProfileAdminAccountingTaxProfilesPost({
        requestBody,
    }: {
        requestBody: TaxProfileCreate,
    }): CancelablePromise<TaxProfileOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/tax-profiles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Tax Profile
     * @returns TaxProfileOut Successful Response
     * @throws ApiError
     */
    public static apiGetTaxProfileAdminAccountingTaxProfilesProfileIdGet({
        profileId,
    }: {
        profileId: string,
    }): CancelablePromise<TaxProfileOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/tax-profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Tax Profile
     * @returns TaxProfileOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateTaxProfileAdminAccountingTaxProfilesProfileIdPatch({
        profileId,
        requestBody,
    }: {
        profileId: string,
        requestBody: TaxProfileUpdate,
    }): CancelablePromise<TaxProfileOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/tax-profiles/{profile_id}',
            path: {
                'profile_id': profileId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Tax Summary
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiTaxSummaryAdminAccountingReportsTaxSummaryGet({
        dateFrom,
        dateTo,
        taxDefinitionId,
        scope,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        taxDefinitionId?: (string | null),
        scope?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/tax-summary',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'tax_definition_id': taxDefinitionId,
                'scope': scope,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Tax Detail
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiTaxDetailAdminAccountingReportsTaxDetailGet({
        dateFrom,
        dateTo,
        taxDefinitionId,
        scope,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        taxDefinitionId?: (string | null),
        scope?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/tax-detail',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'tax_definition_id': taxDefinitionId,
                'scope': scope,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Tax Reconciliation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiTaxReconciliationAdminAccountingReconciliationTaxesGet({
        dateFrom,
        dateTo,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reconciliation/taxes',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Accounts
     * @returns PaginatedResponse_AccountingAccountOut_ Successful Response
     * @throws ApiError
     */
    public static apiListAccountsAdminAccountingAccountsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_AccountingAccountOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/accounts',
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
     * Api Create Account
     * @returns AccountingAccountOut Successful Response
     * @throws ApiError
     */
    public static apiCreateAccountAdminAccountingAccountsPost({
        requestBody,
    }: {
        requestBody: AccountingAccountCreate,
    }): CancelablePromise<AccountingAccountOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/accounts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Fiscal Years
     * @returns PaginatedResponse_AccountingFiscalYearOut_ Successful Response
     * @throws ApiError
     */
    public static apiListFiscalYearsAdminAccountingFiscalYearsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_AccountingFiscalYearOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/fiscal-years',
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
     * Api Create Fiscal Year
     * @returns AccountingFiscalYearOut Successful Response
     * @throws ApiError
     */
    public static apiCreateFiscalYearAdminAccountingFiscalYearsPost({
        requestBody,
    }: {
        requestBody: AccountingFiscalYearCreate,
    }): CancelablePromise<AccountingFiscalYearOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/fiscal-years',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Fiscal Year
     * @returns AccountingFiscalYearOut Successful Response
     * @throws ApiError
     */
    public static apiGetFiscalYearAdminAccountingFiscalYearsFiscalYearIdGet({
        fiscalYearId,
    }: {
        fiscalYearId: string,
    }): CancelablePromise<AccountingFiscalYearOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/fiscal-years/{fiscal_year_id}',
            path: {
                'fiscal_year_id': fiscalYearId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Fiscal Year
     * @returns AccountingFiscalYearOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateFiscalYearAdminAccountingFiscalYearsFiscalYearIdPatch({
        fiscalYearId,
        requestBody,
    }: {
        fiscalYearId: string,
        requestBody: AccountingFiscalYearUpdate,
    }): CancelablePromise<AccountingFiscalYearOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/fiscal-years/{fiscal_year_id}',
            path: {
                'fiscal_year_id': fiscalYearId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Generate Fiscal Year Periods
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGenerateFiscalYearPeriodsAdminAccountingFiscalYearsFiscalYearIdGeneratePeriodsPost({
        fiscalYearId,
        frequency = 'monthly',
    }: {
        fiscalYearId: string,
        frequency?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/fiscal-years/{fiscal_year_id}/generate-periods',
            path: {
                'fiscal_year_id': fiscalYearId,
            },
            query: {
                'frequency': frequency,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Close Fiscal Year
     * @returns AccountingFiscalYearOut Successful Response
     * @throws ApiError
     */
    public static apiCloseFiscalYearAdminAccountingFiscalYearsFiscalYearIdClosePost({
        fiscalYearId,
    }: {
        fiscalYearId: string,
    }): CancelablePromise<AccountingFiscalYearOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/fiscal-years/{fiscal_year_id}/close',
            path: {
                'fiscal_year_id': fiscalYearId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reopen Fiscal Year
     * @returns AccountingFiscalYearOut Successful Response
     * @throws ApiError
     */
    public static apiReopenFiscalYearAdminAccountingFiscalYearsFiscalYearIdReopenPost({
        fiscalYearId,
        requestBody,
    }: {
        fiscalYearId: string,
        requestBody: ReopenIn,
    }): CancelablePromise<AccountingFiscalYearOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/fiscal-years/{fiscal_year_id}/reopen',
            path: {
                'fiscal_year_id': fiscalYearId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Account
     * @returns AccountingAccountOut Successful Response
     * @throws ApiError
     */
    public static apiGetAccountAdminAccountingAccountsAccountIdGet({
        accountId,
    }: {
        accountId: string,
    }): CancelablePromise<AccountingAccountOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Account
     * @returns AccountingAccountOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateAccountAdminAccountingAccountsAccountIdPatch({
        accountId,
        requestBody,
    }: {
        accountId: string,
        requestBody: AccountingAccountUpdate,
    }): CancelablePromise<AccountingAccountOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/accounts/{account_id}',
            path: {
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
     * Api Archive Account
     * @returns AccountingAccountOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveAccountAdminAccountingAccountsAccountIdDelete({
        accountId,
    }: {
        accountId: string,
    }): CancelablePromise<AccountingAccountOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/accounting/accounts/{account_id}',
            path: {
                'account_id': accountId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Account Balance
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAccountBalanceAdminAccountingAccountsAccountIdBalanceGet({
        accountId,
        dateFrom,
        dateTo,
    }: {
        accountId: string,
        dateFrom?: (string | null),
        dateTo?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/accounts/{account_id}/balance',
            path: {
                'account_id': accountId,
            },
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Journals
     * @returns PaginatedResponse_AccountingJournalOut_ Successful Response
     * @throws ApiError
     */
    public static apiListJournalsAdminAccountingJournalsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_AccountingJournalOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/journals',
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
     * Api Create Journal
     * @returns AccountingJournalOut Successful Response
     * @throws ApiError
     */
    public static apiCreateJournalAdminAccountingJournalsPost({
        requestBody,
    }: {
        requestBody: AccountingJournalCreate,
    }): CancelablePromise<AccountingJournalOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/journals',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Journal
     * @returns AccountingJournalOut Successful Response
     * @throws ApiError
     */
    public static apiGetJournalAdminAccountingJournalsJournalIdGet({
        journalId,
    }: {
        journalId: string,
    }): CancelablePromise<AccountingJournalOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/journals/{journal_id}',
            path: {
                'journal_id': journalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Journal
     * @returns AccountingJournalOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateJournalAdminAccountingJournalsJournalIdPatch({
        journalId,
        requestBody,
    }: {
        journalId: string,
        requestBody: AccountingJournalUpdate,
    }): CancelablePromise<AccountingJournalOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/journals/{journal_id}',
            path: {
                'journal_id': journalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Journal
     * @returns AccountingJournalOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveJournalAdminAccountingJournalsJournalIdDelete({
        journalId,
    }: {
        journalId: string,
    }): CancelablePromise<AccountingJournalOut> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/accounting/journals/{journal_id}',
            path: {
                'journal_id': journalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Entries
     * @returns PaginatedResponse_AccountingEntryOut_ Successful Response
     * @throws ApiError
     */
    public static apiListEntriesAdminAccountingEntriesGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_AccountingEntryOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/entries',
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
     * Api Create Entry
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiCreateEntryAdminAccountingEntriesPost({
        requestBody,
    }: {
        requestBody: AccountingEntryCreate,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/entries',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Entry
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiGetEntryAdminAccountingEntriesEntryIdGet({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Entry
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateEntryAdminAccountingEntriesEntryIdPatch({
        entryId,
        requestBody,
    }: {
        entryId: string,
        requestBody: AccountingEntryUpdate,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/entries/{entry_id}',
            path: {
                'entry_id': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Entry
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiPostEntryAdminAccountingEntriesEntryIdPostPost({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/entries/{entry_id}/post',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reverse Entry
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiReverseEntryAdminAccountingEntriesEntryIdReversePost({
        entryId,
    }: {
        entryId: string,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/entries/{entry_id}/reverse',
            path: {
                'entry_id': entryId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Periods
     * @returns PaginatedResponse_AccountingPeriodOut_ Successful Response
     * @throws ApiError
     */
    public static apiListPeriodsAdminAccountingPeriodsGet({
        page = 1,
        pageSize = 20,
    }: {
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_AccountingPeriodOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/periods',
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
     * Api Create Period
     * @returns AccountingPeriodOut Successful Response
     * @throws ApiError
     */
    public static apiCreatePeriodAdminAccountingPeriodsPost({
        requestBody,
    }: {
        requestBody: AccountingPeriodCreate,
    }): CancelablePromise<AccountingPeriodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/periods',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Period
     * @returns AccountingPeriodOut Successful Response
     * @throws ApiError
     */
    public static apiGetPeriodAdminAccountingPeriodsPeriodIdGet({
        periodId,
    }: {
        periodId: string,
    }): CancelablePromise<AccountingPeriodOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/periods/{period_id}',
            path: {
                'period_id': periodId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Period
     * @returns AccountingPeriodOut Successful Response
     * @throws ApiError
     */
    public static apiUpdatePeriodAdminAccountingPeriodsPeriodIdPatch({
        periodId,
        requestBody,
    }: {
        periodId: string,
        requestBody: AccountingPeriodUpdate,
    }): CancelablePromise<AccountingPeriodOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/periods/{period_id}',
            path: {
                'period_id': periodId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Close Period
     * @returns AccountingPeriodOut Successful Response
     * @throws ApiError
     */
    public static apiClosePeriodAdminAccountingPeriodsPeriodIdClosePost({
        periodId,
    }: {
        periodId: string,
    }): CancelablePromise<AccountingPeriodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/periods/{period_id}/close',
            path: {
                'period_id': periodId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Period Close Precheck
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiPeriodClosePrecheckAdminAccountingPeriodsPeriodIdClosePrecheckGet({
        periodId,
    }: {
        periodId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/periods/{period_id}/close-precheck',
            path: {
                'period_id': periodId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reopen Period
     * @returns AccountingPeriodOut Successful Response
     * @throws ApiError
     */
    public static apiReopenPeriodAdminAccountingPeriodsPeriodIdReopenPost({
        periodId,
        requestBody,
    }: {
        periodId: string,
        requestBody: ReopenIn,
    }): CancelablePromise<AccountingPeriodOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/periods/{period_id}/reopen',
            path: {
                'period_id': periodId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Accounting Dashboard
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAccountingDashboardAdminAccountingDashboardGet({
        asOfDate,
    }: {
        asOfDate?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/dashboard',
            query: {
                'as_of_date': asOfDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api General Ledger
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGeneralLedgerAdminAccountingReportsGeneralLedgerGet({
        dateFrom,
        dateTo,
        accountId,
        journalId,
        sourceDocumentType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        accountId?: (string | null),
        journalId?: (string | null),
        sourceDocumentType?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/general-ledger',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'account_id': accountId,
                'journal_id': journalId,
                'source_document_type': sourceDocumentType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Trial Balance
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiTrialBalanceAdminAccountingReportsTrialBalanceGet({
        dateFrom,
        dateTo,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/trial-balance',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Profit Loss
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiProfitLossAdminAccountingReportsProfitLossGet({
        dateFrom,
        dateTo,
        fiscalYearId,
        periodId,
        compareDateFrom,
        compareDateTo,
        journalId,
        costCenterId,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        fiscalYearId?: (string | null),
        periodId?: (string | null),
        compareDateFrom?: (string | null),
        compareDateTo?: (string | null),
        journalId?: (string | null),
        costCenterId?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/profit-loss',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'fiscal_year_id': fiscalYearId,
                'period_id': periodId,
                'compare_date_from': compareDateFrom,
                'compare_date_to': compareDateTo,
                'journal_id': journalId,
                'cost_center_id': costCenterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Balance Sheet
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiBalanceSheetAdminAccountingReportsBalanceSheetGet({
        asOfDate,
        compareAsOfDate,
    }: {
        asOfDate: string,
        compareAsOfDate?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/balance-sheet',
            query: {
                'as_of_date': asOfDate,
                'compare_as_of_date': compareAsOfDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Statement Of Equity
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiStatementOfEquityAdminAccountingReportsStatementOfEquityGet({
        dateFrom,
        dateTo,
        fiscalYearId,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        fiscalYearId?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/statement-of-equity',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'fiscal_year_id': fiscalYearId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Ap Aging
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiApAgingAdminAccountingReportsAccountsPayableAgingGet({
        asOfDate,
    }: {
        asOfDate?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/accounts-payable-aging',
            query: {
                'as_of_date': asOfDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Ar Aging
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiArAgingAdminAccountingReportsAccountsReceivableAgingGet({
        asOfDate,
    }: {
        asOfDate?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/accounts-receivable-aging',
            query: {
                'as_of_date': asOfDate,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Inventory Valuation Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiInventoryValuationReportAdminAccountingReportsInventoryValuationGet({
        date,
        productId,
        variantId,
        categoryId,
        locationId,
    }: {
        date?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        categoryId?: (string | null),
        locationId?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/inventory-valuation',
            query: {
                'date': date,
                'product_id': productId,
                'variant_id': variantId,
                'category_id': categoryId,
                'location_id': locationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Inventory Valuation Layers
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiInventoryValuationLayersAdminAccountingInventoryValuationLayersGet({
        dateFrom,
        dateTo,
        productId,
        variantId,
        sourceDocumentType,
        movementType,
    }: {
        dateFrom?: (string | null),
        dateTo?: (string | null),
        productId?: (string | null),
        variantId?: (string | null),
        sourceDocumentType?: (string | null),
        movementType?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/inventory-valuation/layers',
            query: {
                'date_from': dateFrom,
                'date_to': dateTo,
                'product_id': productId,
                'variant_id': variantId,
                'source_document_type': sourceDocumentType,
                'movement_type': movementType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Inventory Activation Precheck
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiInventoryActivationPrecheckAdminAccountingInventoryActivationPrecheckGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/inventory-activation/precheck',
        });
    }
    /**
     * Api Create Inventory Activation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiCreateInventoryActivationAdminAccountingInventoryActivationPost({
        requestBody,
    }: {
        requestBody: InventoryActivationCreateIn,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/inventory-activation',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Inventory Activation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGetInventoryActivationAdminAccountingInventoryActivationActivationIdGet({
        activationId,
    }: {
        activationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/inventory-activation/{activation_id}',
            path: {
                'activation_id': activationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Inventory Activation Line Cost
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiUpdateInventoryActivationLineCostAdminAccountingInventoryActivationActivationIdLinesLineIdPatch({
        activationId,
        lineId,
        requestBody,
    }: {
        activationId: string,
        lineId: string,
        requestBody: InventoryActivationLineCostIn,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/accounting/inventory-activation/{activation_id}/lines/{line_id}',
            path: {
                'activation_id': activationId,
                'line_id': lineId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Validate Inventory Activation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiValidateInventoryActivationAdminAccountingInventoryActivationActivationIdValidatePost({
        activationId,
    }: {
        activationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/inventory-activation/{activation_id}/validate',
            path: {
                'activation_id': activationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Apply Inventory Activation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiApplyInventoryActivationAdminAccountingInventoryActivationActivationIdApplyPost({
        activationId,
    }: {
        activationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/inventory-activation/{activation_id}/apply',
            path: {
                'activation_id': activationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Grni Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGrniReportAdminAccountingReportsGrniGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/grni',
        });
    }
    /**
     * Api Ginr Report
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGinrReportAdminAccountingReportsGinrGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reports/ginr',
        });
    }
    /**
     * Api Inventory Reconciliation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiInventoryReconciliationAdminAccountingReconciliationInventoryGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reconciliation/inventory',
        });
    }
    /**
     * Api Accrual Reconciliation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAccrualReconciliationAdminAccountingReconciliationAccrualsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reconciliation/accruals',
        });
    }
    /**
     * Api Period Close Reconciliation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiPeriodCloseReconciliationAdminAccountingReconciliationPeriodCloseGet({
        periodId,
    }: {
        periodId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reconciliation/period-close',
            query: {
                'period_id': periodId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Accounting Outbox Status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAccountingOutboxStatusAdminAccountingOutboxStatusGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/outbox/status',
        });
    }
    /**
     * Api Retry Accounting Outbox Event
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiRetryAccountingOutboxEventAdminAccountingOutboxEventIdRetryPost({
        eventId,
    }: {
        eventId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/outbox/{event_id}/retry',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Accounting Reconciliation Status
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAccountingReconciliationStatusAdminAccountingReconciliationStatusGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reconciliation/status',
        });
    }
    /**
     * Api Accounting System Reconciliation
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiAccountingSystemReconciliationAdminAccountingReconciliationSystemGet({
        asOfDate,
        dateFrom,
        dateTo,
    }: {
        asOfDate?: (string | null),
        dateFrom?: (string | null),
        dateTo?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/accounting/reconciliation/system',
            query: {
                'as_of_date': asOfDate,
                'date_from': dateFrom,
                'date_to': dateTo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Vendor Bill Accounting
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiPostVendorBillAccountingAdminAccountingBridgeVendorBillsBillIdPostPost({
        billId,
    }: {
        billId: string,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/bridge/vendor-bills/{bill_id}/post',
            path: {
                'bill_id': billId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Payment Accounting
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiPostPaymentAccountingAdminAccountingBridgePaymentsPaymentIdPostPost({
        paymentId,
    }: {
        paymentId: string,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/bridge/payments/{payment_id}/post',
            path: {
                'payment_id': paymentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Sales Accounting
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiPostSalesAccountingAdminAccountingBridgeSalesOrdersOrderIdPostPost({
        orderId,
    }: {
        orderId: string,
    }): CancelablePromise<Array<AccountingEntryOut>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/bridge/sales-orders/{order_id}/post',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Post Transfer Accounting
     * @returns AccountingEntryOut Successful Response
     * @throws ApiError
     */
    public static apiPostTransferAccountingAdminAccountingBridgeTransfersTransferIdPostPost({
        transferId,
    }: {
        transferId: string,
    }): CancelablePromise<AccountingEntryOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/accounting/bridge/transfers/{transfer_id}/post',
            path: {
                'transfer_id': transferId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
