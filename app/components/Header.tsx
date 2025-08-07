"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Menu, X, User, Search, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Cart from "./Cart"
import AuthModal from "./AuthModal"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import type { Category, WishlistItem } from "@/types/api"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { user, isAuthenticated, logout } = useAuth()
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }, []);

  const fetchWishlistCount = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistCount(0);
      return;
    }
    try {
      const wishlistData = await api.getWishlist();
      setWishlistCount(wishlistData.length);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchWishlistCount();
  }, [isAuthenticated, fetchWishlistCount]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gold/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-playfair font-bold text-gold">
              SAVAGE RISE
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white hover:text-gold transition-colors">
                  Collections
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black border-gray-800">
                  <DropdownMenuItem asChild>
                    <Link href="/products" className="text-white hover:text-gold">
                      Tous les produits
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/categories/${category.name}`} className="text-white hover:text-gold">
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <Link href="/nouveautes" className="text-white hover:text-gold transition-colors">
                Nouveautés
              </Link> */}
              <Link href="/about" className="text-white hover:text-gold transition-colors">
                À Propos
              </Link>
              <Link href="/contact" className="text-white hover:text-gold transition-colors">
                Contact
              </Link>
            </nav>

            {/* Desktop Actions */}
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
                      <Link href="/profile" className="text-white hover:text-gold">
                        Mon Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=orders" className="text-white hover:text-gold">
                        Mes Commandes
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=wishlist" className="text-white hover:text-gold">
                        Ma Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300">
                      Déconnexion
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

              <Cart />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gold/20">
              <nav className="flex flex-col space-y-4">
                <Link href="/products" className="text-white hover:text-gold transition-colors">
                  Tous les produits
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.name}`}
                    className="text-white hover:text-gold transition-colors pl-4"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link href="/nouveautes" className="text-white hover:text-gold transition-colors">
                  Nouveautés
                </Link>
                <Link href="/about" className="text-white hover:text-gold transition-colors">
                  À Propos
                </Link>
                <Link href="/contact" className="text-white hover:text-gold transition-colors">
                  Contact
                </Link>
                {isAuthenticated && (
                  <Link href="/profile?tab=wishlist" className="text-white hover:text-gold transition-colors">
                    Ma Wishlist ({wishlistCount})
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className="text-white hover:text-gold transition-colors">
                      Mon Profil
                    </Link>
                    <button onClick={logout} className="text-red-400 hover:text-red-300 text-left">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-white hover:text-gold transition-colors text-left"
                  >
                    Connexion
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
