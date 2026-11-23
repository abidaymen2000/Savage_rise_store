import type { StorefrontContent } from "@/types/storefront-content"

const editorialImage = "https://ik.imagekit.io/deuxug3j0/savage-rise/store/hero/images/IMG_3937_-_Copie_jgdlNm0is.jpg?updatedAt=1785601921649"
const productImage = "https://ik.imagekit.io/deuxug3j0/savage-rise/catalogue/oversize/faza-001-moujet-har/IMG_3966_Rojgk07XJ.jpg"

export const storefrontFallbackContent: StorefrontContent = {
  announcement: ["Shipping Across Tunisia", "Cash on Delivery", "Size Exchanges Available"],
  hero: {
    eyebrow: "FAZA-001",
    title: "موجة حر",
    subtitle: "A piece inspired by Tunisian summers.",
    primaryCta: { label: "Shop Now", href: "/products" },
    secondaryCta: { label: "Discover FAZA", href: "/vlog" },
    media: {
      type: "image",
      src: productImage,
      alt: "Savage Rise FAZA-001 piece",
    },
    mobileMedia: {
      type: "image",
      src: productImage,
      alt: "Savage Rise FAZA-001 piece",
    },
    overlay: "strong",
  },
  categoryFeatures: [
    {
      key: "tshirts",
      label: "T-shirts",
      href: "/products?category=tshirts",
      image: productImage,
      alt: "T-shirts Savage Rise",
      matchers: ["t-shirt", "tshirt", "tee", "shirt"],
    },
    {
      key: "pants",
      label: "Pants",
      href: "/products?category=pants",
      image: editorialImage,
      alt: "Pants Savage Rise",
      matchers: ["pant", "pants", "pantalon", "buggy", "trouser"],
    },
    {
      key: "packs",
      label: "Packs",
      href: "/packs",
      image: productImage,
      alt: "Packs Savage Rise",
      matchers: ["pack", "bundle"],
    },
  ],
  faza: {
    eyebrow: "The FAZA Concept",
    title: "A Tunisian moment. A singular piece.",
    body:
      "Between drops, Savage Rise turns everyday moments in Tunisia into clothing. FAZA-001 captures the heat, anticipation, and energy of a Tunisian summer.",
    primaryCta: { label: "Discover FAZA", href: "/vlog" },
    secondaryCta: { label: "Explore the Shop", href: "/products" },
    media: {
      type: "video",
      src: "https://ik.imagekit.io/deuxug3j0/static/Sequence%2007.mp4",
      poster: editorialImage,
      alt: "Savage Rise FAZA concept film",
    },
  },
  lookbook: {
    title: "Worn by the Rise",
    items: [
      { type: "image", src: editorialImage, alt: "Savage Rise campaign" },
      { type: "image", src: productImage, alt: "Savage Rise product detail" },
      { type: "image", src: editorialImage, alt: "Backstage Savage Rise" },
      { type: "image", src: productImage, alt: "Silhouette Savage Rise" },
    ],
  },
  reassurances: [
    { title: "Designed and produced in Tunisia", text: "Creative direction rooted in Tunisian culture." },
    { title: "Cash on Delivery", text: "Order online. Pay when it arrives." },
    { title: "Shipping Across Tunisia", text: "Available shipping options are confirmed at checkout." },
    { title: "Direct Support", text: "Reach us through the contact channels listed below." },
  ],
  newsletter: {
    title: "Be Part of the Next Chapter.",
    body: "Be first to discover new drops, exclusive releases, and the latest from Savage Rise.",
  },
  footerColumns: [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/products?sort=newest" },
        { label: "T-shirts", href: "/products?category=tshirts" },
        { label: "Pants", href: "/products?category=pants" },
        { label: "Packs", href: "/packs" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Shipping", href: "/shipping" },
        { label: "Exchanges & Returns", href: "/returns" },
        { label: "Size Guide", href: "/size-guide" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Savage Rise",
      links: [
        { label: "About", href: "/about" },
        { label: "Drops", href: "/vlog" },
        { label: "FAZA", href: "/vlog" },
        { label: "Lookbook", href: "/vlog" },
      ],
    },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/savagerise.tn", external: true },
    { label: "TikTok", href: "https://www.tiktok.com/@savagerise", external: true },
  ],
}

