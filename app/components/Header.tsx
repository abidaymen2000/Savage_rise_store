"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu, X, User, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { filterNavigationItemsBySurface } from "@/lib/store-navigation/navigation-utils"
import type { StoreNavigationPublicItem } from "@/lib/api/generated"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [headerItems, setHeaderItems] = useState<StoreNavigationPublicItem[]>([])
  const [mobileItems, setMobileItems] = useState<StoreNavigationPublicItem[]>([])
  const { user, isAuthenticated, logout } = useAuth()
  const [wishlistCount, setWishlistCount] = useState(0)
  const pathname = usePathname()

  const closeMobileMenu = () => setIsMenuOpen(false)

  const fetchNavigation = useCallback(async () => {
    try {
      const [headerResponse, mobileResponse] = await Promise.all([
        api.listStoreNavigationMenus(["header"], "desktop"),
        api.listStoreNavigationMenus(["mobile"], "mobile"),
      ])
      const headerMenu = headerResponse.menus?.find((menu) => menu.code === "header")
      const mobileMenu = mobileResponse.menus?.find((menu) => menu.code === "mobile")
      const nextHeaderItems = filterNavigationItemsBySurface(headerMenu?.items, "desktop")
      const nextMobileItems = filterNavigationItemsBySurface(mobileMenu?.items, "mobile")

      setHeaderItems(nextHeaderItems)
      setMobileItems(nextMobileItems.length > 0 ? nextMobileItems : filterNavigationItemsBySurface(headerMenu?.items, "mobile"))
    } catch (error) {
      console.error("Unable to load store navigation", error)
      setHeaderItems([])
      setMobileItems([])
    }
  }, [])

  const fetchWishlistCount = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistCount(0)
      return
    }
    try {
      const wishlistData = await api.getWishlist()
      setWishlistCount(wishlistData.length)
    } catch (error) {
      setWishlistCount(0)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchNavigation()
  }, [fetchNavigation])

  useEffect(() => {
    fetchWishlistCount()
  }, [isAuthenticated, fetchWishlistCount])

  useEffect(() => {
    closeMobileMenu()
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  const handleMobileLogout = () => {
    closeMobileMenu()
    logout()
  }

  const handleMobileSignIn = () => {
    closeMobileMenu()
    setShowAuthModal(true)
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-gold/20 bg-black/90 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo */}
            <Link
              href="/"
              className="min-w-0 flex-1 truncate whitespace-nowrap text-lg font-playfair font-bold text-gold sm:text-2xl md:flex-none"
              onClick={closeMobileMenu}
            >
              SAVAGE RISE
            </Link>

            <DesktopNavigation items={headerItems} />

            <div className="flex shrink-0 items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-gold">
                  <Search className="h-5 w-5" />
                </Button>

                {isAuthenticated && (
                  <Link href="/profile?tab=wishlist">
                    <Button variant="ghost" size="icon" className="text-white hover:text-gold relative">
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-white hover:text-gold relative">
                        <User className="h-5 w-5" />
                        {user?.is_active && <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-green-500" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black border-gray-800" align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/profile?tab=settings" className="text-white hover:text-gold">
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile?tab=orders" className="text-white hover:text-gold">
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile?tab=wishlist" className="text-white hover:text-gold">
                          My Wishlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300">
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-gold"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <Cart />

              <Button
                variant="ghost"
                className="md:hidden inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-gold/70 bg-gold/10 px-3 text-sm font-semibold text-gold shadow-[0_0_18px_rgba(212,175,55,0.22)] hover:bg-gold hover:text-black"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span>{isMenuOpen ? "Close" : "Menu"}</span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gold/30 bg-[#050505]/95 px-4 py-5 shadow-2xl shadow-black/70 backdrop-blur-md">
              <nav className="mx-auto flex w-full max-w-screen-sm flex-col gap-3 pb-4">
                <div className="mb-1 border-b border-gold/20 pb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/80">Savage Rise</p>
                  <p className="mt-1 text-sm text-white/65">Explore the collection</p>
                </div>
                <MobileNavigation items={mobileItems} onNavigate={closeMobileMenu} />

                <p className="mt-3 px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  Account
                </p>
                {isAuthenticated && (
                  <Link
                    href="/profile?tab=wishlist"
                    className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold"
                    onClick={closeMobileMenu}
                  >
                    <span>My Wishlist ({wishlistCount})</span>
                    <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile?tab=settings"
                      className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold"
                      onClick={closeMobileMenu}
                    >
                      <span>My Profile</span>
                      <ChevronRight className="h-4 w-4 text-gold/60 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <button
                      onClick={handleMobileLogout}
                      className="rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-3.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleMobileSignIn}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left text-sm font-medium text-white/90 transition-colors hover:border-gold/35 hover:bg-gold/10 hover:text-gold"
                  >
                    Sign in
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
