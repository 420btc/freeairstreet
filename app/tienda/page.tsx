'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  Check,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { RepairQuoteModal } from '@/components/RepairQuoteModal'
import { PageHero } from '@/components/site/PageHero'
import { SectionHeading } from '@/components/site/SectionHeading'
import { SiteFooter } from '@/components/site/SiteFooter'

const HERO_IMAGE = '/reparacion.jpg'

const translations = {
  es: {
    title: 'Tienda y Servicios',
    subtitle: 'Productos y servicios de reparación para todos tus vehículos',
    heroBadge: 'Tienda y taller · La Colina, Torremolinos',
    heroCtaPrimary: 'Ver servicios',
    heroCtaSecondary: 'Hablar por WhatsApp',
    statServices: '4 servicios',
    statServicesLabel: 'scooter, bici, moto y fat bike',
    statChecks: '16 revisiones',
    statChecksLabel: 'según tu vehículo',
    statShop: 'La Colina',
    statShopLabel: 'tienda física en Torremolinos',
    statQuote: 'Presupuesto',
    statQuoteLabel: 'te lo enviamos por email',
    repairEyebrow: 'Taller propio',
    storeEyebrow: 'Próximamente',
    store: {
      title: 'Tienda',
      subtitle: 'Productos y accesorios para tus aventuras',
      comingSoon: 'Próximamente disponible',
      preparingMessage: 'Estamos preparando una selección especial de productos y accesorios para ti.'
    },
    repair: {
      title: 'Servicio Reparación',
      subtitle: 'Servicios profesionales de mantenimiento y reparación',
      scooters: {
        title: 'Reparación Scooters Eléctricos',
        description: 'Mantenimiento y reparación especializada para scooters eléctricos',
        services: ['Revisión de batería', 'Cambio de neumáticos', 'Ajuste de frenos', 'Diagnóstico eléctrico']
      },
      bicycles: {
        title: 'Reparación Bicicletas',
        description: 'Servicio completo de mantenimiento para todo tipo de bicicletas',
        services: ['Ajuste de cambios', 'Reparación de cadena', 'Cambio de pastillas', 'Puesta a punto general']
      },
      motorcycles: {
        title: 'Reparación Motos Eléctricas',
        description: 'Especialistas en mantenimiento de motocicletas eléctricas',
        services: ['Revisión sistema eléctrico', 'Cambio de componentes', 'Actualización firmware', 'Mantenimiento preventivo']
      },
      fatbikes: {
        title: 'Reparación Fat Bikes',
        description: 'Servicio especializado para bicicletas de neumáticos anchos',
        services: ['Ajuste suspensión', 'Cambio neumáticos especiales', 'Mantenimiento transmisión', 'Revisión completa']
      }
    },
    contact: 'Contactar para presupuesto',
    backHome: 'Volver al inicio'
  },
  en: {
    title: 'Store & Services',
    subtitle: 'Products and repair services for all your vehicles',
    heroBadge: 'Shop & workshop · La Colina, Torremolinos',
    heroCtaPrimary: 'View services',
    heroCtaSecondary: 'Chat on WhatsApp',
    statServices: '4 services',
    statServicesLabel: 'scooter, bike, moto and fat bike',
    statChecks: '16 checks',
    statChecksLabel: 'depending on your vehicle',
    statShop: 'La Colina',
    statShopLabel: 'physical shop in Torremolinos',
    statQuote: 'Quote',
    statQuoteLabel: 'sent to you by email',
    repairEyebrow: 'In-house workshop',
    storeEyebrow: 'Coming soon',
    store: {
      title: 'Store',
      subtitle: 'Products and accessories for your adventures',
      comingSoon: 'Coming Soon',
      preparingMessage: 'We are preparing a special selection of products and accessories for you.'
    },
    repair: {
      title: 'Repair Service',
      subtitle: 'Professional maintenance and repair services',
      scooters: {
        title: 'Electric Scooter Repair',
        description: 'Specialized maintenance and repair for electric scooters',
        services: ['Battery check', 'Tire replacement', 'Brake adjustment', 'Electrical diagnosis']
      },
      bicycles: {
        title: 'Bicycle Repair',
        description: 'Complete maintenance service for all types of bicycles',
        services: ['Gear adjustment', 'Chain repair', 'Brake pad replacement', 'General tune-up']
      },
      motorcycles: {
        title: 'Electric Motorcycle Repair',
        description: 'Specialists in electric motorcycle maintenance',
        services: ['Electrical system check', 'Component replacement', 'Firmware update', 'Preventive maintenance']
      },
      fatbikes: {
        title: 'Fat Bike Repair',
        description: 'Specialized service for wide-tire bicycles',
        services: ['Suspension adjustment', 'Special tire replacement', 'Transmission maintenance', 'Complete inspection']
      }
    },
    contact: 'Contact for quote',
    backHome: 'Back to home'
  }
}

