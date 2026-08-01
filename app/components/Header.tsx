"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Heart, Menu, Search, User, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DesktopNavigation from "@/components/store-navigation/desktop-navigation"
import MobileNavigation from "@/components/store-navigation/mobile-navigation"
import Cart from "./Cart"
import AuthModal from "./AuthModal"
import ThemeToggle from "./ThemeToggle"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { getStoreDisplayName, isFeatureEnabled } from "@/lib/store-config-shared"
import { getStorefrontContent } from "@/lib/storefront/content"
import type { StoreNavigationPublicItem } from "@/lib/api/generated"

function navItem(id: string, label: string, path: string, position: number, children: StoreNavigationPublicItem[] = []): StoreNavigationPublicItem {
  return {
    id,
    label,
    position,
    visibility: "all",
    open_in_new_tab: false,
    destination: { type: "internal_path", path },
    children,
  }
}

const fallbackHeaderItems: StoreNavigationPublicItem[] = [
  navItem("new", "Nouveautes", "/products?sort=newest", 1),
  navItem("faza", "FAZA", "/vlog", 2),
  {
    ...navItem("shop", "Boutique", "/products", 3),
    children: [
      navItem("shop-all", "Voir tout", "/products", 1),
      navItem("shop-tshirts", "T-shirts", "/products?category=tshirts", 2),
      navItem("shop-pants", "Pants", "/products?category=pants", 3),
      navItem("shop-packs", "Packs", "/packs", 4),
    ],
  },
  navItem("drops", "Drops", "/vlog", 4),
  navItem("story", "Notre histoire", "/about", 5),
]

const fallbackMobileItems: StoreNavigationPublicItem[] = [
  ...fallbackHeaderItems,
  navItem("size-guide", "Guide des tailles", "/size-guide", 6),
  navItem("shipping", "Livraison et echanges", "/shipping", 7),
  navItem("contact", "Contact", "/contact", 8),
]

