import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { Playfair_Display, Inter } from 'next/font/google'
import Image from "next/image"
import "./globals.css"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { StoreConfigProvider } from "@/contexts/StoreConfigContext"
import { ThemeProvider } from "@/components/theme-provider"
import EntranceWrapper from "./components/EntranceWrapper"
import MetaPixel from "./components/MetaPixel"
import StoreAnalytics from "./components/StoreAnalytics"
import { Toaster } from "@/components/ui/toaster" // Import Toaster
import { api } from "@/lib/api"
import { getStoreConfig } from "@/lib/store-config"
import { filterNavigationItemsBySurface } from "@/lib/store-navigation/navigation-utils"
import {
  getBrandingCssVariables,
  getStoreDisplayName,
  getValidSocialLinks,
  normalizeDomain,
  normalizeUrl,
} from "@/lib/store-config-shared"
import type { StoreNavigationPublicItem } from "@/lib/api/generated"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const defaultDescription = "Discover the exclusive Savage Rise collection - Contemporary luxury fashion"

export async function generateMetadata(): Promise<Metadata> {
  const { config, unavailable } = await getStoreConfig()
  const name = getStoreDisplayName(config)
  const domain = normalizeDomain(config.domain)
  const favicon = normalizeUrl(config.favicon_url) ?? (unavailable ? "/icon.svg" : undefined)

  return {
    ...(domain ? { metadataBase: new URL(domain) } : {}),
    title: `${name} - Luxury Fashion`,
    description: defaultDescription,
    ...(favicon
      ? {
          icons: {
            icon: [{ url: favicon }],
            shortcut: [{ url: favicon }],
            apple: [{ url: favicon }],
          },
        }
      : {}),
    openGraph: {
      siteName: name,
      locale: config.locale,
    },
    other: {
      "facebook-domain-verification": "uqzxo4h3m2cfnpejx5u3cu5h5nw2xy",
    },
  }
}

function StoreStatusPage({ statusConfig }: { statusConfig: Awaited<ReturnType<typeof getStoreConfig>> }) {
  const { config } = statusConfig
  const name = getStoreDisplayName(config)
  const socials = getValidSocialLinks(config.social_links)
  const message =
    config.status === "maintenance"
      ? "La boutique est momentanement en maintenance. Nous revenons tres vite."
      : "La boutique est actuellement indisponible."

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16 text-white">
      <section className="w-full max-w-xl text-center">
        {config.logo_url ? (
          <Image
            src={config.logo_url}
            alt={config.branding?.logo_alt || name}
            width={160}
            height={80}
            className="mx-auto mb-8 h-16 w-auto object-contain"
            unoptimized
            priority
          />
        ) : (
          <p className="mb-8 font-playfair text-3xl font-bold text-gold">{name}</p>
        )}
        <h1 className="font-playfair text-3xl font-bold sm:text-4xl">{config.status === "maintenance" ? "Maintenance" : "Boutique indisponible"}</h1>
        <p className="mx-auto mt-4 max-w-md text-gray-300">{message}</p>
        {(config.contact_email || socials.length > 0) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            {config.contact_email && (
              <a href={`mailto:${config.contact_email}`} className="text-gold hover:text-white">
                {config.contact_email}
              </a>
            )}
            {socials.map((social) => (
              <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white">
                {social.label}
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

const getServerNavigation = unstable_cache(async (): Promise<{
  headerItems: StoreNavigationPublicItem[]
  mobileItems: StoreNavigationPublicItem[]
}> => {
  try {
    const [headerResponse, mobileResponse] = await Promise.all([
      api.listStoreNavigationMenus(["header"], "desktop"),
      api.listStoreNavigationMenus(["mobile"], "mobile"),
    ])
    const headerMenu = headerResponse.menus?.find((menu) => menu.code === "header")
    const mobileMenu = mobileResponse.menus?.find((menu) => menu.code === "mobile")
    const headerItems = filterNavigationItemsBySurface(headerMenu?.items, "desktop")
    const mobileItems = filterNavigationItemsBySurface(mobileMenu?.items, "mobile")
    const headerMobileItems = filterNavigationItemsBySurface(headerMenu?.items, "mobile")

    return {
      headerItems,
      mobileItems: mobileItems.length > 0 ? mobileItems : headerMobileItems,
    }
  } catch {
    return {
      headerItems: [],
      mobileItems: [],
    }
  }
}, ["storefront-navigation"], { revalidate: 60, tags: ["storefront-navigation"] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [storeConfig, navigation] = await Promise.all([
    getStoreConfig(),
    getServerNavigation(),
  ])
  const { config } = storeConfig
  const isPublicUnavailable = config.status === "maintenance" || config.status === "inactive"

  return (
    <html lang={config.locale} className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background font-inter text-foreground" style={getBrandingCssVariables(config)}>
        <MetaPixel />
        <Suspense fallback={null}>
          <StoreAnalytics />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreConfigProvider value={storeConfig}>
            {isPublicUnavailable ? (
              <StoreStatusPage statusConfig={storeConfig} />
            ) : (
              <AuthProvider>
                <CartProvider>
                  <EntranceWrapper>
                    <Header initialHeaderItems={navigation.headerItems} initialMobileItems={navigation.mobileItems} />
                    {children}
                    <Footer />
                  </EntranceWrapper>
                </CartProvider>
              </AuthProvider>
            )}
          </StoreConfigProvider>
        </ThemeProvider>
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  )
}
