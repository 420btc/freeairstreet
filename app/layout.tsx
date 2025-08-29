import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "../contexts/LanguageContext"
import { ThemeProvider } from "../contexts/ThemeContext"
import { ModalProvider } from "../contexts/ModalContext"
import { InventoryProvider } from "../contexts/InventoryContext"
import { CookieConsentProvider } from "../contexts/CookieConsentContext"
import AirXChat from "../components/AirXChat"
import { GlobalModals } from "../components/GlobalModals"
import CookieConsentBanner from "../components/CookieConsentBanner"
import { Analytics } from "@vercel/analytics/react"
import { LayoutContent } from "@/components/LayoutContent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Air Street - Alquiler de Bicicletas, Scooters, Tours y Aventuras",
  description:
    "Alquila bicicletas, patinetes eléctricos, motos, coches y únete a nuestras visitas guiadas en Torremolinos. La aventura te espera en cada rincón de Málaga!.",
  keywords: "alquiler bicicletas, tours, patinetes eléctricos, scooters, motos, coches, visitas guiadas, Torremolinos, Málaga, aventura, quad tours",
  authors: [{ name: "Free Air Street" }],
  creator: "Free Air Street",
  publisher: "Free Air Street",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icono.png', sizes: '32x32', type: 'image/png' },
      { url: '/icono.png', sizes: '16x16', type: 'image/png' },
      { url: '/icono.png', sizes: '192x192', type: 'image/png' },
      { url: '/icono.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/icono.png',
    apple: [
      { url: '/icono.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/icono.png',
      },
      {
        rel: 'icon',
        type: 'image/png', 
        sizes: '16x16',
        url: '/icono.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/icono.png',
      }
    ],
  },
  metadataBase: new URL('https://www.freeairstreet.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es': '/',
      'en': '/?lang=en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.freeairstreet.com',
    title: 'Free Air Street - Alquiler de Bicicletas, Tours y Aventuras',
    description: 'Alquila bicicletas, patinetes eléctricos, motos, coches y únete a nuestras visitas guiadas en Torremolinos. La aventura te espera en cada rincón.',
    siteName: 'Free Air Street',
    images: [
      {
        url: '/icono.png',
        width: 512,
        height: 512,
        alt: 'Free Air Street Logo',
      },
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'Free Air Street - Alquiler y Tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Air Street - Alquiler de Bicicletas, Tours y Aventuras',
    description: 'Alquila bicicletas, patinetes eléctricos, motos, coches y únete a nuestras visitas guiadas en Torremolinos.',
    images: ['/hero.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <CookieConsentProvider>
              <InventoryProvider>
                <ModalProvider>
                  <LayoutContent>
                    {children}
                    <AirXChat />
                  </LayoutContent>
                  <GlobalModals />
                  <CookieConsentBanner />
                  <Analytics />
                </ModalProvider>
              </InventoryProvider>
            </CookieConsentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
