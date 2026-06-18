"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Eye, Film, Heart, Loader2, MessageCircle, Play, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import AuthModal from "@/app/components/AuthModal"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import type { VlogChapter, VlogComment, VlogEpisode, VlogPage } from "@/types/api"
import { trackEvent } from "@/lib/store-analytics"

const fallbackVlog: VlogPage = {
  settings: {
    title: "Savage Rise Chapters",
    subtitle: "Every 3 drops tell one story",
    description:
      "Each chapter unfolds through three drops, three films, and one final short movie that connects the full story.",
    hero_video_url: "https://ik.imagekit.io/deuxug3j0/store-savage-rise/vlog/concept/drop_nDMB4trDtU.mp4",
    is_active: true,
  },
  chapters: [],
}

function formatDate(date?: string | null) {
  if (!date) return null

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "released":
    case "active":
      return "Available"
    case "completed":
      return "Complete"
    case "coming_soon":
      return "Coming soon"
    default:
      return "Preview"
  }
}

function sortEpisodes(episodes?: VlogEpisode[]) {
  return [...(episodes ?? [])].sort((a, b) => {
    const orderA = a.order ?? a.episode_number
    const orderB = b.order ?? b.episode_number
    return orderA - orderB
  })
}

function formatCount(value?: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0)
}

