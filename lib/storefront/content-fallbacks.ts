import type { StorefrontContent } from "@/types/storefront-content"

const editorialImage = "https://ik.imagekit.io/deuxug3j0/savage-rise/faza/faza-001-editorial.jpg"
const productImage = "https://ik.imagekit.io/deuxug3j0/savage-rise/faza/faza-001-product.jpg"

export const storefrontFallbackContent: StorefrontContent = {
  announcement: ["Livraison dans toute la Tunisie", "Paiement a la livraison", "Echange de taille disponible"],
  hero: {
    eyebrow: "FAZA-001",
    title: "موجة حر",
    subtitle: "Une piece inspiree par les etes tunisiens.",
    price: "52 DT",
    primaryCta: { label: "Commander maintenant", href: "/products" },
    secondaryCta: { label: "Decouvrir FAZA", href: "/vlog" },
    media: {
      type: "image",
      src: productImage,
      alt: "Piece Savage Rise FAZA-001",
    },
    mobileMedia: {
      type: "image",
      src: productImage,
      alt: "Piece Savage Rise FAZA-001",
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
    eyebrow: "Concept FAZA",
    title: "Une situation tunisienne. Une piece.",
    body:
      "Entre deux Drops, Savage Rise transforme une situation tunisienne en une piece. FAZA-001 raconte la chaleur, l'attente et l'energie d'un ete en Tunisie.",
    primaryCta: { label: "Decouvrir FAZA", href: "/vlog" },
    secondaryCta: { label: "Voir la boutique", href: "/products" },
    media: {
      type: "image",
      src: editorialImage,
      alt: "Univers editorial FAZA Savage Rise",
    },
  },
  lookbook: {
    title: "Worn by the Rise",
    items: [
      { type: "image", src: editorialImage, alt: "Campagne Savage Rise" },
      { type: "image", src: productImage, alt: "Detail produit Savage Rise" },
      { type: "image", src: editorialImage, alt: "Backstage Savage Rise" },
      { type: "image", src: productImage, alt: "Silhouette Savage Rise" },
    ],
  },
  reassurances: [
    { title: "Designed and produced in Tunisia", text: "Une direction creative nee dans la culture tunisienne." },
    { title: "Paiement a la livraison", text: "Commande simple, reglement a la reception." },
    { title: "Livraison sur toute la Tunisie", text: "Les options disponibles sont confirmees au checkout." },
    { title: "Assistance directe", text: "Contact via Instagram, telephone ou email selon les canaux actifs." },
  ],
  newsletter: {
    title: "Enter the next chapter",
    body: "Recois les nouveaux Drops, les episodes FAZA et les acces anticipes.",
  },
  footerColumns: [
    {
      title: "Boutique",
      links: [
        { label: "Nouveautes", href: "/products?sort=newest" },
        { label: "T-shirts", href: "/products?category=tshirts" },
        { label: "Pants", href: "/products?category=pants" },
        { label: "Packs", href: "/packs" },
      ],
    },
    {
      title: "Aide",
      links: [
        { label: "Livraison", href: "/shipping" },
        { label: "Echanges et retours", href: "/returns" },
        { label: "Guide des tailles", href: "/size-guide" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Savage Rise",
      links: [
        { label: "Notre histoire", href: "/about" },
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
