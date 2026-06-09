"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"
import { SiTiktok } from "react-icons/si"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-playfair font-bold text-gold mb-4">SAVAGE RISE</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Excellence in contemporary fashion. Every piece tells a story of elegance and sophistication.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/savage_rise_tn/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Savage Rise"
                title="Instagram"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.tiktok.com/@savage.rise"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Savage Rise"
                title="TikTok"
                className="text-gray-400 hover:text-gold transition-colors"
              >
                <SiTiktok className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">NAVIGATION</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">CUSTOMER SERVICE</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                  Size guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 Savage Rise. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/legal" className="text-gray-500 hover:text-white text-sm transition-colors">
              Legal notice
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
