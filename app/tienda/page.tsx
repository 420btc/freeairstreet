'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, Mail, MapPin, QrCode, Clock, Users, Car, Bike, Zap } from 'lucide-react'
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
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center justify-center sm:justify-start leading-3 font-mono italic tracking-tighter space-x-4 sm:space-x-12">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-bold text-blue-900 navbar-title birthstone-regular leading-tight">Free Air Street</h1>
                <p className="hidden sm:block text-2xl text-blue-800 navbar-subtitle birthstone-regular -mt-3">Rent & Tours</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.rental')}
              </Link>
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.tours')}
              </Link>
              <Link href="/tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.shop')}
              </Link>
              <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                {t('header.contact')}
              </Link>
            </nav>

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
                <Card className="p-12 bg-gradient-to-br from-blue-100 to-yellow-100">
                  <CardContent className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-4xl text-white">🏪</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {currentTranslations.store.comingSoon}
                    </h3>
                    <p className="text-gray-600">
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
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
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

      {/* Repair Quote Modal */}
      <RepairQuoteModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        repairType={selectedRepairService.type}
        repairTitle={selectedRepairService.title}
      />
    </div>
  )
}