export default function TiendaPage() {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('repair')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false)
  const [selectedRepairService, setSelectedRepairService] = useState({ type: '', title: '' })
  const currentTranslations = translations[language as keyof typeof translations] || translations.es

  const handleRepairQuoteRequest = (serviceId: string, serviceTitle: string) => {
    setSelectedRepairService({ type: serviceId, title: serviceTitle })
    setIsRepairModalOpen(true)
  }

  const repairServices = [
    {
      id: 'scooters',
      icon: <Zap className="w-8 h-8" />,
      data: currentTranslations.repair.scooters,
      image: '/reparacion.jpg'
    },
    {
      id: 'bicycles',
      icon: <Bike className="w-8 h-8" />,
      data: currentTranslations.repair.bicycles,
      image: '/urban-bicycle.png'
    },
    {
      id: 'motorcycles',
      icon: <Car className="w-8 h-8" />,
      data: currentTranslations.repair.motorcycles,
      image: '/motos/motobike.jpeg'
    },
    {
      id: 'fatbikes',
      icon: <Bike className="w-8 h-8" />,
      data: currentTranslations.repair.fatbikes,
      image: '/fat-bike-electric-wide-tires.png'
    }
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const titleWords = currentTranslations.title.split(' ')
  const titleHighlight = titleWords.pop()
  const titleStart = titleWords.join(' ')

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
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.tours')}
              </Link>
              <Link href="/rutas" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.routes')}
              </Link>
              <Link href="/tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                {t('header.shop')}
              </Link>
              <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.contact')}
              </Link>
            </nav>

            {/* Page Title for Mobile - Centered */}
            <div className="md:hidden flex-1 text-center">
              <h1 className="text-lg font-bold text-blue-900 navbar-title">{t('header.shop')}</h1>
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
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
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
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp border-l-4 border-blue-900 pl-2"
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
                <button 
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-left text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp flex items-center space-x-2"
                  style={{ animationDelay: '0.6s' }}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="animate-typewriter" style={{ animationDelay: '0.6s' }}>Rent a Quad</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <PageHero
        badge={
          <>
            <Wrench className="h-4 w-4" />
            {currentTranslations.heroBadge}
          </>
        }
        title={
          <>
            {titleStart}{' '}
            <span className="relative inline-block text-yellow-300">
              {titleHighlight}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 14" fill="none" aria-hidden="true">
                <path d="M3 10C70 3 160 2 297 7" stroke="#facc15" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
              </svg>
            </span>
          </>
        }
        subtitle={currentTranslations.subtitle}
        image={HERO_IMAGE}
        imageAlt={currentTranslations.title}
        actions={
          <>
            <Button
              onClick={() => scrollTo('servicios')}
              className="h-14 rounded-full bg-yellow-400 px-8 text-base font-bold text-blue-950 shadow-xl shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              <Wrench className="mr-2 h-5 w-5" />
              {currentTranslations.heroCtaPrimary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="https://wa.me/34655707412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              <MessageCircle className="h-5 w-5" />
              {currentTranslations.heroCtaSecondary}
            </a>
          </>
        }
        stats={[
          { icon: <Wrench className="h-5 w-5" />, value: currentTranslations.statServices, label: currentTranslations.statServicesLabel },
          { icon: <ShieldCheck className="h-5 w-5" />, value: currentTranslations.statChecks, label: currentTranslations.statChecksLabel },
          { icon: <MapPin className="h-5 w-5" />, value: currentTranslations.statShop, label: currentTranslations.statShopLabel },
          { icon: <Sparkles className="h-5 w-5" />, value: currentTranslations.statQuote, label: currentTranslations.statQuoteLabel },
        ]}
      />

      {/* Main Content */}
      <section id="servicios" className="container mx-auto scroll-mt-24 px-4 py-14 md:py-20">
        {/* Tabs */}
        <div className="mb-10 flex justify-center md:mb-14">
          <div className="inline-flex w-full max-w-md gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <button
              onClick={() => setActiveTab('repair')}
              className={`flex min-h-12 flex-1 basis-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-xs font-bold leading-tight transition-all sm:px-4 sm:text-sm ${
                activeTab === 'repair'
                  ? 'bg-yellow-400 text-blue-950 shadow-lg shadow-yellow-400/30'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              <span>🔧 {currentTranslations.repair.title}</span>
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`flex min-h-12 flex-1 basis-0 items-center justify-center gap-2 rounded-full px-3 py-2 text-center text-xs font-bold leading-tight transition-all sm:px-4 sm:text-sm ${
                activeTab === 'store'
                  ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/25 dark:bg-yellow-400 dark:text-blue-950'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
              }`}
            >
              <span>🏪 {currentTranslations.store.title}</span>
            </button>
          </div>
        </div>

        {/* Store */}
        {activeTab === 'store' && (
          <div>
            <SectionHeading
              eyebrow={currentTranslations.storeEyebrow}
              title={currentTranslations.store.title}
              subtitle={currentTranslations.store.subtitle}
            />

            <div className="mx-auto mt-10 max-w-2xl">
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-12">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-900 text-4xl shadow-lg shadow-blue-900/20 dark:bg-yellow-400">
                  <span aria-hidden="true">🏪</span>
                </div>
                <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {currentTranslations.store.comingSoon}
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  {currentTranslations.store.preparingMessage || 'Estamos preparando una selección especial de productos y accesorios para ti.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Repair */}
        {activeTab === 'repair' && (
          <div>
            <SectionHeading
              eyebrow={currentTranslations.repairEyebrow}
              title={currentTranslations.repair.title}
              subtitle={currentTranslations.repair.subtitle}
            />

            <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2">
              {repairServices.map((service) => (
                <article
                  key={service.id}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-800">
                    <Image
                      src={service.image}
                      alt={service.data.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                    <span className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-yellow-300 backdrop-blur-md">
                      {service.icon}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                      {service.data.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {service.data.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.data.services.map((serviceItem, serviceIndex) => (
                        <span
                          key={serviceIndex}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                          <Check className="h-3 w-3 text-yellow-500" strokeWidth={3} />
                          {serviceItem}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <Button
                        onClick={() => handleRepairQuoteRequest(service.id, service.data.title)}
                        className="h-12 w-full rounded-full bg-blue-900 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                      >
                        {currentTranslations.contact}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white via-blue-50 to-yellow-50 rounded-lg p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Rent a Quad</h3>
              
              <div className="mb-6">
                <Image
                  src="/rentwuad.png"
                  alt="Rent Quad Logo"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
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
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Acceder a Quad Aventura
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Quote Modal */}
      <RepairQuoteModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        repairType={selectedRepairService.type}
        repairTitle={selectedRepairService.title}
      />

      {/* Footer */}
      <SiteFooter
        tagline="Rent & Tours"
        contactLabel={t('header.contact')}
        backHomeLabel={currentTranslations.backHome}
      />
    </div>
  )
}
