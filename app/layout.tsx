import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "../contexts/LanguageContext"
import { ThemeProvider } from "../contexts/ThemeContext"
import AirXChat from "../components/AirXChat"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Free Air Street - Alquiler de Bicicletas y Tours",
  description:
    "Alquila bicicletas, patinetes eléctricos, motos, coches y únete a nuestras visitas guiadas. La aventura te espera en cada rincón.",
  icons: {
    icon: '/icono.png',
    shortcut: '/icono.png',
    apple: '/icono.png',
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
            {children}
            <AirXChat />
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
