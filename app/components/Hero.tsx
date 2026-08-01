"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Bell, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import StorefrontMedia from "@/components/storefront/media/storefront-media"
import { api } from "@/lib/api"
import { getStorefrontContent } from "@/lib/storefront/content"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "./AuthModal"
import type { DropCountdown, DropNotificationStatus } from "@/types/api"
import { trackStoreEvent } from "@/lib/store-analytics"

const DROP_COUNTDOWN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DROP_COUNTDOWN === "true"

type HeroSlide = {
  type: "video" | "image"
  src: string
  poster?: string
  title?: string | null
  subtitle?: string | null
  description?: string | null
}

function getRemainingSeconds(drop: DropCountdown | null) {
  if (!drop?.launch_at) return 0
  return Math.max(0, Math.floor((new Date(drop.launch_at).getTime() - Date.now()) / 1000))
}

function formatCountdown(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (seconds <= 0) return "Disponible maintenant"
  if (days > 0) return `${days}j ${hours}h ${minutes}m`
  return `${hours}h ${minutes}m`
}

export default function Hero() {
  const content = getStorefrontContent()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [drop, setDrop] = useState<DropCountdown | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [notificationStatus, setNotificationStatus] = useState<DropNotificationStatus | null>(null)
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let mounted = true
    api
      .getHeaderVideo()
      .then((headerVideo) => {
        if (!mounted) return
        const nextSlides: HeroSlide[] = []
        if (headerVideo.video?.url) {
          nextSlides.push({
            type: "video",
            src: headerVideo.video.url,
            poster: headerVideo.image?.url ?? headerVideo.video.thumbnail_url ?? undefined,
            title: headerVideo.title,
            subtitle: headerVideo.subtitle,
            description: headerVideo.description,
          })
        }
        if (headerVideo.image?.url) {
          nextSlides.push({
            type: "image",
            src: headerVideo.image.url,
            title: headerVideo.title,
            subtitle: headerVideo.subtitle,
            description: headerVideo.description,
          })
        }
        setSlides(nextSlides)
        setCurrentSlide(0)
      })
      .catch(() => setSlides([]))
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!DROP_COUNTDOWN_ENABLED) return
    let mounted = true
    api
      .getDropCountdown()
      .then((data) => {
        if (!mounted || !data?.is_active) return
        setDrop(data)
        setRemaining(getRemainingSeconds(data))
      })
      .catch(() => undefined)
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!drop || drop.is_released) return
    const timer = window.setInterval(() => setRemaining(getRemainingSeconds(drop)), 30000)
    return () => window.clearInterval(timer)
  }, [drop])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => setCurrentSlide((current) => (current + 1) % slides.length), 7000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    if (!isAuthenticated || !drop?.email_enabled) {
      setNotificationStatus(null)
      return
    }
    api.getDropNotificationStatus().then(setNotificationStatus).catch(() => setNotificationStatus(null))
  }, [drop?.email_enabled, isAuthenticated])

  const activeSlide = slides[currentSlide]
  const slide = activeSlide
  const hasActiveDrop = Boolean(drop?.is_active)
  const isDropReleased = Boolean(drop?.is_released || (drop && remaining <= 0))
  const heroTitle = hasActiveDrop ? drop?.title ?? drop?.drop_name ?? content.hero.title : activeSlide?.title ?? content.hero.title
  const heroEyebrow = hasActiveDrop ? (isDropReleased ? "Drop disponible" : formatCountdown(remaining)) : activeSlide?.subtitle ?? content.hero.eyebrow
  const heroDescription = hasActiveDrop ? drop?.subtitle ?? content.hero.subtitle : activeSlide?.description ?? content.hero.subtitle
  const discoverUrl = useMemo(() => {
    if (!drop?.cta_url) return content.hero.primaryCta.href
    return drop.cta_url.startsWith("/") ? drop.cta_url : `/${drop.cta_url}`
  }, [content.hero.primaryCta.href, drop?.cta_url])
  const media = activeSlide
    ? { type: activeSlide.type, src: activeSlide.src, poster: activeSlide.poster, alt: String(heroTitle) }
    : content.hero.media
  const isHeroVideo = Boolean(slide && slide.type === "video")
  const heroMediaClassName =
    isHeroVideo
      ? "object-cover object-[50%_50%]"
      : `object-cover object-center ${
          hasActiveDrop
            ? "blur-[7px] brightness-[0.68]"
            : "blur-[3px] brightness-[0.76]"
        }`

  const toggleDropNotification = useCallback(async () => {
    if (!drop?.email_enabled || isDropReleased) return
    trackStoreEvent("notify_me_clicked", {
      metadata: {
        drop_name: drop.drop_name,
        drop_title: drop.title,
        already_subscribed: notificationStatus?.is_subscribed ?? false,
      },
    })
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setIsNotificationLoading(true)
    try {
      const next = notificationStatus?.is_subscribed ? await api.unsubscribeDropNotification() : await api.subscribeDropNotification()
      setNotificationStatus(next)
    } finally {
      setIsNotificationLoading(false)
    }
  }, [drop, isAuthenticated, isDropReleased, notificationStatus?.is_subscribed])

  return (
    <>
      <section className="relative min-h-[calc(100svh-2.5rem)] overflow-hidden bg-black pt-28 text-white md:min-h-[calc(100dvh-2.5rem)]">
        <StorefrontMedia
          media={media}
          priority
          sizes="100vw"
          className="absolute inset-0"
          imageClassName={heroMediaClassName}
          containPortraitVideoOnDesktop={isHeroVideo}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
        <div className="relative z-10 flex min-h-[calc(100svh-7rem)] items-end px-4 pb-10 sm:px-6 md:min-h-[calc(100dvh-7rem)] md:items-center md:pb-0">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">{heroEyebrow}</p>
            <div className="max-w-3xl">
              <h1 className="font-playfair text-5xl font-semibold leading-[0.95] text-[rgba(255,255,255,0.98)] sm:text-6xl lg:text-8xl">{heroTitle}</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-100 sm:text-lg">{heroDescription}</p>
              {content.hero.price && <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-300">{content.hero.price}</p>}
            </div>
            <div className="flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row">
              <Button asChild className="h-12 rounded-none bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-[#D4AF37]">
                <Link
                  href={discoverUrl}
                  onClick={() =>
                    trackStoreEvent("button_clicked", {
                      metadata: { button: "hero_primary", href: discoverUrl, has_active_drop: hasActiveDrop },
                    })
                  }
                >
                  {hasActiveDrop ? drop?.cta_label ?? "Voir le Drop" : content.hero.primaryCta.label}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {hasActiveDrop && drop?.email_enabled && !isDropReleased ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isNotificationLoading}
                  onClick={toggleDropNotification}
                  className="h-12 rounded-none border-white/70 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black"
                >
                  {notificationStatus?.is_subscribed ? <Check className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
                  {notificationStatus?.is_subscribed ? "Inscrit" : "Me prevenir"}
                </Button>
              ) : (
                <Button asChild variant="outline" className="h-12 rounded-none border-white/70 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black">
                  <Link href={content.hero.secondaryCta.href}>{content.hero.secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
