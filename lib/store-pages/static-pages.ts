import type { StorePagePublicOut } from "@/lib/api/generated"

type StorePageBlock = NonNullable<StorePagePublicOut["content_blocks"]>[number]

export const STATIC_STORE_PAGES: Record<string, StorePagePublicOut> = {
  about: {
    key: "store_about",
    slug: "about",
    page_type: "standard",
    title: "ABOUT SAVAGE RISE",
    subtitle:
      "Savage Rise is more than a clothing brand. It is the expression of bold style, raw elegance, and a clear identity.",
    seo: {
      title: "About Savage Rise",
      description:
        "Discover Savage Rise, a contemporary luxury fashion brand built around bold style, craftsmanship, premium materials, and minimalist design.",
    },
    updated_at: "2026-07-24T00:00:00.000Z",
    version: 1,
    content_blocks: [
      {
        id: "about-hero",
        type: "hero",
        order: 0,
        enabled: true,
        eyebrow: "Savage Rise",
        title: "ABOUT SAVAGE RISE",
        subtitle:
          "Savage Rise is more than a clothing brand. It is the expression of bold style, raw elegance, and a clear identity. Designed for those who accept no compromise between quality, aesthetics, and individuality, every piece balances urban modernity with timeless refinement.\n\nCrafted with precision, our collection reflects a deep commitment to craftsmanship, premium materials, and minimalist design. Step into the Savage Rise universe, where luxury meets attitude.",
        image_url: "https://ik.imagekit.io/deuxug3j0/store-savage-rise/logo-blanc.png?updatedAt=1754345640975",
        image_alt: "Savage Rise Atelier",
      },
      {
        id: "about-cards",
        type: "cards",
        order: 1,
        enabled: true,
        title: "Brand facts",
        items: [
          { title: "2025", description: "FONDATION" },
          { title: "50+", description: "ARTISANS" },
          { title: "3", description: "PAYS" },
        ],
      },
    ],
  },
  help: {
    key: "store_help",
    slug: "help",
    page_type: "help",
    title: "Help",
    subtitle: "Find quick answers about orders, account access, product advice, and customer support.",
    seo: { title: "Help - Savage Rise", description: "Find quick answers about orders, account access, product advice, and customer support." },
    updated_at: "2026-07-24T00:00:00.000Z",
    version: 1,
    content_blocks: [
      {
        id: "help-cards",
        type: "cards",
        order: 0,
        enabled: true,
        items: [
          { title: "Orders", description: "After checkout, you receive an email confirmation with your order reference. Signed-in customers can also follow orders from their profile.", icon: "Package" },
          { title: "Changes and cancellations", description: "If your order is still pending, contact us as soon as possible so we can update or cancel it before preparation.", icon: "RefreshCcw" },
          { title: "Product advice", description: "Need help choosing a size, fit, or piece? Send us your question and we will guide you before purchase.", icon: "MessageCircle" },
        ],
      },
      {
        id: "help-contact",
        type: "rich_text",
        order: 1,
        enabled: true,
        title: "Still need help?",
        markdown:
          "Contact our team and include your order reference if your question is about an existing order.\n\n[Contact customer service](/contact)",
      },
    ],
  },
  shipping: {
    key: "store_shipping",
    slug: "shipping",
    page_type: "help",
    title: "Shipping",
    subtitle:
      "Shipping is calculated dynamically during checkout, so the final amount always reflects the active delivery rate for your address.",
    seo: { title: "Shipping - Savage Rise", description: "Learn how Savage Rise shipping fees, preparation, delivery, and address checks work." },
    updated_at: "2026-07-24T00:00:00.000Z",
    version: 1,
    content_blocks: [
      {
        id: "shipping-cards",
        type: "cards",
        order: 0,
        enabled: true,
        items: [
          { title: "Order preparation", description: "Orders are checked, prepared, and packed with care before being handed to delivery.", icon: "PackageCheck" },
          { title: "Delivery", description: "Shipping fees are calculated at checkout based on the delivery city, country, and order total.", icon: "Truck" },
          { title: "Address accuracy", description: "Please make sure your phone number, city, and address are correct to avoid delivery delays.", icon: "MapPin" },
        ],
      },
      {
        id: "shipping-notes",
        type: "rich_text",
        order: 1,
        enabled: true,
        title: "Important notes",
        markdown:
          "Delivery times can vary depending on product availability and destination. If there is any issue with your address or phone number, our team may contact you before dispatch.",
      },
    ],
  },
  returns: {
    key: "store_returns",
    slug: "returns",
    page_type: "legal",
    title: "Returns",
    subtitle:
      "We want every Savage Rise piece to feel right. If something is wrong with your order, contact us and we will help with the next step.",
    seo: { title: "Returns - Savage Rise", description: "Read Savage Rise return eligibility, inspection, and request process." },
    updated_at: "2026-07-24T00:00:00.000Z",
    version: 1,
    content_blocks: [
      {
        id: "returns-cards",
        type: "cards",
        order: 0,
        enabled: true,
        items: [
          { title: "Eligibility", description: "Items should be unused, clean, and returned with their original packaging and labels.", icon: "CheckCircle" },
          { title: "Inspection", description: "Returned items are inspected before an exchange, refund, or store credit is confirmed.", icon: "PackageOpen" },
          { title: "Request window", description: "Please contact us quickly after receiving your order if you need to request a return or exchange.", icon: "RefreshCcw" },
        ],
      },
      {
        id: "returns-how",
        type: "rich_text",
        order: 1,
        enabled: true,
        title: "How to start a return",
        markdown:
          "Send us your order reference, the item concerned, and the reason for your request. Our team will confirm the available options.\n\n[Contact customer service](/contact)",
      },
    ],
  },
  "size-guide": {
    key: "store_size_guide",
    slug: "size-guide",
    page_type: "size_guide",
    title: "Size guide",
    subtitle: "Use this guide as a reference. Product cuts can vary slightly depending on fabric, silhouette, and intended fit.",
    seo: { title: "Size guide - Savage Rise", description: "Check Savage Rise clothing size measurements and measuring advice." },
    updated_at: "2026-07-24T00:00:00.000Z",
    version: 1,
    content_blocks: [
      {
        id: "size-table",
        type: "table",
        order: 0,
        enabled: true,
        title: "Measurements",
        columns: ["Size", "Chest", "Waist", "Hip"],
        rows: [
          ["XS", "84-89 cm", "70-75 cm", "84-89 cm"],
          ["S", "90-95 cm", "76-81 cm", "90-95 cm"],
          ["M", "96-101 cm", "82-87 cm", "96-101 cm"],
          ["L", "102-107 cm", "88-93 cm", "102-107 cm"],
          ["XL", "108-113 cm", "94-99 cm", "108-113 cm"],
          ["XXL", "114-119 cm", "100-105 cm", "114-119 cm"],
        ],
      },
      {
        id: "size-measure",
        type: "rich_text",
        order: 1,
        enabled: true,
        title: "How to measure",
        markdown:
          "Measure close to the body with a flexible tape. If you are between two sizes, choose the larger size for a relaxed fit or the smaller size for a sharper fit.",
      },
    ],
  },
  contact: {
    key: "store_contact",
    slug: "contact",
    page_type: "contact",
    title: "Contact us",
    subtitle: "Send us a message or use the contact details below to reach the Savage Rise team.",
    seo: { title: "Contact - Savage Rise", description: "Contact Savage Rise customer service for orders, product advice, and support." },
    updated_at: "2026-07-24T00:00:00.000Z",
    version: 1,
    content_blocks: [
      {
        id: "contact-info",
        type: "contact_info",
        order: 0,
        enabled: true,
        title: "Contact details",
        email: "Use the dynamic store email shown on this page.",
        phone: "Use the dynamic store phone shown on this page.",
        whatsapp: "Use the dynamic WhatsApp link shown on this page.",
      },
      {
        id: "contact-map",
        type: "map",
        order: 1,
        enabled: true,
        title: "Sfax, Tunisie",
        label: "Sfax map",
        embed_url:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d10.698422!3d34.740556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd71381aec5a5f%3A0x27268cbb18b19e0!2sSfax%2C%20Tunisie!5e0!3m2!1sfr!2sus!4v1691400000000!5m2!1sfr!2sus",
      },
    ],
  },
}

export function getStaticStorePage(slug: string): StorePagePublicOut | null {
  return STATIC_STORE_PAGES[slug] ?? null
}

export function enabledBlocks(page: StorePagePublicOut): StorePageBlock[] {
  return (page.content_blocks || [])
    .filter((block) => block.enabled !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
}
