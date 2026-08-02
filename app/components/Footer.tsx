"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Instagram, Mail, Phone } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { getStoreDisplayName, getValidSocialLinks } from "@/lib/store-config-shared"
import { getStorefrontContent } from "@/lib/storefront/content"

export default function Footer() {
  const { config } = useStoreConfig()
  const content = getStorefrontContent()
  const storeName = getStoreDisplayName(config)
  const socialLinks = getValidSocialLinks(config.social_links)
  const year = new Date().getFullYear()
  const resolvedSocials = socialLinks.length > 0 ? socialLinks.map((social) => ({ label: social.label, href: social.url, external: true })) : content.socialLinks

  return (
    <footer className="border-t border-border bg-surface text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            {config.logo_url ? (
              <Image
                src={config.logo_url}
                alt={config.branding?.logo_alt || storeName}
                width={160}
                height={56}
                className="mb-5 h-12 w-auto object-contain"
                unoptimized
              />
            ) : (
              <h2 className="mb-5 text-xl font-semibold uppercase tracking-[0.2em] text-foreground">{storeName}</h2>
            )}
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              Streetwear born in Tunisia. Chaque Drop ouvre un nouveau chapitre; FAZA transforme le quotidien tunisien en pieces limitees.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              {config.contact_email && (
                <a href={`mailto:${config.contact_email}`} className="flex items-center gap-2 transition-colors hover:text-accent">
                  <Mail className="h-4 w-4" />
                  {config.contact_email}
                </a>
              )}
              {config.contact_phone && (
                <a href={`tel:${config.contact_phone}`} className="flex items-center gap-2 transition-colors hover:text-accent">
                  <Phone className="h-4 w-4" />
                  {config.contact_phone}
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {content.footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}`}>
                      <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <nav aria-label="Social">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">Social</h3>
              <ul className="mt-4 space-y-3">
                {resolvedSocials.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
                      {link.label.toLowerCase().includes("instagram") ? (
                        <Instagram className="h-4 w-4" />
                      ) : link.label.toLowerCase().includes("tiktok") ? (
                        <SiTiktok className="h-4 w-4" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {storeName}</p>
          <p>Tunisie · {config.default_currency || "TND"} · Paiement a la livraison</p>
        </div>
      </div>
    </footer>
  )
}
