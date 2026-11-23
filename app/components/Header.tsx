"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
import { resolveNavigationHref } from "@/lib/store-navigation/resolve-navigation-href"
import Cart from "./Cart"
import AuthModal from "./AuthModal"
import ThemeToggle from "./ThemeToggle"
import { useStudio } from "@/components/studio-runtime"
import { hiddenPath } from "@/lib/studio-contract"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { useStoreConfig } from "@/contexts/StoreConfigContext"
import { getStoreDisplayName, isFeatureEnabled } from "@/lib/store-config-shared"
import { getStorefrontContent } from "@/lib/storefront/content"
import type { StoreNavigationPublicItem } from "@/lib/api/generated"
import type { Category } from "@/types/api"

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

const fallbackHeaderItems = (categories: Category[]): StoreNavigationPublicItem[] => [
  navItem("new", "Nouveautes", "/products?sort=newest", 1),
  navItem("faza", "FAZA", "/vlog", 2),
  {
    ...navItem("shop", "Boutique", "/products", 3),
    children: [
      navItem("shop-all", "Voir tout", "/products", 1),
      ...categories.filter(category => !category.status || category.status === "active").map((category, index) => navItem(category.id, category.name, `/products?category=${encodeURIComponent(category.slug || category.id)}`, index + 2)),
      navItem("shop-packs", "Packs", "/packs", 4),
    ],
  },
  navItem("drops", "Drops", "/vlog", 4),
  navItem("story", "Notre histoire", "/about", 5),
]

const fallbackMobileItems = (categories: Category[]): StoreNavigationPublicItem[] => [
  ...fallbackHeaderItems(categories),
  navItem("size-guide", "Guide des tailles", "/size-guide", 6),
  navItem("shipping", "Livraison et echanges", "/shipping", 7),
  navItem("contact", "Contact", "/contact", 8),
]