export default function Header({
  initialHeaderItems,
  initialMobileItems,
}: {
  initialHeaderItems?: StoreNavigationPublicItem[]
  initialMobileItems?: StoreNavigationPublicItem[]
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const headerItems = initialHeaderItems && initialHeaderItems.length > 0 ? initialHeaderItems : fallbackHeaderItems
  const mobileItems = initialMobileItems && initialMobileItems.length > 0 ? initialMobileItems : fallbackMobileItems
  const [wishlistCount, setWishlistCount] = useState(0)
  const { user, isAuthenticated, logout } = useAuth()
  const { config } = useStoreConfig()
  const pathname = usePathname()
  const content = getStorefrontContent()
  const storeName = getStoreDisplayName(config)
  const logoUrl = config.logo_url || undefined
  const logoAlt = config.branding?.logo_alt || storeName
  const wishlistEnabled = isFeatureEnabled(config, "wishlist", true)
  const isHome = pathname === "/"

  const closeMobileMenu = () => setIsMenuOpen(false)

  const fetchWishlistCount = useCallback(async () => {
    if (!isAuthenticated || !wishlistEnabled) {
      setWishlistCount(0)
      return
    }
    try {
      setWishlistCount((await api.getWishlist()).length)
    } catch {
      setWishlistCount(0)
    }
  }, [isAuthenticated, wishlistEnabled])

  useEffect(() => {
    fetchWishlistCount()
  }, [fetchWishlistCount])

  useEffect(() => {
    closeMobileMenu()
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [isMenuOpen])

  const handleMobileLogout = () => {
    closeMobileMenu()
    logout()
  }

  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <div className="border-b border-stone-800 bg-[#090908] px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-300 sm:text-xs">
          <span className="hidden sm:inline">{content.announcement.join(" · ")}</span>
          <span className="sm:hidden">{content.announcement[0]}</span>
        </div>
        <header className={`w-full border-b backdrop-blur-md transition-colors duration-300 theme-aware-header ${isHome ? "border-white/10 bg-black/72" : "border-stone-800 bg-black/95"}`}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between gap-3">
              <Link
                href="/"
                className="min-w-0 flex-1 truncate whitespace-nowrap text-lg font-semibold uppercase tracking-[0.18em] text-white sm:text-xl md:flex-none"
                onClick={closeMobileMenu}
              >
                <span className="flex h-10 min-w-0 items-center">
                  {logoUrl ? (
                    <Image src={logoUrl} alt={logoAlt} width={140} height={40} className="h-10 w-auto object-contain" unoptimized priority />
                  ) : (
                    <span className="truncate">{storeName}</span>
                  )}
                </span>
              </Link>

              <DesktopNavigation items={headerItems} />

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <div className="hidden items-center gap-2 md:flex">
                  <Button asChild variant="ghost" size="icon" className="text-white hover:text-gold">
                    <Link href="/products" aria-label="Recherche">
                      <Search className="h-5 w-5" />
                    </Link>
                  </Button>
                  <ThemeToggle />
                  {isAuthenticated && wishlistEnabled && (
                    <Link href="/profile?tab=wishlist">
                      <Button variant="ghost" size="icon" className="relative text-white hover:text-gold">
                        <Heart className="h-5 w-5" />
                        {wishlistCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs text-black">
                            {wishlistCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative text-white hover:text-gold">
                          <User className="h-5 w-5" />
                          {user?.is_active && <Badge className="absolute -right-1 -top-1 h-3 w-3 bg-green-500 p-0" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-stone-800 bg-black" align="end">
                        <DropdownMenuItem asChild>
                          <Link href="/profile?tab=settings" className="text-white hover:text-gold">Mon profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile?tab=orders" className="text-white hover:text-gold">Mes commandes</Link>
                        </DropdownMenuItem>
                        {wishlistEnabled && (
                          <DropdownMenuItem asChild>
                            <Link href="/profile?tab=wishlist" className="text-white hover:text-gold">Wishlist</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-stone-800" />
                        <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300">Se deconnecter</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="ghost" size="icon" className="text-white hover:text-gold" onClick={() => setShowAuthModal(true)} aria-label="Compte">
                      <User className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <Cart />

                <Button
                  variant="ghost"
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-none border border-white/25 bg-white/5 px-3 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-white hover:text-black md:hidden"
                  onClick={() => setIsMenuOpen((value) => !value)}
                  aria-expanded={isMenuOpen}
                  aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span>{isMenuOpen ? "Fermer" : "Menu"}</span>
                </Button>
              </div>
            </div>

            {isMenuOpen && (
              <div className="fixed inset-x-0 top-[6.5rem] z-40 max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-stone-800 bg-[#050505]/98 px-4 py-5 shadow-2xl shadow-black/70 backdrop-blur-md md:hidden">
                <nav className="mx-auto flex w-full max-w-screen-sm flex-col gap-3 pb-4">
                  <div className="mb-1 border-b border-stone-800 pb-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/80">{storeName}</p>
                    <p className="mt-1 text-sm text-white/65">Boutique, Drops et FAZA</p>
                  </div>
                  <MobileNavigation items={mobileItems} onNavigate={closeMobileMenu} />
                  <ThemeToggle mobile />
                  <p className="mt-3 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Compte</p>
                  {isAuthenticated && wishlistEnabled && (
                    <Link href="/profile?tab=wishlist" className="group flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold" onClick={closeMobileMenu}>
                      <span>Wishlist ({wishlistCount})</span>
                      <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile?tab=settings" className="group flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold" onClick={closeMobileMenu}>
                        <span>Mon profil</span>
                        <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <button onClick={handleMobileLogout} className="border border-red-400/20 bg-red-500/5 px-4 py-3.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300">
                        Se deconnecter
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        closeMobileMenu()
                        setShowAuthModal(true)
                      }}
                      className="border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold"
                    >
                      Se connecter
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </header>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
