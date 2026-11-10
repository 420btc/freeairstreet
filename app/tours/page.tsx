"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Euro,
  Info,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageToggle } from "@/components/LanguageToggle"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ReservationModal } from "@/components/ReservationModal"
import { PageHero } from "@/components/site/PageHero"
import { SectionHeading } from "@/components/site/SectionHeading"
import { SiteFooter } from "@/components/site/SiteFooter"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePricing } from "@/contexts/PricingContext"

export default function ToursPage() {
  const [activeTab, setActiveTab] = useState("excursiones")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{name: string, price?: string}>({name: ""})
  const { t, language } = useLanguage()
  const { getPrice } = usePricing()

  const handleReservation = (itemName: string, itemPrice?: string) => {
    setSelectedItem({name: itemName, price: itemPrice})
    setIsModalOpen(true)
  }

  const horseRiding = [
    {
      name: "Paseos a Caballo",
      duration: "1.30 horas",
      capacity: "1 persona",
      price: getPrice("paseo-caballo", "65€"),
      description: "Disfruta de un relajante paseo a caballo por paisajes naturales únicos",
      image: "/lugares/paseocaballo.jpeg",
      highlights: ["Guía experto", "Caballo dócil", "Paisajes naturales", "Experiencia única"],
      emoji: "🐎",
    },
  ]

  // Helpers: localization for EN
  const dayMap: Record<string, string> = {
    'Lunes': 'Monday',
    'Martes': 'Tuesday',
    'Miércoles': 'Wednesday',
    'Jueves': 'Thursday',
    'Viernes': 'Friday',
    'Sábado': 'Saturday',
    'Domingo': 'Sunday',
  }

  const countryMap: Record<string, string> = {
    'España': 'Spain',
    'Marruecos': 'Morocco',
  }

  const translateExcursion = (e: any) => {
    if (language !== 'en') return e
    const nameMap: Record<string, string> = {
      'Sevilla': 'Seville',
      'Córdoba': 'Cordoba',
      'Nerja y Frigiliana': 'Nerja & Frigiliana',
      'Mijas Marbella Banús': 'Mijas Marbella Banús',
    }
    const descMap: Record<string, string> = {
      'Compras libres de impuestos en Gibraltar con tiempo libre': 'Tax-free shopping in Gibraltar with free time',
      'Visita completa a Gibraltar incluyendo el Peñón y los monos': 'Complete visit to Gibraltar including the Rock and the monkeys',
      'Visita a la majestuosa Alhambra y los jardines del Generalife': 'Visit the majestic Alhambra and the Generalife gardens',
      'Descubre la capital andaluza: Catedral, Alcázar y barrio de Santa Cruz': 'Discover the Andalusian capital: Cathedral, Alcázar and Santa Cruz neighborhood',
      'Mezquita-Catedral y el encantador barrio judío de Córdoba': 'Mosque-Cathedral and the charming Jewish quarter of Cordoba',
      'Pueblo blanco con impresionantes vistas y plaza de toros histórica': 'White town with stunning views and a historic bullring',
      'Aventura por el sendero más espectacular de Andalucía': 'Adventure along Andalusia’s most spectacular trail',
      'Pueblos blancos costeros con cuevas y vistas al Mediterráneo': 'Coastal white villages with caves and Mediterranean views',
      'Ruta por la Costa del Sol: Mijas, Marbella y Puerto Banús': 'Route along the Costa del Sol: Mijas, Marbella and Puerto Banús',
      'Excursión a Marruecos: medina, mercados y cultura bereber': 'Excursion to Morocco: medina, markets and Berber culture',
    }
    return {
      ...e,
      name: nameMap[e.name] || e.name,
      description: descMap[e.description] || e.description,
      days: Array.isArray(e.days) ? e.days.map((d: string) => dayMap[d] || d) : e.days,
      country: countryMap[e.country] || e.country,
    }
  }

  const translateBoat = (b: any) => {
    if (language !== 'en') return b
    const nameMap: Record<string, string> = {
      'Dolphin Trip (Paseo de los Delfines)': 'Dolphin Trip',
      'Fiestas en Barco (Boat Party)': 'Boat Party',
      'Alquiler de Embarcaciones Pequeñas sin Carnet': 'Small Boat Rental (No License Required)',
    }
    const descMap: Record<string, string> = {
      'Avistamiento de delfines en su hábitat natural desde Puerto Marina': 'Dolphin watching in their natural habitat from Puerto Marina',
      'Fiesta en barco con música, bebidas y diversión en alta mar': 'Boat party with music, drinks and fun at sea',
      'Alquila una embarcación pequeña sin necesidad de licencia náutica': 'Rent a small boat without the need for a nautical license',
    }
    const locationMap: Record<string, string> = {
      'Consultar disponibilidad': 'Check availability',
      'Consultar modelo': 'Check model',
    }
    const priceMap: Record<string, string> = {
      'Consultar precio': 'Consult price',
    }
    const highlightsMap: Record<string, string> = {
      'Avistamiento delfines': 'Dolphin watching',
      'Puerto Marina': 'Puerto Marina',
      'Guía marino': 'Marine guide',
      'Experiencia familiar': 'Family experience',
      'Música en vivo': 'Live music',
      'Bebidas incluidas': 'Drinks included',
      'Ambiente festivo': 'Festive atmosphere',
      'Grupos grandes': 'Large groups',
      'Sin carnet necesario': 'No license required',
      'Fácil manejo': 'Easy to operate',
      'Libertad total': 'Total freedom',
      'Aventura marina': 'Sea adventure',
    }
    return {
      ...b,
      name: nameMap[b.name] || b.name,
      description: descMap[b.description] || b.description,
      location: locationMap[b.location] || b.location,
      price: priceMap[b.price] || b.price,
      highlights: Array.isArray(b.highlights) ? b.highlights.map((h: string) => highlightsMap[h] || h) : b.highlights,
    }
  }

  const translateHorse = (h: any) => {
    if (language !== 'en') return h
    return {
      ...h,
      name: 'Horse Riding',
      duration: '1.30 hours',
      capacity: '1 person',
      description: 'Enjoy a relaxing horse ride through unique natural landscapes',
      highlights: ['Expert guide', 'Docile horse', 'Natural landscapes', 'Unique experience'],
    }
  }

  // Localized Horse Riding
  const horseRidingLocalized = language === 'en' ? horseRiding.map((h: any) => translateHorse(h)) : horseRiding

  const boatActivities = [
    {
      name: "Quad Aventura",
      location: "Alrededores de Málaga",
      priceAdult: "75€",
      priceChild: "Gratis (7-16 años)",
      description: "Experiencia inolvidable en quad por los alrededores de Málaga. Rutas adaptadas a todos los niveles.",
      video: "/videoplayback.mp4",
      highlights: ["Niños viajan gratis", "Guía experto incluido", "Equipamiento de seguridad", "Rutas adaptadas"],
      emoji: "🏎️",
      isVideo: true,
      reservationUrl: "https://quadaventuracostadelsol.com/actividades-de-aventura"
    },
    {
      name: "Dolphin Trip (Paseo de los Delfines)",
      location: "Puerto Marina Benalmádena",
      priceAdult: getPrice("dolphin-trip", "19€"),
      priceChild: "12€",
      description: "Avistamiento de delfines en su hábitat natural desde Puerto Marina",
      image: "/lugares/dolphintrip.jpg",
      highlights: ["Avistamiento delfines", "Puerto Marina", "Guía marino", "Experiencia familiar"],
      emoji: "🐬",
    },
    {
      name: "Fiestas en Barco (Boat Party)",
      location: "Consultar disponibilidad",
      price: "Consultar precio",
      description: "Fiesta en barco con música, bebidas y diversión en alta mar",
      image: "/lugares/fiestabarco.jpeg",
      highlights: ["Música en vivo", "Bebidas incluidas", "Ambiente festivo", "Grupos grandes"],
      emoji: "🎉",
    },
    {
      name: "Alquiler de Embarcaciones Pequeñas sin Carnet",
      location: "Consultar modelo",
      price: "Consultar precio",
      description: "Alquila una embarcación pequeña sin necesidad de licencia náutica",
      image: "/lugares/embarcacion.jpg",
      highlights: ["Sin carnet necesario", "Fácil manejo", "Libertad total", "Aventura marina"],
      emoji: "⛵",
    },
  ]

  const excursions = [
    {
      name: "Gibraltar Shopping",
      days: ["Martes", "Miércoles", "Viernes", "Sábado"],
      price: "33€",
      description: "Compras libres de impuestos en Gibraltar con tiempo libre",
      image: "/destinos/gibraltarshoping.jpg",
      emoji: "🛍️",
      country: "Gibraltar",
    },
    {
      name: "Gibraltar Visit",
      days: ["Martes", "Miércoles", "Viernes", "Sábado"],
      price: "83€",
      description: "Visita completa a Gibraltar incluyendo el Peñón y los monos",
      image: "/destinos/gibraltarv.jpg",
      emoji: "🐒",
      country: "Gibraltar",
    },
    {
      name: "Granada Alhambra",
      days: ["Jueves", "Viernes"],
      price: getPrice("alhambra-granada", "94€"),
      description: "Visita a la majestuosa Alhambra y los jardines del Generalife",
      image: "/destinos/alhambragranada.png",
      emoji: "🏰",
      country: "España",
    },
    {
      name: "Sevilla",
      days: ["Miércoles"],
      price: "81€",
      description: "Descubre la capital andaluza: Catedral, Alcázar y barrio de Santa Cruz",
      image: "/destinos/sevilla.jpg",
      emoji: "🕌",
      country: "España",
    },
    {
      name: "Córdoba",
      days: ["Jueves"],
      price: "81€",
      description: "Mezquita-Catedral y el encantador barrio judío de Córdoba",
      image: "/destinos/cordoba.png",
      emoji: "🕌",
      country: "España",
    },
    {
      name: "Ronda",
      days: ["Martes", "Sábado"],
      price: "59€",
      description: "Pueblo blanco con impresionantes vistas y plaza de toros histórica",
      image: "/destinos/ronda.png",
      emoji: "🌉",
      country: "España",
    },
    {
      name: "Caminito del Rey",
      days: ["Martes", "Miércoles", "Jueves", "Viernes"],
      price: getPrice("caminito-rey", "63€"),
      description: "Aventura por el sendero más espectacular de Andalucía",
      image: "/destinos/caminitodelrey.jpg",
      emoji: "🥾",
      country: "España",
    },
    {
      name: "Nerja y Frigiliana",
      days: ["Lunes"],
      price: getPrice("nerja-setenil", "45€"),
      description: "Pueblos blancos costeros con cuevas y vistas al Mediterráneo",
      image: "/destinos/nerjayfrig.jpg",
      emoji: "🏖️",
      country: "España",
    },
    {
      name: "Mijas Marbella Banús",
      days: ["Sábado"],
      price: getPrice("marbella-mijas", "45€"),
      description: "Ruta por la Costa del Sol: Mijas, Marbella y Puerto Banús",
      image: "/destinos/marbella.jpg",
      emoji: "🏖️",
      country: "España",
    },
    {
      name: "Tánger",
      days: ["Sábado"],
      price: getPrice("tanger", "149€"),
      description: "Excursión a Marruecos: medina, mercados y cultura bereber",
      image: "/destinos/tanger.jpg",
      emoji: "🕌",
      country: "Marruecos",
    },
  ]

  const getDayColor = (day: string) => {
    const colors: { [key: string]: string } = {
      // ES
      Lunes: "bg-blue-100 text-blue-800",
      Martes: "bg-green-100 text-green-800",
      Miércoles: "bg-yellow-100 text-yellow-800",
      Jueves: "bg-purple-100 text-purple-800",
      Viernes: "bg-pink-100 text-pink-800",
      Sábado: "bg-orange-100 text-orange-800",
      Domingo: "bg-red-100 text-red-800",
      // EN
      Monday: "bg-blue-100 text-blue-800",
      Tuesday: "bg-green-100 text-green-800",
      Wednesday: "bg-yellow-100 text-yellow-800",
      Thursday: "bg-purple-100 text-purple-800",
      Friday: "bg-pink-100 text-pink-800",
      Saturday: "bg-orange-100 text-orange-800",
      Sunday: "bg-red-100 text-red-800",
    }
    return colors[day] || "bg-gray-100 text-gray-800"
  }

  const featuredExcursions = ["Granada Alhambra", "Sevilla", "Caminito del Rey"]

  const copy = {
    es: {
      heroBadge: "Tours y excursiones",
      heroImageAlt: "Excursiones guiadas por Andalucía",
      statExcursions: `${excursions.length} excursiones`,
      statExcursionsLabel: "por toda Andalucía",
      statPrice: "Desde 19€",
      statPriceLabel: "por persona",
      statLanguages: "5 idiomas",
      statLanguagesLabel: "es · en · fr · de · it",
      statGuide: "Guía local",
      statGuideLabel: "te acompaña todo el día",
      ctaExperiences: "Ver experiencias",
      ctaWhatsapp: "WhatsApp",
      eyebrow: "Temporada 2026",
      featured: "Destacado",
      priceFrom: "Desde",
      infoEyebrow: "Antes de reservar",
      infoTitle: "Información útil",
      infoSubtitle: "Precios especiales, idiomas y todo lo que incluyen nuestras excursiones y actividades.",
      footerTagline: "Rent & Tours · @freeairstreet",
      footerRights: "© 2025 Free Air Street. Todos los derechos reservados.",
      backHome: "Volver al inicio",
    },
    en: {
      heroBadge: "Tours & excursions",
      heroImageAlt: "Guided excursions across Andalusia",
      statExcursions: `${excursions.length} excursions`,
      statExcursionsLabel: "across Andalusia",
      statPrice: "From 19€",
      statPriceLabel: "per person",
      statLanguages: "5 languages",
      statLanguagesLabel: "es · en · fr · de · it",
      statGuide: "Local guide",
      statGuideLabel: "with you all day",
      ctaExperiences: "See experiences",
      ctaWhatsapp: "WhatsApp",
      eyebrow: "2026 season",
      featured: "Featured",
      priceFrom: "From",
      infoEyebrow: "Before you book",
      infoTitle: "Useful information",
      infoSubtitle: "Special prices, languages and everything included in our excursions and activities.",
      footerTagline: "Rent & Tours · @freeairstreet",
      footerRights: "© 2025 Free Air Street. All rights reserved.",
      backHome: "Back to home",
    },
  }

  const text = language === 'en' ? copy.en : copy.es

  const scrollToExperiences = () => {
    document.getElementById("experiencias")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6f8] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            {/* Back Arrow */}
            <Link href="/">
              <Button variant="ghost" size="lg" className="text-blue-900 hover:text-blue-700 navbar-back-button p-4">
                <ArrowLeft className="h-12 w-12" />
              </Button>
            </Link>

            {/* Logo */}
            <Link href="/" className="flex items-center justify-center sm:justify-start leading-3 font-mono italic tracking-tighter space-x-4 sm:space-x-12 hover:opacity-80 transition-opacity cursor-pointer">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="hidden md:block text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-black text-blue-900 navbar-title birthstone-regular leading-tight">Free Air Street</h1>
                <p className="hidden sm:block text-2xl text-blue-800 navbar-subtitle birthstone-regular -mt-3">Rent & Tours</p>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8 flex-1 justify-center">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.rental')}
              </Link>
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                {t('header.tours')}
              </Link>
              <Link href="/rutas" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.routes')}
              </Link>
              <Link href="/tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.shop')}
              </Link>
              <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.contact')}
              </Link>
            </nav>

            {/* Page Title for Mobile - Centered */}
            <div className="md:hidden flex-1 text-center">
              <h1 className="text-lg font-bold text-blue-900 navbar-title">{t('header.tours')}</h1>
            </div>

            {/* QR Code, Language Toggle and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div 
                className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => setIsQrModalOpen(true)}
              >
                <QrCode className="h-5 w-5 text-blue-900" />
                <span className="text-sm text-blue-900 font-medium">{t('header.scanPrices')}</span>
              </div>

              {/* Language Toggle and Theme Toggle */}
              <div className="flex items-center space-x-2">
                <LanguageToggle />
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
              </div>

              <button className="md:hidden text-blue-900 navbar-mobile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 navbar-mobile-icon" /> : <Menu className="h-6 w-6 navbar-mobile-icon" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-yellow-600 animate-slideDown">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/alquiler" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="animate-typewriter">{t('header.rental')}</span>
                </Link>
                <Link 
                  href="/tours" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium border-l-4 border-blue-900 pl-2 animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.2s' }}>{t('header.tours')}</span>
                </Link>
                <Link 
                  href="/rutas" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>{t('header.routes')}</span>
                </Link>
                <Link 
                  href="/tienda" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>{t('header.shop')}</span>
                </Link>
                <Link 
                  href="/contacto" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.5s' }}>{t('header.contact')}</span>
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-yellow-600 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <PageHero
        badge={
          <>
            <Sparkles className="h-4 w-4" />
            {text.heroBadge}
          </>
        }
        title={t('tours.pageTitle')}
        subtitle={t('tours.pageSubtitle')}
        image="/destinos/marbella.jpg"
        imageAlt={text.heroImageAlt}
        stats={[
          { icon: <Calendar className="h-5 w-5" />, value: text.statExcursions, label: text.statExcursionsLabel },
          { icon: <Euro className="h-5 w-5" />, value: text.statPrice, label: text.statPriceLabel },
          { icon: <Languages className="h-5 w-5" />, value: text.statLanguages, label: text.statLanguagesLabel },
          { icon: <Users className="h-5 w-5" />, value: text.statGuide, label: text.statGuideLabel },
        ]}
        actions={
          <>
            <Button
              onClick={scrollToExperiences}
              className="h-14 rounded-full bg-yellow-400 px-8 text-base font-bold text-blue-950 shadow-xl shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              {text.ctaExperiences}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="https://wa.me/34655707412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              <MessageCircle className="h-5 w-5" />
              {text.ctaWhatsapp}
            </a>
          </>
        }
      />

      {/* Experiencias */}
      <section id="experiencias" className="container mx-auto scroll-mt-24 px-4 py-14 md:py-20">
        <SectionHeading eyebrow={text.eyebrow} title={t('tours.title')} subtitle={t('tours.subtitle')} />

        <div className="mt-10 md:mt-14">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="hidden rounded-[2.5rem] border border-slate-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] sm:block">
              {/* Desktop: Una fila */}
              <TabsList className="grid h-auto w-full grid-cols-3 gap-1.5 rounded-full bg-transparent p-0">
                <TabsTrigger
                  value="excursiones"
                  className="h-12 gap-2 rounded-full px-4 text-sm font-bold text-slate-600 transition data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-950 data-[state=active]:shadow-md hover:bg-slate-100 dark:text-slate-300 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950 dark:hover:bg-white/10 sm:text-base"
                >
                  <span>🏛️</span>
                  <span>{t('tours.excursions')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="actividades-marinas"
                  className="h-12 gap-2 rounded-full px-4 text-sm font-bold text-slate-600 transition data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-950 data-[state=active]:shadow-md hover:bg-slate-100 dark:text-slate-300 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950 dark:hover:bg-white/10 sm:text-base"
                >
                  <span>🚢</span>
                  <span>{t('tours.activities')}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="caballos"
                  className="relative h-12 gap-2 rounded-full px-4 text-sm font-bold text-slate-600 transition data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-950 data-[state=active]:shadow-md hover:bg-slate-100 dark:text-slate-300 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950 dark:hover:bg-white/10 sm:text-base"
                >
                  <span>🐎</span>
                  <span>{t('tours.horseRiding')}</span>
                  <div className="absolute -top-2 -right-2 rotate-12 rounded-full border-2 border-yellow-500 bg-yellow-400 px-2 py-1 text-xs font-bold text-red-600 shadow-lg">
                    HOT!
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mobile: Dos filas */}
            <div className="space-y-3 sm:hidden">
              <div className="rounded-full border border-slate-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1.5 rounded-full bg-transparent p-0">
                  <TabsTrigger
                    value="excursiones"
                    className="h-12 gap-2 rounded-full px-3 text-xs font-bold text-slate-600 transition data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-950 data-[state=active]:shadow-md dark:text-slate-300 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950"
                  >
                    <span>🏛️</span>
                    <span>{t('tours.excursions')}</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="actividades-marinas"
                    className="h-12 gap-2 rounded-full px-3 text-xs font-bold text-slate-600 transition data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-950 data-[state=active]:shadow-md dark:text-slate-300 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950"
                  >
                    <span>🚢</span>
                    <span>{t('tours.activities')}</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="rounded-full border border-slate-200/80 bg-white/70 p-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
                <TabsList className="grid h-auto w-full grid-cols-1 rounded-full bg-transparent p-0">
                  <TabsTrigger
                    value="caballos"
                    className="relative h-12 gap-2 rounded-full px-3 text-xs font-bold text-slate-600 transition data-[state=active]:bg-yellow-400 data-[state=active]:text-blue-950 data-[state=active]:shadow-md dark:text-slate-300 dark:data-[state=active]:bg-yellow-400 dark:data-[state=active]:text-blue-950"
                  >
                    <span>🐎</span>
                    <span>{t('tours.horseRiding')}</span>
                    <div className="absolute -top-1 -right-1 rotate-12 rounded-full border-2 border-yellow-500 bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-red-600 shadow-lg">
                      HOT!
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Excursiones Tab */}
            <TabsContent value="excursiones">
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(language === 'en' ? excursions.map(translateExcursion) : excursions).map((excursion, index) => {
                  const featured = featuredExcursions.includes(excursions[index]?.name ?? excursion.name)
                  const days = language === 'en'
                    ? (excursion.days || []).map((d: string) => dayMap[d] || d)
                    : excursion.days

                  return (
                    <article
                      key={index}
                      className={`group flex flex-col overflow-hidden rounded-[2rem] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/70 ${
                        featured
                          ? "border-yellow-400 ring-4 ring-yellow-300/40 dark:border-yellow-400"
                          : "border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800">
                        <Image
                          src={excursion.image || "/placeholder.svg"}
                          alt={excursion.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-xl backdrop-blur-md">
                            {excursion.emoji}
                          </span>
                          <span className="rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/85 backdrop-blur-md">
                            {excursion.country}
                          </span>
                        </div>

                        {featured && (
                          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-950">
                            <Star className="h-3 w-3" />
                            {text.featured}
                          </span>
                        )}

                        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                          <h3 className="min-w-0 flex-1 text-xl font-black leading-tight text-white">{excursion.name}</h3>
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-300">{text.priceFrom}</p>
                            <p className="text-4xl font-black leading-none text-white">{excursion.price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{excursion.description}</p>

                        <div className="mt-4">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            {t('tours.availableDays')}
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {(days || []).map((day: string, dayIndex: number) => (
                              <span
                                key={dayIndex}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getDayColor(day)}`}
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="mt-5 h-12 w-full rounded-full bg-blue-900 font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                          onClick={() => handleReservation(excursion.name, excursion.price)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Reservar Excursión
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </TabsContent>

            {/* Actividades Marinas Tab */}
            <TabsContent value="actividades-marinas">
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(language === 'en' ? boatActivities.map(translateBoat) : boatActivities).map((activity, index) => {
                  const featured = boatActivities[index]?.name === "Alquiler de Embarcaciones Pequeñas sin Carnet"

                  return (
                    <article
                      key={index}
                      className={`group flex flex-col overflow-hidden rounded-[2rem] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/70 ${
                        featured
                          ? "border-yellow-400 ring-4 ring-yellow-300/40 dark:border-yellow-400"
                          : "border-slate-200 dark:border-white/10"
                      }`}
                    >
                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800">
                        {activity.isVideo ? (
                          <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          >
                            <source src={activity.video} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={activity.image || "/placeholder.svg"}
                            alt={activity.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-xl backdrop-blur-md">
                            {activity.emoji}
                          </span>
                          {featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-950">
                              <Star className="h-3 w-3" />
                              {text.featured}
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                          <h3 className="min-w-0 flex-1 text-xl font-black leading-tight text-white">{activity.name}</h3>
                          {activity.priceAdult ? (
                            <div className="shrink-0 text-right">
                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-300">{t('tours.adults')}</p>
                              <p className="text-4xl font-black leading-none text-white">{activity.priceAdult}</p>
                              <p className="mt-1 inline-flex rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                                {t('tours.children')}: {activity.priceChild}
                              </p>
                            </div>
                          ) : (
                            <span className="shrink-0 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                              {activity.price || t('tours.consult')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{activity.description}</p>

                        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                          <MapPin className="h-4 w-4 shrink-0 text-yellow-500" />
                          <span>{activity.location}</span>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            {t('tours.whatIncludes')}
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {activity.highlights.map((highlight: string, highlightIndex: number) => (
                              <span
                                key={highlightIndex}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          className={`mt-5 h-12 w-full rounded-full font-bold ${
                            activity.reservationUrl
                              ? 'bg-yellow-400 text-blue-950 hover:bg-yellow-300'
                              : 'bg-blue-900 text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300'
                          }`}
                          onClick={() => {
                            if (activity.reservationUrl) {
                              window.open(activity.reservationUrl, '_blank')
                            } else {
                              handleReservation(activity.name, activity.priceAdult || activity.price)
                            }
                          }}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {activity.reservationUrl
                            ? 'Reservar Ahora'
                            : (
                              activity.price === "Consultar precio" ||
                              activity.price === "Consult price"
                            ) ? t('tours.consultAvailability') : t('tours.reserveActivity')}
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </TabsContent>

            {/* Caballos Tab */}
            <TabsContent value="caballos">
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {horseRidingLocalized.map((activity, index) => (
                  <article
                    key={index}
                    className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
                  >
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800">
                      <Image
                        src={activity.image || "/placeholder.svg"}
                        alt={activity.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                      <div className="absolute left-4 top-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-xl backdrop-blur-md">
                          {activity.emoji}
                        </span>
                      </div>

                      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                        <h3 className="text-xl font-black leading-tight text-white">{activity.name}</h3>
                        <div className="shrink-0 text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-300">{t('tours.price')}</p>
                          <p className="text-4xl font-black leading-none text-white">{activity.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{activity.description}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                          <Clock className="h-3.5 w-3.5 text-yellow-500" />
                          {activity.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                          <Users className="h-3.5 w-3.5 text-yellow-500" />
                          {activity.capacity}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          {t('tours.whatIncludes')}
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {activity.highlights.map((highlight: string, highlightIndex: number) => (
                            <span
                              key={highlightIndex}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="mt-5 h-12 w-full rounded-full bg-blue-900 font-bold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                        onClick={() => handleReservation(activity.name, activity.price)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {t('tours.reserveRide')}
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Información General */}
      <section className="border-t border-slate-200/70 bg-white/60 py-14 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow={text.infoEyebrow} title={text.infoTitle} subtitle={text.infoSubtitle} />

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Precios y Descuentos */}
            <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                  <Euro className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-black tracking-tight">{t('tours.specialPrices.title')}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  t('tours.specialPrices.childrenFree'),
                  t('tours.specialPrices.childrenDiscount'),
                  t('tours.specialPrices.familyGroups'),
                  t('tours.specialPrices.earlyBooking'),
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Idiomas */}
            <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-300">
                  <Users className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-black tracking-tight">{t('tours.languages.title')}</h3>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { flag: "🇪🇸", label: t('tours.languages.spanish') },
                  { flag: "🇬🇧", label: t('tours.languages.english') },
                  { flag: "🇫🇷", label: t('tours.languages.french') },
                  { flag: "🇩🇪", label: t('tours.languages.german') },
                  { flag: "🇮🇹", label: t('tours.languages.italian') },
                ].map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Info Section */}
          <article className="mt-5 rounded-[2rem] border border-yellow-300/60 bg-white p-5 shadow-sm dark:border-yellow-400/20 dark:bg-slate-900/70 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-300">
                <Info className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-black tracking-tight">{t('tours.importantInfo.title')}</h3>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-yellow-500" />
                  {t('tours.importantInfo.includesTitle')}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {[
                    t('tours.importantInfo.includes.transport'),
                    t('tours.importantInfo.includes.guide'),
                    t('tours.importantInfo.includes.insurance'),
                    t('tours.importantInfo.includes.tickets'),
                    t('tours.importantInfo.includes.assistance'),
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {t('tours.importantInfo.recommendationsTitle')}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {[
                    t('tours.importantInfo.recommendations.shoes'),
                    t('tours.importantInfo.recommendations.sun'),
                    t('tours.importantInfo.recommendations.camera'),
                    t('tours.importantInfo.recommendations.docs'),
                    t('tours.importantInfo.recommendations.booking'),
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter
        tagline={text.footerTagline}
        rights={text.footerRights}
        contactLabel={t('header.contact')}
        backHomeLabel={text.backHome}
      />

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10"
              aria-label="Close"
            >
              ×
            </button>

            <div className="text-center">
              <h3 className="mb-4 text-2xl font-black text-orange-600">Rent a Quad</h3>

              <div className="mb-6">
                <Image
                  src="/rentwuad.png"
                  alt="Rent Quad Logo"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>

              <div className="mb-6 rounded-3xl bg-white p-4 shadow-lg">
                <Image
                  src="/rentqr.png"
                  alt="Rent a Quad QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>

              <Button
                onClick={() => window.open('https://quadaventuracostadelsol.com/actividades-de-aventura', '_blank')}
                className="h-12 w-full rounded-full bg-orange-600 px-6 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Acceder a Quad Aventura
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="tour"
        itemName={selectedItem.name}
        itemPrice={selectedItem.price}
      />
    </div>
  )
}
