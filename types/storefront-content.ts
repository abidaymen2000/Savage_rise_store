export type StorefrontLink = {
  label: string
  href: string
  external?: boolean
}

export type StorefrontMedia = {
  type: "image" | "video"
  src: string
  poster?: string
  alt: string
}

export type StorefrontHero = {
  eyebrow: string
  title: string
  subtitle: string
  price?: string
  primaryCta: StorefrontLink
  secondaryCta: StorefrontLink
  media: StorefrontMedia
  mobileMedia?: StorefrontMedia
  overlay?: "soft" | "strong"
}

export type StorefrontCategoryFeature = StorefrontLink & {
  key: "tshirts" | "pants" | "packs" | "accessories"
  image: string
  alt: string
  matchers: string[]
}

export type StorefrontReassurance = {
  title: string
  text: string
}

export type StorefrontEditorialBlock = {
  eyebrow: string
  title: string
  body: string
  primaryCta: StorefrontLink
  secondaryCta?: StorefrontLink
  media: StorefrontMedia
}

export type StorefrontFooterColumn = {
  title: string
  links: StorefrontLink[]
}

export type StorefrontContent = {
  announcement: string[]
  hero: StorefrontHero
  categoryFeatures: StorefrontCategoryFeature[]
  faza: StorefrontEditorialBlock
  lookbook: {
    title: string
    items: StorefrontMedia[]
  }
  reassurances: StorefrontReassurance[]
  newsletter: {
    title: string
    body: string
  }
  footerColumns: StorefrontFooterColumn[]
  socialLinks: StorefrontLink[]
}
