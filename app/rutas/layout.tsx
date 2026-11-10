import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rutas guiadas por Málaga en bici eléctrica | Free Air Street",
  description:
    "Tres rutas guiadas por el dueño de Free Air Street: 2,5 h por 20 €, 3 h por 30 € y 6 h por 40 €. Costa, miradores de Benalmádena y Mijas, y gran vuelta al Guadalhorce. Bici eléctrica y casco incluidos.",
  keywords:
    "rutas Málaga, rutas en bici Málaga, rutas guiadas Torremolinos, bici eléctrica Mijas, ruta costera Málaga, rutas Strava Málaga",
  alternates: {
    canonical: "/rutas",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.freeairstreet.com/rutas",
    title: "Rutas guiadas por Málaga | Free Air Street",
    description:
      "Rutas en bici eléctrica por la costa de Torremolinos, los miradores de Benalmádena y Mijas y el Valle del Guadalhorce. Desde 20 € por persona.",
    siteName: "Free Air Street",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Rutas guiadas por Málaga - Free Air Street",
      },
    ],
  },
}

export default function RutasLayout({ children }: { children: React.ReactNode }) {
  return children
}