export default function Header({
  initialHeaderItems,
  initialMobileItems,
  categories = [],
}: {
  initialHeaderItems?: StoreNavigationPublicItem[]
  initialMobileItems?: StoreNavigationPublicItem[]
  categories?: Category[]
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null)
  const {hidden} = useStudio()
  const visible = (items: StoreNavigationPublicItem[]): StoreNavigationPublicItem[] => items.filter(item => {
    const destination = resolveNavigationHref(item.destination, item.open_in_new_tab)
    return !destination || destination.isExternal || !hiddenPath(destination.href, hidden)
  }).map(item => ({ ...item, children: visible(item.children || []) }))
  const headerItems = visible(initialHeaderItems?.length ? initialHeaderItems : fallbackHeaderItems(categories))
  const mobileItems = visible(initialMobileItems?.length ? initialMobileItems : fallbackMobileItems(categories))
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

  const closeMobileMenu = useCallback(() => setIsMenuOpen(false), [])

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
  }, [closeMobileMenu, pathname])

  useEffect(() => {
    if (!isMenuOpen) return
    const previousOverflow = document.body.style.overflow
    const menuButton = mobileMenuButtonRef.current
    document.body.style.overflow = "hidden"

    window.requestAnimationFrame(() => {
      mobileMenuPanelRef.current?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu()
      if (event.key === "Tab") {
        const elements = Array.from(mobileMenuPanelRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,[tabindex="0"]') ?? [])
        const first = elements[0], last = elements.at(-1)
        if (event.shiftKey && (document.activeElement === first || document.activeElement === mobileMenuPanelRef.current)) {event.preventDefault(); last?.focus()}
        else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus()}
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      menuButton?.focus()
    }
  }, [closeMobileMenu, isMenuOpen])

  const handleMobileLogout = () => {
    closeMobileMenu()
    logout()
  }

  return (
    <>
      <div className="store-header fixed top-0 z-50 w-full">
        <div className="store-announcement border-b border-border px-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em]">
          <span className="hidden sm:inline">{content.announcement.join(" · ")}</span>
          <span className="sm:hidden">{content.announcement[0]}</span>
        </div>
        <header className="w-full border-b border-border">
          <div className="store-container">
            <div className="flex h-16 items-center justify-between gap-3">
              <Link
                href="/"
                className="min-w-0 flex-1 truncate whitespace-nowrap text-lg font-semibold uppercase tracking-[0.18em] text-foreground sm:text-xl md:flex-none dark:text-white"
                onClick={closeMobileMenu}
              >
                <span className="store-logo flex min-w-0 items-center justify-center overflow-hidden">
                  {logoUrl ? (
                    <Image src={logoUrl} alt={logoAlt} width={140} height={40} className="h-10 w-auto object-contain" unoptimized priority />
                  ) : (
                    <span className="truncate">{storeName}</span>
                  )}
                </span>
              </Link>

              <DesktopNavigation items={headerItems} />

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <div className="hidden items-center gap-2 lg:flex">
                  <Button asChild variant="ghost" size="icon" className="text-foreground hover:text-accent dark:text-white dark:hover:text-gold">
                    <Link href="/products" aria-label="Recherche">
                      <Search className="h-5 w-5" />
                    </Link>
                  </Button>
                  <ThemeToggle />
                  {isAuthenticated && wishlistEnabled && (
                    <Link href="/profile?tab=wishlist">
                      <Button variant="ghost" size="icon" className="relative text-foreground hover:text-accent dark:text-white dark:hover:text-gold">
                        <Heart className="h-5 w-5" />
                        {wishlistCount > 0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                            {wishlistCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative text-foreground hover:text-accent dark:text-white dark:hover:text-gold">
                          <User className="h-5 w-5" />
                          {user?.is_active && <Badge className="absolute -right-1 -top-1 h-3 w-3 bg-green-500 p-0" />}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-border bg-popover text-popover-foreground dark:border-stone-800 dark:bg-black" align="end">
                        <DropdownMenuItem asChild>
                          <Link href="/profile?tab=settings" className="text-popover-foreground hover:text-accent dark:text-white dark:hover:text-gold">Mon profil</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile?tab=orders" className="text-popover-foreground hover:text-accent dark:text-white dark:hover:text-gold">Mes commandes</Link>
                        </DropdownMenuItem>
                        {wishlistEnabled && (
                          <DropdownMenuItem asChild>
                            <Link href="/profile?tab=wishlist" className="text-popover-foreground hover:text-accent dark:text-white dark:hover:text-gold">Wishlist</Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-stone-800" />
                        <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300">Se deconnecter</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="ghost" size="icon" className="text-foreground hover:text-accent dark:text-white dark:hover:text-gold" onClick={() => setShowAuthModal(true)} aria-label="Compte">
                      <User className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                <Cart />

                <Button
                  ref={mobileMenuButtonRef}
                  variant="ghost"
                  className="inline-flex h-11 shrink-0 items-center gap-2 rounded-none border border-border bg-card px-3 text-sm font-semibold uppercase tracking-[0.12em] text-card-foreground hover:bg-primary hover:text-primary-foreground lg:hidden dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
                  onClick={() => setIsMenuOpen((value) => !value)}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-storefront-menu"
                  aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  <span>{isMenuOpen ? "Fermer" : "Menu"}</span>
                </Button>
              </div>
            </div>

            {isMenuOpen && (
              <div
                id="mobile-storefront-menu"
                ref={mobileMenuPanelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Menu mobile"
                tabIndex={-1}
                data-mobile-menu
                className="fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col overflow-y-auto overflow-x-hidden bg-background text-foreground outline-none lg:hidden dark:bg-[#050505] dark:text-white"
                style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))" }}
              >
                <div className="sticky top-0 z-[110] border-b border-border bg-background px-4 py-3 dark:border-white/10 dark:bg-[#050505]">
                  <div className="flex h-14 items-center justify-between gap-3">
                    <Link
                      href="/"
                      className="min-w-0 flex-1 truncate whitespace-nowrap text-base font-semibold uppercase tracking-[0.18em] text-foreground dark:text-white"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex h-10 min-w-0 items-center">
                        {logoUrl ? (
                          <Image src={logoUrl} alt={logoAlt} width={132} height={40} className="h-10 w-auto object-contain" unoptimized priority />
                        ) : (
                          <span className="truncate">{storeName}</span>
                        )}
                      </span>
                    </Link>
                    <Cart />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-none border border-border bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-accent dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white dark:hover:text-black"
                      onClick={closeMobileMenu}
                      aria-label="Fermer le menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <nav className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col gap-3 px-4 py-5">
                  <div className="border-b border-border pb-4 dark:border-white/10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/80">{storeName}</p>
                    <p className="mt-1 text-sm text-muted-foreground dark:text-white/65">Boutique, Drops et FAZA</p>
                  </div>
                  <MobileNavigation items={mobileItems} onNavigate={closeMobileMenu} />
                  <ThemeToggle mobile />
                  <p className="mt-3 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground dark:text-white/45">Compte</p>
                  {isAuthenticated && wishlistEnabled && (
                    <Link href="/profile?tab=wishlist" className="group flex items-center justify-between border border-border bg-card px-4 py-3.5 text-sm font-medium text-card-foreground transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-gold/35 dark:hover:bg-gold/10 dark:hover:text-gold" onClick={closeMobileMenu}>
                      <span>Wishlist ({wishlistCount})</span>
                      <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                  {isAuthenticated ? (
                    <>
                      <Link href="/profile?tab=settings" className="group flex items-center justify-between border border-border bg-card px-4 py-3.5 text-sm font-medium text-card-foreground transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-gold/35 dark:hover:bg-gold/10 dark:hover:text-gold" onClick={closeMobileMenu}>
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
                      className="border border-border bg-card px-4 py-3.5 text-left text-sm font-medium text-card-foreground transition-colors hover:border-accent/35 hover:bg-accent/10 hover:text-accent dark:border-white/10 dark:bg-white/[0.03] dark:text-white/90 dark:hover:border-gold/35 dark:hover:bg-gold/10 dark:hover:text-gold"
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
