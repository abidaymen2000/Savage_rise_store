/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_admin_upload_vlog_media_admin_vlog_media_upload_post } from '../models/Body_admin_upload_vlog_media_admin_vlog_media_upload_post';
import type { ImageKitDirectUploadAuth } from '../models/ImageKitDirectUploadAuth';
import type { ShortFilmUpdate } from '../models/ShortFilmUpdate';
import type { VlogChapterCreate } from '../models/VlogChapterCreate';
import type { VlogChapterOut } from '../models/VlogChapterOut';
import type { VlogChapterUpdate } from '../models/VlogChapterUpdate';
import type { VlogChapterWithEpisodesOut } from '../models/VlogChapterWithEpisodesOut';
import type { VlogEpisodeCreate } from '../models/VlogEpisodeCreate';
import type { VlogEpisodeOut } from '../models/VlogEpisodeOut';
import type { VlogEpisodeUpdate } from '../models/VlogEpisodeUpdate';
import type { VlogMediaAsset } from '../models/VlogMediaAsset';
import type { VlogMediaOut } from '../models/VlogMediaOut';
import type { VlogMediaRegister } from '../models/VlogMediaRegister';
import type { VlogSettingsOut } from '../models/VlogSettingsOut';
import type { VlogSettingsUpdate } from '../models/VlogSettingsUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminVlogService {
    /**
     * Admin Get Vlog Settings
     * @returns VlogSettingsOut Successful Response
     * @throws ApiError
     */
    public static adminGetVlogSettingsAdminVlogSettingsGet(): CancelablePromise<VlogSettingsOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vlog/settings',
        });
    }
    /**
     * Admin Update Vlog Settings
     * @returns VlogSettingsOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateVlogSettingsAdminVlogSettingsPut({
        requestBody,
    }: {
        requestBody: VlogSettingsUpdate,
    }): CancelablePromise<VlogSettingsOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/vlog/settings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Upload Vlog Media
     * @returns VlogMediaAsset Successful Response
     * @throws ApiError
     */
    public static adminUploadVlogMediaAdminVlogMediaUploadPost({
        mediaType,
        formData,
    }: {
        mediaType: 'concept-image' | 'concept-video' | 'chapter-cover' | 'chapter-trailer' | 'episode-video' | 'episode-thumbnail' | 'short-film',
        formData: Body_admin_upload_vlog_media_admin_vlog_media_upload_post,
    }): CancelablePromise<VlogMediaAsset> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vlog/media/upload',
            query: {
                'media_type': mediaType,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get Vlog Media Upload Auth
     * @returns ImageKitDirectUploadAuth Successful Response
     * @throws ApiError
     */
    public static adminGetVlogMediaUploadAuthAdminVlogMediaUploadAuthGet({
        mediaType,
    }: {
        mediaType: 'concept-image' | 'concept-video' | 'chapter-cover' | 'chapter-trailer' | 'episode-video' | 'episode-thumbnail' | 'short-film',
    }): CancelablePromise<ImageKitDirectUploadAuth> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vlog/media/upload-auth',
            query: {
                'media_type': mediaType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Register Uploaded Vlog Media
     * @returns VlogMediaOut Successful Response
     * @throws ApiError
     */
    public static adminRegisterUploadedVlogMediaAdminVlogMediaRegisterPost({
        requestBody,
    }: {
        requestBody: VlogMediaRegister,
    }): CancelablePromise<VlogMediaOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vlog/media/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Vlog Media
     * @returns VlogMediaOut Successful Response
     * @throws ApiError
     */
    public static adminListVlogMediaAdminVlogMediaGet({
        mediaType,
        limit = 50,
        skip,
    }: {
        mediaType?: ('concept-image' | 'concept-video' | 'chapter-cover' | 'chapter-trailer' | 'episode-video' | 'episode-thumbnail' | 'short-film' | null),
        limit?: number,
        skip?: number,
    }): CancelablePromise<Array<VlogMediaOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vlog/media',
            query: {
                'media_type': mediaType,
                'limit': limit,
                'skip': skip,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Vlog Chapters
     * @returns VlogChapterWithEpisodesOut Successful Response
     * @throws ApiError
     */
    public static adminListVlogChaptersAdminVlogChaptersGet(): CancelablePromise<Array<VlogChapterWithEpisodesOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vlog/chapters',
        });
    }
    /**
     * Admin Create Vlog Chapter
     * @returns VlogChapterOut Successful Response
     * @throws ApiError
     */
    public static adminCreateVlogChapterAdminVlogChaptersPost({
        requestBody,
    }: {
        requestBody: VlogChapterCreate,
    }): CancelablePromise<VlogChapterOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vlog/chapters',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Get Vlog Chapter
     * @returns VlogChapterWithEpisodesOut Successful Response
     * @throws ApiError
     */
    public static adminGetVlogChapterAdminVlogChaptersChapterIdGet({
        chapterId,
    }: {
        chapterId: string,
    }): CancelablePromise<VlogChapterWithEpisodesOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vlog/chapters/{chapter_id}',
            path: {
                'chapter_id': chapterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Vlog Chapter
     * @returns VlogChapterOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateVlogChapterAdminVlogChaptersChapterIdPut({
        chapterId,
        requestBody,
    }: {
        chapterId: string,
        requestBody: VlogChapterUpdate,
    }): CancelablePromise<VlogChapterOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/vlog/chapters/{chapter_id}',
            path: {
                'chapter_id': chapterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Delete Vlog Chapter
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteVlogChapterAdminVlogChaptersChapterIdDelete({
        chapterId,
        deleteEpisodes = false,
    }: {
        chapterId: string,
        deleteEpisodes?: boolean,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/vlog/chapters/{chapter_id}',
            path: {
                'chapter_id': chapterId,
            },
            query: {
                'delete_episodes': deleteEpisodes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Chapter Short Film
     * @returns VlogChapterOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateChapterShortFilmAdminVlogChaptersChapterIdShortFilmPut({
        chapterId,
        requestBody,
    }: {
        chapterId: string,
        requestBody: ShortFilmUpdate,
    }): CancelablePromise<VlogChapterOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/vlog/chapters/{chapter_id}/short-film',
            path: {
                'chapter_id': chapterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Create Vlog Episode
     * @returns VlogEpisodeOut Successful Response
     * @throws ApiError
     */
    public static adminCreateVlogEpisodeAdminVlogChaptersChapterIdEpisodesPost({
        chapterId,
        requestBody,
    }: {
        chapterId: string,
        requestBody: VlogEpisodeCreate,
    }): CancelablePromise<VlogEpisodeOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/admin/vlog/chapters/{chapter_id}/episodes',
            path: {
                'chapter_id': chapterId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin List Vlog Episodes
     * @returns VlogEpisodeOut Successful Response
     * @throws ApiError
     */
    public static adminListVlogEpisodesAdminVlogChaptersChapterIdEpisodesGet({
        chapterId,
    }: {
        chapterId: string,
    }): CancelablePromise<Array<VlogEpisodeOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/admin/vlog/chapters/{chapter_id}/episodes',
            path: {
                'chapter_id': chapterId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Update Vlog Episode
     * @returns VlogEpisodeOut Successful Response
     * @throws ApiError
     */
    public static adminUpdateVlogEpisodeAdminVlogEpisodesEpisodeIdPut({
        episodeId,
        requestBody,
    }: {
        episodeId: string,
        requestBody: VlogEpisodeUpdate,
    }): CancelablePromise<VlogEpisodeOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/admin/vlog/episodes/{episode_id}',
            path: {
                'episode_id': episodeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Admin Delete Vlog Episode
     * @returns void
     * @throws ApiError
     */
    public static adminDeleteVlogEpisodeAdminVlogEpisodesEpisodeIdDelete({
        episodeId,
    }: {
        episodeId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/admin/vlog/episodes/{episode_id}',
            path: {
                'episode_id': episodeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
