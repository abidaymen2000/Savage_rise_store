"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Cart from "./Cart"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-playfair font-bold text-gold">
            SAVAGE RISE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/collections" className="text-white hover:text-gold transition-colors">
              Collections
            </Link>
            <Link href="/nouveautes" className="text-white hover:text-gold transition-colors">
              Nouveautés
            </Link>
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
            <Button variant="ghost" size="icon" className="text-white hover:text-gold">
              <User className="h-5 w-5" />
            </Button>
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
              <Link href="/collections" className="text-white hover:text-gold transition-colors">
                Collections
              </Link>
              <Link href="/nouveautes" className="text-white hover:text-gold transition-colors">
                Nouveautés
              </Link>
              <Link href="/about" className="text-white hover:text-gold transition-colors">
                À Propos
              </Link>
              <Link href="/contact" className="text-white hover:text-gold transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
