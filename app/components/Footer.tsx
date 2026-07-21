"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ExternalLink, Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import FooterNavigation from "@/components/store-navigation/footer-navigation"
import { api } from "@/lib/api"
import { filterNavigationItemsBySurface } from "@/lib/store-navigation/navigation-utils"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { getStoreDisplayName, getValidSocialLinks, normalizeDomain } from "@/lib/store-config-shared"
import type { StoreNavigationPublicItem } from "@/lib/api/generated"

export default function Footer() {
  const [footerItems, setFooterItems] = useState<StoreNavigationPublicItem[]>([])
  const { config } = useStoreConfig()
  const storeName = getStoreDisplayName(config)
  const socialLinks = getValidSocialLinks(config.social_links)
  const domain = normalizeDomain(config.domain)
  const year = new Date().getFullYear()

  useEffect(() => {
    let cancelled = false

    api
      .listStoreNavigationMenus(["footer"], "all")
      .then((response) => {
        if (cancelled) return
        const footerMenu = response.menus?.find((menu) => menu.code === "footer")
        setFooterItems(filterNavigationItemsBySurface(footerMenu?.items, "all"))
      })
      .catch((error) => {
        console.error("Unable to load footer navigation", error)
        if (!cancelled) setFooterItems([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            {config.logo_url ? (
              <Image
                src={config.logo_url}
                alt={config.branding?.logo_alt || storeName}
                width={150}
                height={48}
                className="mb-4 h-12 w-auto object-contain"
                unoptimized
              />
            ) : (
              <h3 className="mb-4 font-playfair text-2xl font-bold text-gold">{storeName}</h3>
            )}
            <p className="mb-6 max-w-md text-gray-400">
              Excellence in contemporary fashion. Every piece tells a story of elegance and sophistication.
            </p>
            <div className="mb-5 space-y-2 text-sm text-gray-400">
              {config.contact_email && (
                <a href={`mailto:${config.contact_email}`} className="flex items-center gap-2 transition-colors hover:text-gold">
                  <Mail className="h-4 w-4" />
                  {config.contact_email}
                </a>
              )}
              {config.contact_phone && (
                <a href={`tel:${config.contact_phone}`} className="flex items-center gap-2 transition-colors hover:text-gold">
                  <Phone className="h-4 w-4" />
                  {config.contact_phone}
                </a>
              )}
              {domain && (
                <a href={domain} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-gold">
                  <ExternalLink className="h-4 w-4" />
                  {new URL(domain).hostname}
                </a>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} ${storeName}`}
                    title={social.label}
                    className="text-gray-400 transition-colors hover:text-gold"
                  >
                    {social.platform === "instagram" ? (
                      <Instagram className="h-6 w-6" />
                    ) : social.platform === "tiktok" ? (
                      <SiTiktok className="h-6 w-6" />
                    ) : social.platform === "facebook" ? (
                      <Facebook className="h-6 w-6" />
                    ) : social.platform === "whatsapp" ? (
                      <MessageCircle className="h-6 w-6" />
                    ) : (
                      <span className="text-sm">{social.label}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <FooterNavigation items={footerItems} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">&copy; {year} {storeName}</p>
        </div>
      </div>
    </footer>
  )
}
