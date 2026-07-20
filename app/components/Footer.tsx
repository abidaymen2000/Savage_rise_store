"use client"

import { useEffect, useState } from "react"
import { Instagram } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import FooterNavigation from "@/components/store-navigation/footer-navigation"
import { api } from "@/lib/api"
import { filterNavigationItemsBySurface } from "@/lib/store-navigation/navigation-utils"
import type { StoreNavigationPublicItem } from "@/lib/api/generated"

export default function Footer() {
  const [footerItems, setFooterItems] = useState<StoreNavigationPublicItem[]>([])

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
            <h3 className="mb-4 font-playfair text-2xl font-bold text-gold">SAVAGE RISE</h3>
            <p className="mb-6 max-w-md text-gray-400">
              Excellence in contemporary fashion. Every piece tells a story of elegance and sophistication.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/savage_rise_tn/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Savage Rise"
                title="Instagram"
                className="text-gray-400 transition-colors hover:text-gold"
              >
                <Instagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.tiktok.com/@savage.rise"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Savage Rise"
                title="TikTok"
                className="text-gray-400 transition-colors hover:text-gold"
              >
                <SiTiktok className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <FooterNavigation items={footerItems} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">© 2025 Savage Rise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
