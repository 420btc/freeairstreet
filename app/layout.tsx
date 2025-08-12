import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "../contexts/LanguageContext"
import { ThemeProvider } from "../contexts/ThemeContext"
import { ModalProvider } from "../contexts/ModalContext"
import { InventoryProvider } from "../contexts/InventoryContext"
import AirXChat from "../components/AirXChat"
import { GlobalModals } from "../components/GlobalModals"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Air Street - Alquiler de Bicicletas, Tours y Aventuras",
  description:
    "Alquila bicicletas, patinetes eléctricos, motos, coches y únete a nuestras visitas guiadas en Torremolinos. La aventura te espera en cada rincón.",
  keywords: "alquiler bicicletas, tours, patinetes eléctricos, motos, coches, visitas guiadas, Torremolinos, Málaga, aventura, quad tours",
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
    icon: '/icono.png',
    shortcut: '/icono.png',
    apple: '/icono.png',
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
            <InventoryProvider>
              <ModalProvider>
                {children}
                <AirXChat />
                <GlobalModals />
                <Analytics />
              </ModalProvider>
            </InventoryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