function EpisodeCard({
  episode,
  onEpisodeUpdate,
  onRequireAuth,
}: {
  episode: VlogEpisode
  onEpisodeUpdate: (episodeId: string, updates: Partial<VlogEpisode>) => void
  onRequireAuth: () => void
}) {
  const releaseDate = formatDate(episode.release_date)
  const hasVideo = Boolean(episode.video_url)
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [hasTrackedView, setHasTrackedView] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [comments, setComments] = useState<VlogComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const handleTrackView = async () => {
    if (hasTrackedView) return
    setHasTrackedView(true)

    try {
      const data = await api.trackVlogEpisodeView(episode.id)
      trackEvent("button_clicked", {
        metadata: {
          action: "vlog_episode_viewed",
          episode_id: episode.id,
          episode_title: episode.title,
        },
      })
      onEpisodeUpdate(episode.id, { view_count: data.view_count })
    } catch (error) {
    }
  }

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }
    if (isLiking) return

    const wasLiked = Boolean(episode.liked_by_current_user)
    setIsLiking(true)
    onEpisodeUpdate(episode.id, {
      liked_by_current_user: !wasLiked,
      like_count: Math.max(0, (episode.like_count ?? 0) + (wasLiked ? -1 : 1)),
    })

    try {
      const data = wasLiked ? await api.unlikeVlogEpisode(episode.id) : await api.likeVlogEpisode(episode.id)
      trackEvent("button_clicked", {
        metadata: {
          action: wasLiked ? "vlog_episode_unliked" : "vlog_episode_liked",
          episode_id: episode.id,
          episode_title: episode.title,
        },
      })
      onEpisodeUpdate(episode.id, {
        liked_by_current_user: data.liked,
        like_count: data.like_count,
      })
    } catch (error) {
      onEpisodeUpdate(episode.id, {
        liked_by_current_user: wasLiked,
        like_count: episode.like_count,
      })
      toast({
        title: "Like not saved",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const loadComments = async () => {
    setCommentsLoading(true)
    try {
      const data = await api.getVlogEpisodeComments(episode.id)
      setComments(data)
    } catch (error) {
      toast({
        title: "Comments unavailable",
        description: "Unable to load comments for this episode.",
        variant: "destructive",
      })
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleToggleComments = () => {
    const nextOpen = !commentsOpen
    setCommentsOpen(nextOpen)
    trackEvent("button_clicked", {
      metadata: {
        action: nextOpen ? "vlog_comments_opened" : "vlog_comments_closed",
        episode_id: episode.id,
        episode_title: episode.title,
      },
    })
    if (nextOpen && comments.length === 0) {
      void loadComments()
    }
  }

  const handleSubmitComment = async () => {
    const content = commentText.trim()
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }
    if (!content || commentSubmitting) return

    setCommentSubmitting(true)
    try {
      const comment = await api.addVlogEpisodeComment(episode.id, content)
      setComments((current) => [comment, ...current])
      setCommentText("")
      onEpisodeUpdate(episode.id, { comment_count: (episode.comment_count ?? 0) + 1 })
      trackEvent("button_clicked", {
        metadata: {
          action: "vlog_comment_added",
          episode_id: episode.id,
          episode_title: episode.title,
        },
      })
      toast({ title: "Comment posted" })
    } catch (error) {
      toast({
        title: "Comment not posted",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setCommentSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.deleteVlogEpisodeComment(episode.id, commentId)
      setComments((current) => current.filter((comment) => comment.id !== commentId))
      onEpisodeUpdate(episode.id, { comment_count: Math.max(0, (episode.comment_count ?? 0) - 1) })
      trackEvent("button_clicked", {
        metadata: {
          action: "vlog_comment_deleted",
          episode_id: episode.id,
          episode_title: episode.title,
          comment_id: commentId,
        },
      })
    } catch (error) {
      toast({
        title: "Comment not deleted",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    }
  }

  return (
    <article className="overflow-hidden rounded-md border border-white/10 bg-zinc-950">
      <div className="relative aspect-video bg-zinc-900">
        {hasVideo ? (
          <video
            src={episode.video_url ?? undefined}
            poster={episode.thumbnail_url ?? undefined}
            controls
            playsInline
            preload="metadata"
            onPlay={handleTrackView}
            className="h-full w-full object-cover"
          />
        ) : episode.thumbnail_url ? (
          <Image src={episode.thumbnail_url} alt={episode.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900">
            <Clock className="h-10 w-10 text-gold" />
          </div>
        )}
        {!hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full border border-gold/60 bg-black/70 px-4 py-2 text-sm font-semibold text-gold">
              Coming soon
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span className="rounded-full bg-gold px-3 py-1 font-semibold text-black">
            Drop {String(episode.episode_number).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1">{getStatusLabel(episode.status)}</span>
          {releaseDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {releaseDate}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">{episode.title}</h3>
          {episode.description && <p className="mt-2 text-sm leading-6 text-gray-400">{episode.description}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-y border-white/10 py-3 text-sm text-gray-300">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
            <Eye className="h-4 w-4 text-gold" />
            {formatCount(episode.view_count)} views
          </span>
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              episode.liked_by_current_user
                ? "bg-gold text-black"
                : "bg-white/5 text-gray-300 hover:bg-gold/10 hover:text-gold"
            }`}
          >
            <Heart className={`h-4 w-4 ${episode.liked_by_current_user ? "fill-current" : ""}`} />
            {formatCount(episode.like_count)}
          </button>
          <button
            type="button"
            onClick={handleToggleComments}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 transition-colors hover:bg-gold/10 hover:text-gold"
          >
            <MessageCircle className="h-4 w-4 text-gold" />
            {formatCount(episode.comment_count)}
          </button>
        </div>

        {commentsOpen && (
          <div className="space-y-4 rounded-md border border-white/10 bg-black/35 p-3">
            <div className="space-y-2">
              <Textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={isAuthenticated ? "Write a comment..." : "Sign in to comment"}
                disabled={!isAuthenticated || commentSubmitting}
                className="min-h-[88px] border-white/10 bg-black text-white placeholder:text-gray-500"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={commentSubmitting || (isAuthenticated && !commentText.trim())}
                  className="bg-gold text-black hover:bg-gold/90"
                >
                  {commentSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {isAuthenticated ? "Post" : "Sign in"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {commentsLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading comments
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-md border border-white/10 bg-zinc-950 p-3">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">{comment.author ?? "Savage viewer"}</span>
                      {user?.id === comment.user_id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-500 transition-colors hover:text-red-300"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm leading-6 text-gray-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        )}

        {episode.products && episode.products.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-4">
            {episode.products.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center justify-between gap-3 text-sm text-gray-300 transition-colors hover:text-gold"
              >
                <span className="min-w-0 truncate">{product.full_name ?? product.name}</span>
                <span className="shrink-0 text-gold">{formatPrice(product.price)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function ChapterSection({
  chapter,
  onEpisodeUpdate,
  onRequireAuth,
}: {
  chapter: VlogChapter
  onEpisodeUpdate: (episodeId: string, updates: Partial<VlogEpisode>) => void
  onRequireAuth: () => void
}) {
  const episodes = sortEpisodes(chapter.episodes)
  const releaseDate = formatDate(chapter.release_date)
  const shortFilm = chapter.short_film

  return (
    <section className="border-t border-white/10 py-12 md:py-16" id={chapter.slug}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-10">
        <div className="space-y-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-zinc-900 sm:aspect-[16/10] lg:sticky lg:top-24 lg:aspect-[4/5]">
            {chapter.trailer_video_url ? (
              <video
                src={chapter.trailer_video_url}
                poster={chapter.cover_image_url ?? undefined}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : chapter.cover_image_url ? (
              <Image src={chapter.cover_image_url} alt={chapter.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-12 w-12 text-gold" />
              </div>
            )}
            <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-gold">
              {getStatusLabel(chapter.status)}
            </div>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span>Chapter {chapter.order ?? 1}</span>
              {releaseDate && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {releaseDate}
                </span>
              )}
            </div>
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">{chapter.title}</h2>
            {chapter.description && <p className="mt-4 leading-7 text-gray-300">{chapter.description}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {episodes.length > 0
              ? episodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    onEpisodeUpdate={onEpisodeUpdate}
                    onRequireAuth={onRequireAuth}
                  />
                ))
              : [1, 2, 3].map((dropNumber) => (
                  <div key={dropNumber} className="rounded-md border border-dashed border-white/15 bg-zinc-950 p-5">
                    <div className="mb-4 flex aspect-video items-center justify-center rounded bg-zinc-900">
                      <Clock className="h-8 w-8 text-gold" />
                    </div>
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                      Drop {String(dropNumber).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">Coming soon</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-400">This part of the chapter will appear here.</p>
                  </div>
                ))}
          </div>

          {shortFilm && (
            <article className="overflow-hidden rounded-md border border-gold/30 bg-zinc-950">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
                <div className="relative aspect-video bg-zinc-900">
                  {shortFilm.video_url ? (
                    <video
                      src={shortFilm.video_url}
                      poster={shortFilm.thumbnail_url ?? undefined}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : shortFilm.thumbnail_url ? (
                    <Image src={shortFilm.thumbnail_url} alt={shortFilm.title ?? chapter.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Film className="h-10 w-10 text-gold" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-6">
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                    <Film className="h-3.5 w-3.5" />
                    Short film
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{shortFilm.title ?? `${chapter.title}: The Film`}</h3>
                  {shortFilm.description && <p className="mt-3 leading-7 text-gray-300">{shortFilm.description}</p>}
                  {!shortFilm.is_released && (
                    <p className="mt-4 text-sm font-semibold text-gold">Final film coming soon</p>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  )
}

export default function VlogPage() {
  const [vlog, setVlog] = useState<VlogPage>(fallbackVlog)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchVlog() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getVlogPage()
        if (isMounted) setVlog({ settings: data.settings, chapters: data.chapters ?? [] })
      } catch (err) {
        if (isMounted) setError("Unable to load the latest vlog content.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchVlog()

    return () => {
      isMounted = false
    }
  }, [])

  const chapters = useMemo(
    () => [...(vlog.chapters ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [vlog.chapters],
  )
  const settings = vlog.settings
  const heroTitle = settings.title ?? fallbackVlog.settings.title
  const heroDescription = settings.description ?? fallbackVlog.settings.description
  const heroVideo = settings.hero_video_url ?? fallbackVlog.settings.hero_video_url

  const updateEpisode = (episodeId: string, updates: Partial<VlogEpisode>) => {
    setVlog((current) => ({
      ...current,
      chapters: current.chapters?.map((chapter) => ({
        ...chapter,
        episodes: chapter.episodes?.map((episode) =>
          episode.id === episodeId ? { ...episode, ...updates } : episode,
        ),
      })),
    }))
  }

  return (
    <>
    <main className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-[78vh] items-end overflow-hidden pt-20">
        {heroVideo ? (
          <video src={heroVideo} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        ) : settings.hero_image_url ? (
          <Image src={settings.hero_image_url} alt={heroTitle ?? "Savage Rise Vlog"} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-zinc-950" />
        )}
        <div className="absolute inset-0 bg-black/60" />

        <div className="container relative z-10 mx-auto px-4 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/50 px-4 py-2 text-sm font-semibold text-gold">
              <Play className="h-4 w-4 fill-current" />
              Vlog
            </div>
            {settings.subtitle && <p className="mb-3 text-sm font-semibold uppercase text-gold">{settings.subtitle}</p>}
            <h1 className="font-playfair text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">{heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">{heroDescription}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-gold text-black hover:bg-gold/90">
                <a href="#chapters">
                  Watch chapters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/70 bg-black/20 text-white hover:bg-white hover:text-black">
                <Link href="/products">Explore drops</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="chapters" className="container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-gold">Chapters</p>
            <h2 className="font-playfair text-3xl font-bold sm:text-4xl">Three drops. One story.</h2>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading
            </div>
          )}
        </div>

        {error && <p className="mb-6 rounded-md border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}

        {chapters.length > 0 ? (
          chapters.map((chapter) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              onEpisodeUpdate={updateEpisode}
              onRequireAuth={() => setShowAuthModal(true)}
            />
          ))
        ) : (
          <div className="rounded-md border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
              <div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black">
                  <Film className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold">The first chapter is being prepared</h3>
                <p className="mt-3 leading-7 text-gray-400">
                  When we publishes a chapter, this space will show its three drops, their videos, linked products,
                  and the final short film.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((dropNumber) => (
                  <div key={dropNumber} className="rounded-md border border-dashed border-white/15 bg-black p-4">
                    <div className="mb-4 flex aspect-video items-center justify-center rounded bg-zinc-900">
                      <Clock className="h-8 w-8 text-gold" />
                    </div>
                    <p className="text-sm font-semibold text-gold">Drop {String(dropNumber).padStart(2, "0")}</p>
                    <p className="mt-2 text-sm text-gray-400">Coming soon</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
    <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab="login" />
    </>
  )
}
