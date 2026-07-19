/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketingAttributionOut } from '../models/MarketingAttributionOut';
import type { MarketingCampaignCreate } from '../models/MarketingCampaignCreate';
import type { MarketingCampaignOut } from '../models/MarketingCampaignOut';
import type { MarketingCampaignUpdate } from '../models/MarketingCampaignUpdate';
import type { MarketingCollaborationCreate } from '../models/MarketingCollaborationCreate';
import type { MarketingCollaborationOut } from '../models/MarketingCollaborationOut';
import type { MarketingCollaborationTimelineOut } from '../models/MarketingCollaborationTimelineOut';
import type { MarketingCollaborationUpdate } from '../models/MarketingCollaborationUpdate';
import type { MarketingDashboardResponse } from '../models/MarketingDashboardResponse';
import type { MarketingDeliverableCreate } from '../models/MarketingDeliverableCreate';
import type { MarketingDeliverableOut } from '../models/MarketingDeliverableOut';
import type { MarketingDeliverableUpdate } from '../models/MarketingDeliverableUpdate';
import type { MarketingNoteIn } from '../models/MarketingNoteIn';
import type { MarketingNoteOut } from '../models/MarketingNoteOut';
import type { MarketingOrderAttributionIn } from '../models/MarketingOrderAttributionIn';
import type { MarketingPartnerCreate } from '../models/MarketingPartnerCreate';
import type { MarketingPartnerOut } from '../models/MarketingPartnerOut';
import type { MarketingPartnerSummaryOut } from '../models/MarketingPartnerSummaryOut';
import type { MarketingPartnerUpdate } from '../models/MarketingPartnerUpdate';
import type { MarketingPerformanceResponse } from '../models/MarketingPerformanceResponse';
import type { MarketingReturnCreate } from '../models/MarketingReturnCreate';
import type { MarketingReturnOut } from '../models/MarketingReturnOut';
import type { MarketingTrackingLinkCreate } from '../models/MarketingTrackingLinkCreate';
import type { MarketingTrackingLinkOut } from '../models/MarketingTrackingLinkOut';
import type { MarketingTrackingLinkUpdate } from '../models/MarketingTrackingLinkUpdate';
import type { MarketingTypeCreate } from '../models/MarketingTypeCreate';
import type { MarketingTypeOptionOut } from '../models/MarketingTypeOptionOut';
import type { MarketingTypeOut } from '../models/MarketingTypeOut';
import type { MarketingTypeUpdate } from '../models/MarketingTypeUpdate';
import type { PaginatedResponse_MarketingCampaignOut_ } from '../models/PaginatedResponse_MarketingCampaignOut_';
import type { PaginatedResponse_MarketingCollaborationOut_ } from '../models/PaginatedResponse_MarketingCollaborationOut_';
import type { PaginatedResponse_MarketingDeliverableOut_ } from '../models/PaginatedResponse_MarketingDeliverableOut_';
import type { PaginatedResponse_MarketingPartnerOut_ } from '../models/PaginatedResponse_MarketingPartnerOut_';
import type { PaginatedResponse_MarketingReturnOut_ } from '../models/PaginatedResponse_MarketingReturnOut_';
import type { PaginatedResponse_MarketingTrackingLinkOut_ } from '../models/PaginatedResponse_MarketingTrackingLinkOut_';
import type { PaginatedResponse_MarketingTypeOut_ } from '../models/PaginatedResponse_MarketingTypeOut_';
import type { PaginatedResponse_PartnerCommissionOut_ } from '../models/PaginatedResponse_PartnerCommissionOut_';
import type { PartnerCommissionOut } from '../models/PartnerCommissionOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminMarketingService {
    /**
     * Api List Marketing Types
     * @returns PaginatedResponse_MarketingTypeOut_ Successful Response
     * @throws ApiError
     */
    public static apiListMarketingTypesAdminMarketingTypesGet({
        q,
        isActive,
        isArchived,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        isActive?: (boolean | null),
        isArchived?: (boolean | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingTypeOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/types',
            query: {
                'q': q,
                'is_active': isActive,
                'is_archived': isArchived,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiCreateMarketingTypeAdminMarketingTypesPost({
        requestBody,
    }: {
        requestBody: MarketingTypeCreate,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/types',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Marketing Type Options
     * @returns MarketingTypeOptionOut Successful Response
     * @throws ApiError
     */
    public static apiMarketingTypeOptionsAdminMarketingTypesOptionsGet({
        scope,
    }: {
        scope?: (string | null),
    }): CancelablePromise<Array<MarketingTypeOptionOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/types/options',
            query: {
                'scope': scope,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiGetMarketingTypeAdminMarketingTypesTypeIdGet({
        typeId,
    }: {
        typeId: string,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/types/{type_id}',
            path: {
                'type_id': typeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateMarketingTypeAdminMarketingTypesTypeIdPatch({
        typeId,
        requestBody,
    }: {
        typeId: string,
        requestBody: MarketingTypeUpdate,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/types/{type_id}',
            path: {
                'type_id': typeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Activate Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiActivateMarketingTypeAdminMarketingTypesTypeIdActivatePost({
        typeId,
    }: {
        typeId: string,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/types/{type_id}/activate',
            path: {
                'type_id': typeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Deactivate Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiDeactivateMarketingTypeAdminMarketingTypesTypeIdDeactivatePost({
        typeId,
    }: {
        typeId: string,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/types/{type_id}/deactivate',
            path: {
                'type_id': typeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveMarketingTypeAdminMarketingTypesTypeIdArchivePost({
        typeId,
    }: {
        typeId: string,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/types/{type_id}/archive',
            path: {
                'type_id': typeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Restore Marketing Type
     * @returns MarketingTypeOut Successful Response
     * @throws ApiError
     */
    public static apiRestoreMarketingTypeAdminMarketingTypesTypeIdRestorePost({
        typeId,
    }: {
        typeId: string,
    }): CancelablePromise<MarketingTypeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/types/{type_id}/restore',
            path: {
                'type_id': typeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Marketing Partners
     * @returns PaginatedResponse_MarketingPartnerOut_ Successful Response
     * @throws ApiError
     */
    public static apiListMarketingPartnersAdminMarketingPartnersGet({
        q,
        status,
        partnerType,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        status?: (string | null),
        partnerType?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingPartnerOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/partners',
            query: {
                'q': q,
                'status': status,
                'partner_type': partnerType,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Marketing Partner
     * @returns MarketingPartnerOut Successful Response
     * @throws ApiError
     */
    public static apiCreateMarketingPartnerAdminMarketingPartnersPost({
        requestBody,
    }: {
        requestBody: MarketingPartnerCreate,
    }): CancelablePromise<MarketingPartnerOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/partners',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Marketing Partner
     * @returns MarketingPartnerOut Successful Response
     * @throws ApiError
     */
    public static apiGetMarketingPartnerAdminMarketingPartnersPartnerIdGet({
        partnerId,
    }: {
        partnerId: string,
    }): CancelablePromise<MarketingPartnerOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/partners/{partner_id}',
            path: {
                'partner_id': partnerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Marketing Partner
     * @returns MarketingPartnerOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateMarketingPartnerAdminMarketingPartnersPartnerIdPatch({
        partnerId,
        requestBody,
    }: {
        partnerId: string,
        requestBody: MarketingPartnerUpdate,
    }): CancelablePromise<MarketingPartnerOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/partners/{partner_id}',
            path: {
                'partner_id': partnerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Partner Summary
     * @returns MarketingPartnerSummaryOut Successful Response
     * @throws ApiError
     */
    public static apiPartnerSummaryAdminMarketingPartnersPartnerIdSummaryGet({
        partnerId,
    }: {
        partnerId: string,
    }): CancelablePromise<MarketingPartnerSummaryOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/partners/{partner_id}/summary',
            path: {
                'partner_id': partnerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Partner Performance
     * @returns MarketingPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static apiPartnerPerformanceAdminMarketingPartnersPartnerIdPerformanceGet({
        partnerId,
    }: {
        partnerId: string,
    }): CancelablePromise<MarketingPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/partners/{partner_id}/performance',
            path: {
                'partner_id': partnerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Marketing Campaigns
     * @returns PaginatedResponse_MarketingCampaignOut_ Successful Response
     * @throws ApiError
     */
    public static apiListMarketingCampaignsAdminMarketingCampaignsGet({
        q,
        status,
        typeId,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        status?: (string | null),
        typeId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingCampaignOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/campaigns',
            query: {
                'q': q,
                'status': status,
                'type_id': typeId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiCreateMarketingCampaignAdminMarketingCampaignsPost({
        requestBody,
    }: {
        requestBody: MarketingCampaignCreate,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiGetMarketingCampaignAdminMarketingCampaignsCampaignIdGet({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/campaigns/{campaign_id}',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateMarketingCampaignAdminMarketingCampaignsCampaignIdPatch({
        campaignId,
        requestBody,
    }: {
        campaignId: string,
        requestBody: MarketingCampaignUpdate,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/campaigns/{campaign_id}',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Plan Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiPlanMarketingCampaignAdminMarketingCampaignsCampaignIdPlanPost({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/plan',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Activate Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiActivateMarketingCampaignAdminMarketingCampaignsCampaignIdActivatePost({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/activate',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Pause Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiPauseMarketingCampaignAdminMarketingCampaignsCampaignIdPausePost({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/pause',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Complete Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiCompleteMarketingCampaignAdminMarketingCampaignsCampaignIdCompletePost({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/complete',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiCancelMarketingCampaignAdminMarketingCampaignsCampaignIdCancelPost({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/cancel',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Archive Marketing Campaign
     * @returns MarketingCampaignOut Successful Response
     * @throws ApiError
     */
    public static apiArchiveMarketingCampaignAdminMarketingCampaignsCampaignIdArchivePost({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingCampaignOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/archive',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Campaign Performance
     * @returns MarketingPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static apiCampaignPerformanceAdminMarketingCampaignsCampaignIdPerformanceGet({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<MarketingPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/campaigns/{campaign_id}/performance',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Campaign Note
     * @returns MarketingNoteOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCampaignNoteAdminMarketingCampaignsCampaignIdNotesPost({
        campaignId,
        requestBody,
    }: {
        campaignId: string,
        requestBody: MarketingNoteIn,
    }): CancelablePromise<MarketingNoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/campaigns/{campaign_id}/notes',
            path: {
                'campaign_id': campaignId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Campaign Notes
     * @returns MarketingNoteOut Successful Response
     * @throws ApiError
     */
    public static apiListCampaignNotesAdminMarketingCampaignsCampaignIdNotesGet({
        campaignId,
    }: {
        campaignId: string,
    }): CancelablePromise<Array<MarketingNoteOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/campaigns/{campaign_id}/notes',
            path: {
                'campaign_id': campaignId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Marketing Collaborations
     * @returns PaginatedResponse_MarketingCollaborationOut_ Successful Response
     * @throws ApiError
     */
    public static apiListMarketingCollaborationsAdminMarketingCollaborationsGet({
        q,
        status,
        typeId,
        partnerId,
        campaignId,
        page = 1,
        pageSize = 20,
    }: {
        q?: (string | null),
        status?: (string | null),
        typeId?: (string | null),
        partnerId?: (string | null),
        campaignId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingCollaborationOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/collaborations',
            query: {
                'q': q,
                'status': status,
                'type_id': typeId,
                'partner_id': partnerId,
                'campaign_id': campaignId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiCreateMarketingCollaborationAdminMarketingCollaborationsPost({
        requestBody,
    }: {
        requestBody: MarketingCollaborationCreate,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiGetMarketingCollaborationAdminMarketingCollaborationsCollaborationIdGet({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/collaborations/{collaboration_id}',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateMarketingCollaborationAdminMarketingCollaborationsCollaborationIdPatch({
        collaborationId,
        requestBody,
    }: {
        collaborationId: string,
        requestBody: MarketingCollaborationUpdate,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/collaborations/{collaboration_id}',
            path: {
                'collaboration_id': collaborationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Submit Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiSubmitMarketingCollaborationAdminMarketingCollaborationsCollaborationIdSubmitPost({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/submit',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Approve Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiApproveMarketingCollaborationAdminMarketingCollaborationsCollaborationIdApprovePost({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/approve',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reject Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiRejectMarketingCollaborationAdminMarketingCollaborationsCollaborationIdRejectPost({
        collaborationId,
        reason,
    }: {
        collaborationId: string,
        reason: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/reject',
            path: {
                'collaboration_id': collaborationId,
            },
            query: {
                'reason': reason,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Prepare Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiPrepareMarketingCollaborationAdminMarketingCollaborationsCollaborationIdPreparePost({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/prepare',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Dispatch Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiDispatchMarketingCollaborationAdminMarketingCollaborationsCollaborationIdDispatchPost({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/dispatch',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Cancel Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiCancelMarketingCollaborationAdminMarketingCollaborationsCollaborationIdCancelPost({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/cancel',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Complete Marketing Collaboration
     * @returns MarketingCollaborationOut Successful Response
     * @throws ApiError
     */
    public static apiCompleteMarketingCollaborationAdminMarketingCollaborationsCollaborationIdCompletePost({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/complete',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Collaboration Performance
     * @returns MarketingPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static apiCollaborationPerformanceAdminMarketingCollaborationsCollaborationIdPerformanceGet({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/collaborations/{collaboration_id}/performance',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Collaboration Timeline
     * @returns MarketingCollaborationTimelineOut Successful Response
     * @throws ApiError
     */
    public static apiCollaborationTimelineAdminMarketingCollaborationsCollaborationIdTimelineGet({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<MarketingCollaborationTimelineOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/collaborations/{collaboration_id}/timeline',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Collaboration Note
     * @returns MarketingNoteOut Successful Response
     * @throws ApiError
     */
    public static apiCreateCollaborationNoteAdminMarketingCollaborationsCollaborationIdNotesPost({
        collaborationId,
        requestBody,
    }: {
        collaborationId: string,
        requestBody: MarketingNoteIn,
    }): CancelablePromise<MarketingNoteOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/notes',
            path: {
                'collaboration_id': collaborationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Collaboration Notes
     * @returns MarketingNoteOut Successful Response
     * @throws ApiError
     */
    public static apiListCollaborationNotesAdminMarketingCollaborationsCollaborationIdNotesGet({
        collaborationId,
    }: {
        collaborationId: string,
    }): CancelablePromise<Array<MarketingNoteOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/collaborations/{collaboration_id}/notes',
            path: {
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Marketing Returns
     * @returns PaginatedResponse_MarketingReturnOut_ Successful Response
     * @throws ApiError
     */
    public static apiListMarketingReturnsAdminMarketingReturnsGet({
        collaborationId,
        partnerId,
        page = 1,
        pageSize = 20,
    }: {
        collaborationId?: (string | null),
        partnerId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingReturnOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/returns',
            query: {
                'collaboration_id': collaborationId,
                'partner_id': partnerId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Marketing Return
     * @returns MarketingReturnOut Successful Response
     * @throws ApiError
     */
    public static apiCreateMarketingReturnAdminMarketingCollaborationsCollaborationIdReturnsPost({
        collaborationId,
        requestBody,
    }: {
        collaborationId: string,
        requestBody: MarketingReturnCreate,
    }): CancelablePromise<MarketingReturnOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/returns',
            path: {
                'collaboration_id': collaborationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Marketing Deliverables
     * @returns PaginatedResponse_MarketingDeliverableOut_ Successful Response
     * @throws ApiError
     */
    public static apiListMarketingDeliverablesAdminMarketingDeliverablesGet({
        status,
        collaborationId,
        overdue,
        page = 1,
        pageSize = 20,
    }: {
        status?: (string | null),
        collaborationId?: (string | null),
        overdue?: (boolean | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingDeliverableOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/deliverables',
            query: {
                'status': status,
                'collaboration_id': collaborationId,
                'overdue': overdue,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Marketing Deliverable
     * @returns MarketingDeliverableOut Successful Response
     * @throws ApiError
     */
    public static apiCreateMarketingDeliverableAdminMarketingCollaborationsCollaborationIdDeliverablesPost({
        collaborationId,
        requestBody,
    }: {
        collaborationId: string,
        requestBody: MarketingDeliverableCreate,
    }): CancelablePromise<MarketingDeliverableOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/collaborations/{collaboration_id}/deliverables',
            path: {
                'collaboration_id': collaborationId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Marketing Deliverable
     * @returns MarketingDeliverableOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateMarketingDeliverableAdminMarketingDeliverablesDeliverableIdPatch({
        deliverableId,
        requestBody,
    }: {
        deliverableId: string,
        requestBody: MarketingDeliverableUpdate,
    }): CancelablePromise<MarketingDeliverableOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/deliverables/{deliverable_id}',
            path: {
                'deliverable_id': deliverableId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Transition Marketing Deliverable
     * @returns MarketingDeliverableOut Successful Response
     * @throws ApiError
     */
    public static apiTransitionMarketingDeliverableAdminMarketingDeliverablesDeliverableIdActionPost({
        deliverableId,
        action,
    }: {
        deliverableId: string,
        action: string,
    }): CancelablePromise<MarketingDeliverableOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/deliverables/{deliverable_id}/{action}',
            path: {
                'deliverable_id': deliverableId,
                'action': action,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Product Costs
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiListProductCostsAdminMarketingProductCostsGet({
        productId,
        page = 1,
        pageSize = 20,
    }: {
        productId?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/product-costs',
            query: {
                'product_id': productId,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Product Cost
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiCreateProductCostAdminMarketingProductCostsPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/product-costs',
        });
    }
    /**
     * Api Get Product Cost
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiGetProductCostAdminMarketingProductCostsCostIdGet({
        costId,
    }: {
        costId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/product-costs/{cost_id}',
            path: {
                'cost_id': costId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Product Cost
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiUpdateProductCostAdminMarketingProductCostsCostIdPatch({
        costId,
    }: {
        costId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/product-costs/{cost_id}',
            path: {
                'cost_id': costId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Current Product Cost
     * @returns any Successful Response
     * @throws ApiError
     */
    public static apiCurrentProductCostAdminMarketingProductCostsCurrentGet({
        productId,
        variantId,
    }: {
        productId: string,
        variantId?: (string | null),
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/product-costs/current',
            query: {
                'product_id': productId,
                'variant_id': variantId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Tracking Links
     * @returns PaginatedResponse_MarketingTrackingLinkOut_ Successful Response
     * @throws ApiError
     */
    public static apiListTrackingLinksAdminMarketingTrackingLinksGet({
        partnerId,
        isActive,
        page = 1,
        pageSize = 20,
    }: {
        partnerId?: (string | null),
        isActive?: (boolean | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_MarketingTrackingLinkOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/tracking-links',
            query: {
                'partner_id': partnerId,
                'is_active': isActive,
                'page': page,
                'page_size': pageSize,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Create Tracking Link
     * @returns MarketingTrackingLinkOut Successful Response
     * @throws ApiError
     */
    public static apiCreateTrackingLinkAdminMarketingTrackingLinksPost({
        requestBody,
    }: {
        requestBody: MarketingTrackingLinkCreate,
    }): CancelablePromise<MarketingTrackingLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/tracking-links',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Get Tracking Link
     * @returns MarketingTrackingLinkOut Successful Response
     * @throws ApiError
     */
    public static apiGetTrackingLinkAdminMarketingTrackingLinksLinkIdGet({
        linkId,
    }: {
        linkId: string,
    }): CancelablePromise<MarketingTrackingLinkOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/tracking-links/{link_id}',
            path: {
                'link_id': linkId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Update Tracking Link
     * @returns MarketingTrackingLinkOut Successful Response
     * @throws ApiError
     */
    public static apiUpdateTrackingLinkAdminMarketingTrackingLinksLinkIdPatch({
        linkId,
        requestBody,
    }: {
        linkId: string,
        requestBody: MarketingTrackingLinkUpdate,
    }): CancelablePromise<MarketingTrackingLinkOut> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/admin/marketing/tracking-links/{link_id}',
            path: {
                'link_id': linkId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Activate Tracking Link
     * @returns MarketingTrackingLinkOut Successful Response
     * @throws ApiError
     */
    public static apiActivateTrackingLinkAdminMarketingTrackingLinksLinkIdActivatePost({
        linkId,
    }: {
        linkId: string,
    }): CancelablePromise<MarketingTrackingLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/tracking-links/{link_id}/activate',
            path: {
                'link_id': linkId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Deactivate Tracking Link
     * @returns MarketingTrackingLinkOut Successful Response
     * @throws ApiError
     */
    public static apiDeactivateTrackingLinkAdminMarketingTrackingLinksLinkIdDeactivatePost({
        linkId,
    }: {
        linkId: string,
    }): CancelablePromise<MarketingTrackingLinkOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/tracking-links/{link_id}/deactivate',
            path: {
                'link_id': linkId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Manual Order Attribution
     * @returns MarketingAttributionOut Successful Response
     * @throws ApiError
     */
    public static apiManualOrderAttributionAdminMarketingOrdersOrderIdAttributionPost({
        orderId,
        requestBody,
    }: {
        orderId: string,
        requestBody: MarketingOrderAttributionIn,
    }): CancelablePromise<MarketingAttributionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/orders/{order_id}/attribution',
            path: {
                'order_id': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api List Commissions
     * @returns PaginatedResponse_PartnerCommissionOut_ Successful Response
     * @throws ApiError
     */
    public static apiListCommissionsAdminMarketingCommissionsGet({
        partnerId,
        status,
        page = 1,
        pageSize = 20,
    }: {
        partnerId?: (string | null),
        status?: (string | null),
        page?: number,
        pageSize?: number,
    }): CancelablePromise<PaginatedResponse_PartnerCommissionOut_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/commissions',
            query: {
                'partner_id': partnerId,
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
     * Api Get Commission
     * @returns PartnerCommissionOut Successful Response
     * @throws ApiError
     */
    public static apiGetCommissionAdminMarketingCommissionsCommissionIdGet({
        commissionId,
    }: {
        commissionId: string,
    }): CancelablePromise<PartnerCommissionOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/commissions/{commission_id}',
            path: {
                'commission_id': commissionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Approve Commission
     * @returns PartnerCommissionOut Successful Response
     * @throws ApiError
     */
    public static apiApproveCommissionAdminMarketingCommissionsCommissionIdApprovePost({
        commissionId,
    }: {
        commissionId: string,
    }): CancelablePromise<PartnerCommissionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/commissions/{commission_id}/approve',
            path: {
                'commission_id': commissionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Mark Payable Commission
     * @returns PartnerCommissionOut Successful Response
     * @throws ApiError
     */
    public static apiMarkPayableCommissionAdminMarketingCommissionsCommissionIdMarkPayablePost({
        commissionId,
    }: {
        commissionId: string,
    }): CancelablePromise<PartnerCommissionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/commissions/{commission_id}/mark-payable',
            path: {
                'commission_id': commissionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Mark Paid Commission
     * @returns PartnerCommissionOut Successful Response
     * @throws ApiError
     */
    public static apiMarkPaidCommissionAdminMarketingCommissionsCommissionIdMarkPaidPost({
        commissionId,
    }: {
        commissionId: string,
    }): CancelablePromise<PartnerCommissionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/commissions/{commission_id}/mark-paid',
            path: {
                'commission_id': commissionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Reverse Commission
     * @returns PartnerCommissionOut Successful Response
     * @throws ApiError
     */
    public static apiReverseCommissionAdminMarketingCommissionsCommissionIdReversePost({
        commissionId,
        reason,
    }: {
        commissionId: string,
        reason?: (string | null),
    }): CancelablePromise<PartnerCommissionOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/marketing/commissions/{commission_id}/reverse',
            path: {
                'commission_id': commissionId,
            },
            query: {
                'reason': reason,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Marketing Dashboard
     * @returns MarketingDashboardResponse Successful Response
     * @throws ApiError
     */
    public static apiMarketingDashboardAdminMarketingDashboardGet(): CancelablePromise<MarketingDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/dashboard',
        });
    }
    /**
     * Api Marketing Performance
     * @returns MarketingPerformanceResponse Successful Response
     * @throws ApiError
     */
    public static apiMarketingPerformanceAdminMarketingPerformanceGet({
        partnerId,
        campaignId,
        collaborationId,
    }: {
        partnerId?: (string | null),
        campaignId?: (string | null),
        collaborationId?: (string | null),
    }): CancelablePromise<MarketingPerformanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/marketing/performance',
            query: {
                'partner_id': partnerId,
                'campaign_id': campaignId,
                'collaboration_id': collaborationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
