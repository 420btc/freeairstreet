'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, Mail, MapPin, QrCode, Clock, Users, Car, Bike, Zap, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { RepairQuoteModal } from '@/components/RepairQuoteModal'


const translations = {
  es: {
    title: 'Tienda y Servicios',
    subtitle: 'Productos y servicios de reparación para todos tus vehículos',
    store: {
      title: 'Tienda',
      subtitle: 'Productos y accesorios para tus aventuras',
      comingSoon: 'Próximamente disponible'
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
    contact: 'Contactar para presupuesto'
  },
  en: {
    title: 'Store & Services',
    subtitle: 'Products and repair services for all your vehicles',
    store: {
      title: 'Store',
      subtitle: 'Products and accessories for your adventures',
      comingSoon: 'Coming Soon'
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
    contact: 'Contact for quote'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
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
            <nav className="hidden md:flex space-x-8 flex-1 justify-center">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.rental')}
              </Link>
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.tours')}
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
              <h1 className="text-lg font-bold text-blue-900 navbar-title">Tienda</h1>
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
                <ThemeToggle />
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
                  href="/tienda" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>{t('header.shop')}</span>
                </Link>
                <Link 
                  href="/contacto" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>{t('header.contact')}</span>
                </Link>
                <button 
                  onClick={() => setIsQrModalOpen(true)}
                  className="text-left text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp flex items-center space-x-2"
                  style={{ animationDelay: '0.5s' }}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="animate-typewriter" style={{ animationDelay: '0.5s' }}>Rent a Quad</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Título y Subtítulo */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {currentTranslations.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              {currentTranslations.subtitle}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('repair')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'repair'
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🔧 {currentTranslations.repair.title}</span>
              </button>
              <button
                onClick={() => setActiveTab('store')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'store'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>🏪 {currentTranslations.store.title}</span>
              </button>
            </div>
          </div>

          {/* Content Sections */}
          {activeTab === 'store' && (
            <div className="text-center">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {currentTranslations.store.title}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {currentTranslations.store.subtitle}
                </p>
                <Card className="p-12 bg-gradient-to-br from-yellow-400 to-yellow-500">
                  <CardContent className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-white">🏪</span>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      {currentTranslations.store.comingSoon}
                    </h3>
                    <p className="text-blue-800">
                      Estamos preparando una selección especial de productos y accesorios para ti.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'repair' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {currentTranslations.repair.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {currentTranslations.repair.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {repairServices.map((service, index) => (
                  <Card 
                    key={service.id} 
                    className={`overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${
                      index % 2 === 0 
                        ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100' 
                        : 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100'
                    }`}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={service.image}
                        alt={service.data.title}
                        fill
                        className="object-cover"
                      />
                      <div className={`absolute top-4 right-4 p-2 rounded-full ${
                        index % 2 === 0 ? 'bg-blue-600' : 'bg-yellow-500'
                      } text-white`}>
                        {service.icon}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className={`text-xl ${
                        index % 2 === 0 ? 'text-blue-800' : 'text-yellow-800'
                      }`}>
                        {service.data.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {service.data.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-6">
                        {service.data.services.map((serviceItem, serviceIndex) => (
                          <Badge 
                            key={serviceIndex} 
                            variant="secondary" 
                            className={`mr-2 mb-2 ${
                              index % 2 === 0 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            {serviceItem}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        onClick={() => handleRepairQuoteRequest(service.id, service.data.title)}
                        className={`w-full ${
                          index % 2 === 0 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        } text-white`}
                      >
                        {currentTranslations.contact}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
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
      <footer className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
               <div className="flex items-center space-x-3">
                 <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={60} height={60} className="rounded" />
                 <div>
                   <h3 className="font-bold birthstone-regular">Free Air Street</h3>
                   <p className="text-sm text-gray-700">Rent & Tours</p>
                 </div>
               </div>
               
               {/* Instagram Link */}
               <a
                 href="https://www.instagram.com/freeairstreet?igsh=d25kaDRkM3QwNGJ6"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                 </svg>
                 <span className="font-semibold">freeairstreet</span>
               </a>
               
               {/* WhatsApp Link */}
               <a
                 href="https://wa.me/34655707412"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
               >
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                 </svg>
               </a>
             </div>

            <div className="text-center md:text-right">
              <p className="text-gray-700">© 2025 Free Air Street. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}