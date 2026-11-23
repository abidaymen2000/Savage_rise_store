"use client"
import Link from "next/link"
import { StudioHeroAction } from "@/components/studio-hero-action"
import { useStudio } from "@/components/studio-runtime"
import { Button } from "@/components/ui/button"
import StorefrontMedia from "@/components/storefront/media/storefront-media"
import { getStorefrontContent } from "@/lib/storefront/content"
import HeroDropNotification from "./HeroDropNotification"
import HeroPrimaryAction from "./HeroPrimaryAction"
import type { DropCountdown, HeaderVideo } from "@/types/api"

const DROP_COUNTDOWN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DROP_COUNTDOWN === "true"

type HeroSlide = {
  type: "video" | "image"
  src: string
  poster?: string
  objectPosition?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | null
}

type HeroProps = {
  headerVideo?: HeaderVideo | null
  drop?: DropCountdown | null
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

function getSlides(headerVideo: HeaderVideo | null | undefined): HeroSlide[] {
  const slides: HeroSlide[] = []
  if (headerVideo?.video?.url) {
    slides.push({
      type: "video",
      src: headerVideo.video.url,
      poster: headerVideo.image?.url ?? headerVideo.video.thumbnail_url ?? undefined,
      title: headerVideo.title,
      subtitle: headerVideo.subtitle,
      description: headerVideo.description,
    })
  }
  if (headerVideo?.image?.url) {
    slides.push({
      type: "image",
      src: headerVideo.image.url,
      title: headerVideo.title,
      subtitle: headerVideo.subtitle,
      description: headerVideo.description,
    })
  }
  return slides
}

export default function Hero({ headerVideo, drop }: HeroProps) {
  const {content: studio} = useStudio()
  const original = getStorefrontContent()
  const edited = studio?.hero
  const content = { ...original, hero: { ...original.hero,
    eyebrow: edited?.eyebrow ?? original.hero.eyebrow, title: edited?.title ?? original.hero.title, subtitle: edited?.subtitle ?? original.hero.subtitle,
    primaryCta: { ...original.hero.primaryCta, label: edited?.primary_label ?? original.hero.primaryCta.label },
    secondaryCta: { ...original.hero.secondaryCta, label: edited?.secondary_label ?? original.hero.secondaryCta.label },
    media: edited?.media ? {type: edited.media.mime?.startsWith("video/") ? "video" as const : "image" as const, src: edited.media.url, poster: edited.poster?.url || edited.media.thumbnail_url || undefined, alt: edited.media.alt || edited.title || original.hero.title } : edited?.poster ? {type: "image" as const, src: edited.poster.url, alt: edited.poster.alt || original.hero.title} : original.hero.media
  }}
  const slides = getSlides(studio ? null : headerVideo)
  const activeSlide = slides[0]
  const slide = activeSlide
  const activeDrop = !studio && DROP_COUNTDOWN_ENABLED && drop?.is_active ? drop : null
  const remaining = getRemainingSeconds(activeDrop)
  const isDropReleased = Boolean(activeDrop?.is_released || (activeDrop && remaining <= 0))
  const heroTitle = activeDrop ? activeDrop.title ?? activeDrop.drop_name ?? content.hero.title : activeSlide?.title ?? content.hero.title
  const heroEyebrow = activeDrop ? (isDropReleased ? "Drop disponible" : formatCountdown(remaining)) : activeSlide?.subtitle ?? content.hero.eyebrow
  const heroDescription = activeDrop ? activeDrop.subtitle ?? content.hero.subtitle : activeSlide?.description ?? content.hero.subtitle
  const discoverUrl = activeDrop?.cta_url
    ? activeDrop.cta_url.startsWith("/") ? activeDrop.cta_url : `/${activeDrop.cta_url}`
    : content.hero.primaryCta.href
  const media = activeSlide
    ? { type: activeSlide.type, src: activeSlide.src, poster: activeSlide.poster, alt: String(heroTitle), objectPosition: activeSlide.objectPosition }
    : content.hero.media
  const isHeroVideo = Boolean(slide && slide.type === "video") || media.type === "video"
  const heroMediaClassName =
    isHeroVideo
      ? "object-cover object-[50%_50%]"
      : "object-cover object-center"

  return (
    <section data-studio-section="hero" className="store-hero relative isolate w-full overflow-hidden bg-black text-white">
      <StorefrontMedia
        media={media}
        playback="hero-cycle"
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full overflow-hidden"
        imageClassName={heroMediaClassName}
      />
      <div className="store-hero-shade pointer-events-none absolute inset-0" />
      <div className="store-hero-inner store-container relative z-10">
        <div className="store-hero-copy">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">{heroEyebrow}</p>
          <div className="max-w-3xl">
            <h1 className="font-playfair" dir="auto">{heroTitle}</h1>
            <p className="store-hero-description">{heroDescription}</p>
          </div>
          <div className="flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row">
            {edited?.primary_action ? <StudioHeroAction action={edited.primary_action} label={content.hero.primaryCta.label} className="h-12 min-h-11 rounded-none bg-white px-6 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-stone-200 disabled:opacity-60" /> : <HeroPrimaryAction
              href={discoverUrl}
              label={activeDrop ? activeDrop.cta_label ?? "Voir le Drop" : content.hero.primaryCta.label}
              hasActiveDrop={Boolean(activeDrop)}
            />}
            {edited?.secondary_action ? <StudioHeroAction action={edited.secondary_action} label={content.hero.secondaryCta.label} className="h-12 min-h-11 rounded-none border border-white/70 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black disabled:opacity-60" /> : activeDrop?.email_enabled && !isDropReleased ? (
              <HeroDropNotification drop={activeDrop} />
            ) : (
              <Button asChild variant="outline" className="h-12 rounded-none border-white/70 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-white hover:text-black">
                <Link href={content.hero.secondaryCta.href}>{content.hero.secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
