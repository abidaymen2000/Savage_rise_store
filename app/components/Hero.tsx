"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Check, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import AuthModal from "./AuthModal"
import type { DropCountdown, DropNotificationStatus } from "@/types/api"

type HeroSlide = {
  type: "video" | "image"
  src: string
  title: string
  subtitle: string
  description: string
}

const fallbackSlides: HeroSlide[] = [
  {
    type: "video",
    src: "https://ik.imagekit.io/deuxug3j0/store-savage-rise/video-header.mp4?updatedAt=1754345500707",
    title: "NEW COLLECTION",
    subtitle: "FALL/WINTER 2025",
    description: "Discover redefined elegance",
  },
  {
    type: "image",
    src: "https://ik.imagekit.io/deuxug3j0/store-savage-rise/banniere-blan.jpeg?updatedAt=1754345638832",
    title: "TIMELESS STYLE",
    subtitle: "PREMIUM",
    description: "Details that make the difference",
  },
]

function getRemainingSeconds(drop: DropCountdown | null) {
  if (!drop?.launch_at) return 0
  return Math.max(0, Math.floor((new Date(drop.launch_at).getTime() - Date.now()) / 1000))
}

function formatCountdown(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (seconds <= 0) return "AVAILABLE NOW"
  if (days > 0) return `${days}j ${hours}h ${minutes}m`
  return `${hours}h ${minutes}m ${secs}s`
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides)
  const [drop, setDrop] = useState<DropCountdown | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [notificationStatus, setNotificationStatus] = useState<DropNotificationStatus | null>(null)
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let isMounted = true

    async function fetchHeaderVideo() {
      try {
        const headerVideo = await api.getHeaderVideo()

        if (!isMounted || !headerVideo.video?.url) return

        setSlides([
          {
            type: "video",
            src: headerVideo.video.url,
            title: headerVideo.title ?? fallbackSlides[0].title,
            subtitle: headerVideo.subtitle ?? fallbackSlides[0].subtitle,
            description: headerVideo.description ?? fallbackSlides[0].description,
          },
          fallbackSlides[1],
        ])
      } catch (error) {
      }
    }

    fetchHeaderVideo()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchDropCountdown() {
      try {
        const data = await api.getDropCountdown()
        if (!isMounted || !data?.is_active) return
        setDrop(data)
        setRemaining(getRemainingSeconds(data))
      } catch (error) {
      }
    }

    fetchDropCountdown()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!drop || drop.is_released) return
    const timer = window.setInterval(() => {
      setRemaining(getRemainingSeconds(drop))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [drop])

  useEffect(() => {
    let isMounted = true

    async function fetchNotificationStatus() {
      if (!isAuthenticated || !drop?.email_enabled) {
        setNotificationStatus(null)
        return
      }
      try {
        const data = await api.getDropNotificationStatus()
        if (isMounted) setNotificationStatus(data)
      } catch (error) {
        if (isMounted) setNotificationStatus(null)
      }
    }

    fetchNotificationStatus()

    return () => {
      isMounted = false
    }
  }, [drop, isAuthenticated])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8000) // Longer duration for video
    return () => clearInterval(timer)
  }, [slides.length])

  const hasActiveDrop = Boolean(drop?.is_active)
  const isDropReleased = Boolean(drop?.is_released || (drop && remaining <= 0))
  const heroSubtitle = hasActiveDrop
    ? isDropReleased
      ? "DROP AVAILABLE"
      : formatCountdown(remaining)
    : slides[currentSlide].subtitle
  const heroTitle = hasActiveDrop ? drop?.title ?? drop?.drop_name ?? "NEXT DROP" : slides[currentSlide].title
  const heroDescription = hasActiveDrop ? drop?.subtitle ?? slides[currentSlide].description : slides[currentSlide].description
  const discoverUrl = useMemo(() => {
    if (!drop?.cta_url) return "/products"
    return drop.cta_url.startsWith("/") ? drop.cta_url : `/${drop.cta_url}`
  }, [drop?.cta_url])

  const toggleDropNotification = useCallback(async () => {
    if (!drop?.email_enabled || isDropReleased) return
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setIsNotificationLoading(true)
    try {
      const next = notificationStatus?.is_subscribed
        ? await api.unsubscribeDropNotification()
        : await api.subscribeDropNotification()
      setNotificationStatus(next)
    } catch (error) {
    } finally {
      setIsNotificationLoading(false)
    }
  }, [drop?.email_enabled, isAuthenticated, isDropReleased, notificationStatus?.is_subscribed])

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            {slide.type === "video" ? (
              <video
                src={slide.src}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full scale-[1.04] object-cover blur-[6px] brightness-[0.72]"
              />
            ) : (
              <img
                src={slide.src || "/placeholder.svg"}
                alt={slide.title}
                className="h-full w-full scale-[1.04] object-cover blur-[6px] brightness-[0.72]"
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.58))]" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-5xl px-4">
            <div className="animate-fade-in rounded-md bg-black/18 px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.34)] backdrop-blur-[2px] md:px-10 md:py-10">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold md:text-base">
                {heroSubtitle}
              </p>
              <h1 className="mb-6 text-4xl font-playfair font-bold leading-tight text-white [text-shadow:0_10px_30px_rgba(0,0,0,0.55)] md:text-7xl">
                {heroTitle}
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-lg font-light text-gray-100 [text-shadow:0_8px_24px_rgba(0,0,0,0.45)] md:text-2xl">
                {heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90 font-semibold px-8 py-3 text-lg">
                  <Link href={discoverUrl}>
                    DISCOVER
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {hasActiveDrop && drop?.email_enabled && !isDropReleased ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    disabled={isNotificationLoading}
                    onClick={toggleDropNotification}
                    className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg bg-transparent"
                  >
                    {notificationStatus?.is_subscribed ? (
                      <Check className="mr-2 h-5 w-5" />
                    ) : (
                      <Bell className="mr-2 h-5 w-5" />
                    )}
                    {notificationStatus?.is_subscribed ? "NOTIFIED" : drop.cta_label ?? "NOTIFY ME"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg bg-transparent"
                  >
                    LOOKBOOK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-gold" : "bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
