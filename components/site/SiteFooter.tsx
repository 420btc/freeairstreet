import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import { Instagram, MessageCircle, MapPin } from "lucide-react"

interface SiteFooterProps {
  tagline?: ReactNode
  rights?: ReactNode
  contactLabel?: ReactNode
  backHomeLabel?: ReactNode
  credits?: ReactNode
}

export function SiteFooter({
  tagline = "Rent & Tours · Torremolinos",
  rights = "© 2025 Free Air Street. Todos los derechos reservados.",
  contactLabel = "Contacto",
  backHomeLabel = "Volver al inicio",
  credits,
}: SiteFooterProps) {
  return (
    <footer className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-10 text-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={60} height={60} className="rounded" />
            <div>
              <h3 className="birthstone-regular text-xl font-bold">Free Air Street</h3>
              <p className="text-sm text-gray-700">{tagline}</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                <MapPin className="h-3.5 w-3.5" />
                Calle de la Playa 22 · La Colina
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/freeairstreet?igsh=d25kaDRkM3QwNGJ6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white transition hover:scale-105"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/34655707412"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white transition hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <Link href="/contacto" className="ml-2 text-sm font-semibold text-blue-900 hover:underline">
              {contactLabel}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-yellow-600/40 pt-6 text-xs text-gray-700 md:flex-row">
          <div>
            <p>{rights}</p>
            {credits ? <p className="mt-1 max-w-xl text-[10px] leading-snug opacity-70">{credits}</p> : null}
          </div>
          <Link href="/" className="font-semibold text-blue-900 hover:underline">
            {backHomeLabel}
          </Link>
        </div>
      </div>
    </footer>
  )
}
