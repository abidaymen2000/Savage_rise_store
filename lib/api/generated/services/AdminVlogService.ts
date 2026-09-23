/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__schemas__vlog__ImageKitDirectUploadAuth } from '../models/app__schemas__vlog__ImageKitDirectUploadAuth';
import type { ShortFilmUpdate } from '../models/ShortFilmUpdate';
import type { VlogChapterCreate } from '../models/VlogChapterCreate';
import type { VlogChapterOut } from '../models/VlogChapterOut';
import type { VlogChapterUpdate } from '../models/VlogChapterUpdate';
import type { VlogChapterWithEpisodesOut } from '../models/VlogChapterWithEpisodesOut';
import type { VlogEpisodeCreate } from '../models/VlogEpisodeCreate';
import type { VlogEpisodeOut } from '../models/VlogEpisodeOut';
import type { VlogEpisodeUpdate } from '../models/VlogEpisodeUpdate';
import type { VlogMediaOut } from '../models/VlogMediaOut';
import type { VlogMediaRegister } from '../models/VlogMediaRegister';
import type { VlogSettingsOut } from '../models/VlogSettingsOut';
import type { VlogSettingsUpdate } from '../models/VlogSettingsUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminVlogService {
    /**
     * @deprecated
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
     * @deprecated
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
     * @deprecated
     * Admin Get Vlog Media Upload Auth
     * @returns app__schemas__vlog__ImageKitDirectUploadAuth Successful Response
     * @throws ApiError
     */
    public static adminGetVlogMediaUploadAuthAdminVlogMediaUploadAuthGet({
        mediaType,
    }: {
        mediaType: 'concept-image' | 'concept-video' | 'chapter-cover' | 'chapter-trailer' | 'episode-video' | 'episode-thumbnail' | 'short-film',
    }): CancelablePromise<app__schemas__vlog__ImageKitDirectUploadAuth> {
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
     * @deprecated
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
