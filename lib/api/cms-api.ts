import {
  ContactService,
  DropCountdownService,
  HeaderVideoService,
  StorefrontVlogService,
  type DropCountdownOut,
  type DropNotificationStatus,
  type HeaderVideoConfig,
  type VlogChapterWithEpisodesOut,
  type VlogCommentOut,
  type VlogEpisodeLikeOut,
  type VlogEpisodeViewOut,
  type VlogPageOut,
} from "./generated"
import { withApiErrors } from "./api-error"
import type {
  ContactMessage,
  DropCountdown,
  HeaderVideo,
  VlogChapter,
  VlogComment,
  VlogCommentCreate,
  VlogEpisodeLike,
  VlogEpisodeView,
  VlogPage,
} from "@/types/api"

export const cmsApi = {
  async getHeaderVideo(): Promise<HeaderVideo> {
    return (await withApiErrors(HeaderVideoService.readStorefrontHeaderVideoStorefrontHeaderVideoGet())) as HeaderVideoConfig as HeaderVideo
  },

  async getDropCountdown(): Promise<DropCountdown> {
    return (await withApiErrors(DropCountdownService.readStorefrontDropCountdownStorefrontDropCountdownGet())) as DropCountdownOut as DropCountdown
  },

  async getDropNotificationStatus(): Promise<DropNotificationStatus> {
    return withApiErrors(DropCountdownService.readDropNotificationStatusStorefrontDropCountdownNotificationStatusGet())
  },

  async subscribeDropNotification(): Promise<DropNotificationStatus> {
    return withApiErrors(DropCountdownService.subscribeDropNotificationStorefrontDropCountdownNotifyMePost())
  },

  async unsubscribeDropNotification(): Promise<DropNotificationStatus> {
    return withApiErrors(DropCountdownService.unsubscribeDropNotificationStorefrontDropCountdownNotifyMeDelete())
  },

  async getVlogPage(): Promise<VlogPage> {
    return (await withApiErrors(StorefrontVlogService.readStorefrontVlogStorefrontVlogGet())) as VlogPageOut as VlogPage
  },

  async getVlogChapter(slug: string): Promise<VlogChapter> {
    return (await withApiErrors(StorefrontVlogService.readStorefrontVlogChapterStorefrontVlogChaptersSlugGet({ slug }))) as VlogChapterWithEpisodesOut as VlogChapter
  },

  async trackVlogEpisodeView(episodeId: string): Promise<VlogEpisodeView> {
    return (await withApiErrors(StorefrontVlogService.trackVlogEpisodeViewStorefrontVlogEpisodesEpisodeIdViewPost({ episodeId }))) as VlogEpisodeViewOut as VlogEpisodeView
  },

  async likeVlogEpisode(episodeId: string): Promise<VlogEpisodeLike> {
    return (await withApiErrors(StorefrontVlogService.likeVlogEpisodeStorefrontVlogEpisodesEpisodeIdLikePost({ episodeId }))) as VlogEpisodeLikeOut as VlogEpisodeLike
  },

  async unlikeVlogEpisode(episodeId: string): Promise<VlogEpisodeLike> {
    return (await withApiErrors(StorefrontVlogService.unlikeVlogEpisodeStorefrontVlogEpisodesEpisodeIdLikeDelete({ episodeId }))) as VlogEpisodeLikeOut as VlogEpisodeLike
  },

  async getVlogEpisodeComments(episodeId: string, skip = 0, limit = 20): Promise<VlogComment[]> {
    return (await withApiErrors(StorefrontVlogService.listVlogEpisodeCommentsStorefrontVlogEpisodesEpisodeIdCommentsGet({
      episodeId,
      skip,
      limit,
    }))) as VlogCommentOut[] as VlogComment[]
  },

  async addVlogEpisodeComment(episodeId: string, content: string): Promise<VlogComment> {
    const requestBody: VlogCommentCreate = { content }
    return (await withApiErrors(StorefrontVlogService.createVlogEpisodeCommentStorefrontVlogEpisodesEpisodeIdCommentsPost({
      episodeId,
      requestBody,
    }))) as VlogCommentOut as VlogComment
  },

  async deleteVlogEpisodeComment(episodeId: string, commentId: string): Promise<void> {
    await withApiErrors(StorefrontVlogService.deleteOwnVlogEpisodeCommentStorefrontVlogEpisodesEpisodeIdCommentsCommentIdDelete({
      episodeId,
      commentId,
    }))
  },

  async sendContact(data: ContactMessage): Promise<void> {
    await withApiErrors(ContactService.submitContactContactPost({ requestBody: data }))
  },
}

