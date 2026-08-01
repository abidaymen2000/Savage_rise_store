import Link from "next/link"
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

function normalizeText(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? ""
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
  const content = getStorefrontContent()
  const slides = getSlides(headerVideo)
  const activeSlide = slides[0]
  const slide = activeSlide
  const activeDrop = DROP_COUNTDOWN_ENABLED && drop?.is_active ? drop : null
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
  const heroPrice = content.hero.price?.trim()
  const showHeroPrice = Boolean(heroPrice && !normalizeText(heroDescription).includes(normalizeText(heroPrice)))
  const heroMediaClassName =
    isHeroVideo
      ? "object-cover object-[50%_50%]"
      : `object-cover object-center ${
          activeDrop
            ? "blur-[7px] brightness-[0.68]"
            : "blur-[3px] brightness-[0.76]"
        }`

  return (
    <section className="relative isolate min-h-[calc(100svh-2.5rem)] w-full overflow-hidden bg-black pt-28 text-white md:min-h-[calc(100dvh-2.5rem)]">
      <StorefrontMedia
        media={media}
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full overflow-hidden"
        imageClassName={heroMediaClassName}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25" />
      <div className="relative z-10 flex min-h-[calc(100svh-7rem)] items-end px-4 pb-10 sm:px-6 md:min-h-[calc(100dvh-7rem)] md:items-center md:pb-0">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">{heroEyebrow}</p>
          <div className="max-w-3xl">
            <h1 className="font-playfair text-5xl font-semibold leading-[0.95] text-[rgba(255,255,255,0.98)] sm:text-6xl lg:text-8xl">{heroTitle}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-100 sm:text-lg">{heroDescription}</p>
            {showHeroPrice && <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-300">{heroPrice}</p>}
          </div>
          <div className="flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row">
            <HeroPrimaryAction
              href={discoverUrl}
              label={activeDrop ? activeDrop.cta_label ?? "Voir le Drop" : content.hero.primaryCta.label}
              hasActiveDrop={Boolean(activeDrop)}
            />
            {activeDrop?.email_enabled && !isDropReleased ? (
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
