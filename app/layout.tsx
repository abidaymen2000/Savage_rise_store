import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from 'next/font/google'
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import EntranceWrapper from "./components/EntranceWrapper"
import MetaPixel from "./components/MetaPixel"
import { Toaster } from "@/components/ui/toaster" // Import Toaster

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://savagerise.com"),
  title: "Savage Rise - Luxury Fashion",
  description: "Discover the exclusive Savage Rise collection - Contemporary luxury fashion",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" }],
  },
  other: {
    "facebook-domain-verification": "uqzxo4h3m2cfnpejx5u3cu5h5nw2xy",
  }, 
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-inter bg-black text-white">
        <MetaPixel />
        <AuthProvider>
          <CartProvider>
            <EntranceWrapper>
              <Header />
              {children}
              <Footer />
            </EntranceWrapper>
          </CartProvider>
        </AuthProvider>
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  )
}
