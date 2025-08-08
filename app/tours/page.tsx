"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Users, MapPin, Calendar, Euro, Info, Menu, X, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { LanguageToggle } from '../../components/LanguageToggle'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ReservationModal } from '../../components/ReservationModal'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ToursPage() {
  const [activeTab, setActiveTab] = useState("excursiones")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{name: string, price?: string}>({name: ""})
  const { t } = useLanguage()

  const handleReservation = (itemName: string, itemPrice?: string) => {
    setSelectedItem({name: itemName, price: itemPrice})
    setIsModalOpen(true)
  }

  const horseRiding = [
    {
      name: "Paseos a Caballo",
      duration: "1.30 horas",
      capacity: "1 persona",
      price: "65€",
      description: "Disfruta de un relajante paseo a caballo por paisajes naturales únicos",
      image: "/lugares/paseocaballo.jpeg",
      highlights: ["Guía experto", "Caballo dócil", "Paisajes naturales", "Experiencia única"],
      emoji: "🐎",
    },
  ]

  const boatActivities = [
    {
      name: "Dolphin Trip (Paseo de los Delfines)",
      location: "Puerto Marina Benalmádena",
      priceAdult: "19€",
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
      price: "30€",
      description: "Compras libres de impuestos en Gibraltar con tiempo libre",
      image: "/destinos/gibraltarshoping.jpg",
      emoji: "🛍️",
      country: "Gibraltar",
    },
    {
      name: "Gibraltar Visit",
      days: ["Martes", "Miércoles", "Viernes", "Sábado"],
      price: "70€",
      description: "Visita completa a Gibraltar incluyendo el Peñón y los monos",
      image: "/destinos/gibraltarv.jpg",
      emoji: "🐒",
      country: "Gibraltar",
    },
    {
      name: "Granada Alhambra",
      days: ["Jueves", "Viernes"],
      price: "79€",
      description: "Visita a la majestuosa Alhambra y los jardines del Generalife",
      image: "/destinos/alhambragranada.png",
      emoji: "🏰",
      country: "España",
    },
    {
      name: "Sevilla",
      days: ["Miércoles"],
      price: "72€",
      description: "Descubre la capital andaluza: Catedral, Alcázar y barrio de Santa Cruz",
      image: "/destinos/sevilla.jpg",
      emoji: "🕌",
      country: "España",
    },
    {
      name: "Córdoba",
      days: ["Jueves"],
      price: "72€",
      description: "Mezquita-Catedral y el encantador barrio judío de Córdoba",
      image: "/destinos/cordoba.png",
      emoji: "🕌",
      country: "España",
    },
    {
      name: "Ronda",
      days: ["Martes", "Sábado"],
      price: "58€",
      description: "Pueblo blanco con impresionantes vistas y plaza de toros histórica",
      image: "/destinos/ronda.png",
      emoji: "🌉",
      country: "España",
    },
    {
      name: "Caminito del Rey",
      days: ["Martes", "Miércoles", "Jueves", "Viernes"],
      price: "59€",
      description: "Aventura por el sendero más espectacular de Andalucía",
      image: "/destinos/caminitodelrey.jpg",
      emoji: "🥾",
      country: "España",
    },
    {
      name: "Nerja y Frigiliana",
      days: ["Lunes"],
      price: "35€",
      description: "Pueblos blancos costeros con cuevas y vistas al Mediterráneo",
      image: "/destinos/nerjayfrig.jpg",
      emoji: "🏖️",
      country: "España",
    },
    {
      name: "Mijas Marbella Banús",
      days: ["Sábado"],
      price: "35€",
      description: "Ruta por la Costa del Sol: Mijas, Marbella y Puerto Banús",
      image: "/destinos/marbella.jpg",
      emoji: "🏖️",
      country: "España",
    },
    {
      name: "Tánger",
      days: ["Sábado"],
      price: "135€",
      description: "Excursión a Marruecos: medina, mercados y cultura bereber",
      image: "/destinos/tanger.jpg",
      emoji: "🕌",
      country: "Marruecos",
    },
  ]

  const getDayColor = (day: string) => {
    const colors: { [key: string]: string } = {
      Lunes: "bg-blue-100 text-blue-800",
      Martes: "bg-green-100 text-green-800",
      Miércoles: "bg-yellow-100 text-yellow-800",
      Jueves: "bg-purple-100 text-purple-800",
      Viernes: "bg-pink-100 text-pink-800",
      Sábado: "bg-orange-100 text-orange-800",
      Domingo: "bg-red-100 text-red-800",
    }
    return colors[day] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                {t('header.tours')}
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
                <span className="text-sm text-blue-900 font-medium">Rent a Quad</span>
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
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium border-l-4 border-blue-900 pl-2 animate-fadeInUp"
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
                <div className="flex items-center space-x-4 pt-4 border-t border-yellow-600 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Título y Subtítulo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t('tours.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {t('tours.subtitle')}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            {/* Desktop: Una fila */}
            <TabsList className="hidden sm:grid w-full grid-cols-3 h-16">
              <TabsTrigger value="excursiones" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🏛️</span>
                <span>{t('tours.excursions')}</span>
              </TabsTrigger>
              <TabsTrigger value="actividades-marinas" className="flex items-center space-x-2 py-4 px-6 text-lg">
                <span>🚢</span>
                <span>{t('tours.activities')}</span>
              </TabsTrigger>
              <TabsTrigger value="caballos" className="flex items-center space-x-2 py-4 px-6 text-lg relative">
                <span>🐎</span>
                <span>{t('tours.horseRiding')}</span>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 font-bold text-xs px-2 py-1 rounded-full border-2 border-yellow-500 shadow-lg transform rotate-12">
                  HOT!
                </div>
              </TabsTrigger>
            </TabsList>
            
            {/* Mobile: Dos filas */}
            <div className="sm:hidden">
              <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
                <TabsTrigger value="excursiones" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                  <span>🏛️</span>
                  <span>{t('tours.excursions')}</span>
                </TabsTrigger>
                <TabsTrigger value="actividades-marinas" className="flex items-center justify-center space-x-2 h-full px-3 text-sm">
                  <span>🚢</span>
                  <span>{t('tours.activities')}</span>
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-1 bg-gray-100 h-12">
                <TabsTrigger value="caballos" className="flex items-center justify-center space-x-2 h-full px-3 text-sm relative">
                  <span>🐎</span>
                  <span>{t('tours.horseRiding')}</span>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 font-bold text-xs px-1.5 py-0.5 rounded-full border-2 border-yellow-500 shadow-lg transform rotate-12">
                    HOT!
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Excursiones Tab */}
          <TabsContent value="excursiones">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {excursions.map((excursion, index) => (
                <Card key={index} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                  excursion.name === "Granada Alhambra" || excursion.name === "Sevilla" || excursion.name === "Caminito del Rey" 
                    ? "bg-gradient-to-br from-yellow-400 via-yellow-300 to-blue-400 border-2 border-yellow-500 shadow-xl" 
                    : ""
                }`}>
                  <div className="aspect-video relative">
                    <Image
                      src={excursion.image || "/placeholder.svg"}
                      alt={excursion.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">{excursion.emoji}</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-blue-900 font-bold text-lg px-3 py-1">{excursion.price}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className={`text-2xl flex-1 ${
                        excursion.name === "Granada Alhambra" || excursion.name === "Sevilla" || excursion.name === "Caminito del Rey" 
                          ? "text-blue-900 font-bold" 
                          : "text-gray-900"
                      }`}>{excursion.name}</CardTitle>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {excursion.country}
                      </Badge>
                    </div>
                    <CardDescription className={`${
                      excursion.name === "Granada Alhambra" || excursion.name === "Sevilla" || excursion.name === "Caminito del Rey" 
                        ? "text-blue-800 font-medium" 
                        : ""
                    }`}>{excursion.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Days */}
                    <div className="mb-4">
                      <h4 className={`font-semibold mb-2 ${
                        excursion.name === "Granada Alhambra" || excursion.name === "Sevilla" || excursion.name === "Caminito del Rey" 
                          ? "text-blue-900" 
                          : "text-gray-900"
                      }`}>Días disponibles:</h4>
                      <div className="flex flex-wrap gap-2">
                        {excursion.days.map((day, dayIndex) => (
                          <Badge key={dayIndex} className={`text-sm font-semibold px-3 py-1 ${getDayColor(day)}`}>
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleReservation(excursion.name, excursion.price)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Reservar Excursión
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Actividades Marinas Tab */}
          <TabsContent value="actividades-marinas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {boatActivities.map((activity, index) => (
                <Card key={index} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                  activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" 
                    ? "bg-gradient-to-br from-yellow-400 via-yellow-300 to-blue-400 border-2 border-yellow-500 shadow-xl" 
                    : ""
                }`}>
                  <div className="aspect-video relative">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">{activity.emoji}</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      {activity.priceAdult ? (
                        <div className="space-y-2">
                          <Badge className="bg-yellow-500 text-blue-900 font-bold block text-sm px-3 py-1">
                            Adultos: {activity.priceAdult}
                          </Badge>
                          <Badge className="bg-green-500 text-white font-bold block text-sm px-3 py-1">
                            Niños: {activity.priceChild}
                          </Badge>
                        </div>
                      ) : (
                        <Badge className="bg-gray-500 text-white font-bold text-sm px-3 py-1">Consultar</Badge>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className={`text-2xl ${
                      activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" 
                        ? "text-blue-900 font-bold" 
                        : "text-gray-900"
                    }`}>{activity.name}</CardTitle>
                    <CardDescription className={activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" ? "text-blue-800 font-medium" : ""}>{activity.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Location */}
                    <div className="mb-4">
                      <div className={`flex items-center space-x-2 text-sm ${
                        activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" 
                          ? "text-blue-800" 
                          : "text-gray-600"
                      }`}>
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <h4 className={`font-semibold mb-2 ${
                        activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" 
                          ? "text-blue-900" 
                          : "text-gray-900"
                      }`}>Incluye:</h4>
                      <ul className="space-y-1">
                        {activity.highlights.map((highlight, highlightIndex) => (
                          <li key={highlightIndex} className={`text-sm flex items-center ${
                            activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" 
                              ? "text-blue-800" 
                              : "text-gray-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              activity.name === "Alquiler de Embarcaciones Pequeñas sin Carnet" 
                                ? "bg-blue-600" 
                                : "bg-yellow-500"
                            }`}></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleReservation(activity.name, activity.priceAdult || activity.price)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {activity.price === "Consultar precio" ? "Consultar Disponibilidad" : "Reservar Actividad"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Caballos Tab */}
          <TabsContent value="caballos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horseRiding.map((activity, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <Image
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">{activity.emoji}</div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-blue-900 font-bold text-lg px-3 py-1">{activity.price}</Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900">{activity.name}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{activity.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{activity.capacity}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Incluye:</h4>
                      <ul className="space-y-1">
                        {activity.highlights.map((highlight, highlightIndex) => (
                          <li key={highlightIndex} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleReservation(activity.name, activity.price)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Reservar Paseo
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Precios y Descuentos */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Euro className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-900">Precios Especiales</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-green-800">
                <li>
                  • <strong>Niños (0-3 años):</strong> ¡GRATIS!
                </li>
                <li>
                  • <strong>Niños (4-11 años):</strong> 25% de descuento
                </li>
                <li>• Grupos familiares: Consulta descuentos especiales</li>
                <li>• Reserva anticipada: Mejores precios garantizados</li>
              </ul>
            </CardContent>
          </Card>

          {/* Idiomas */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Idiomas Disponibles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🇪🇸</span>
                  <span className="text-blue-800">Español</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🇬🇧</span>
                  <span className="text-blue-800">Inglés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🇫🇷</span>
                  <span className="text-blue-800">Francés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🇩🇪</span>
                  <span className="text-blue-800">Alemán</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🇮🇹</span>
                  <span className="text-blue-800">Italiano</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-900">Información Importante</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-900 mb-3">¿Qué incluye?</h4>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Transporte en autocar climatizado</li>
                  <li>• Guía oficial certificado</li>
                  <li>• Seguro de viaje</li>
                  <li>• Entradas a monumentos (según tour)</li>
                  <li>• Asistencia durante todo el recorrido</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-900 mb-3">Recomendaciones</h4>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Calzado cómodo para caminar</li>
                  <li>• Protector solar y gorra</li>
                  <li>• Cámara fotográfica</li>
                  <li>• Documentación personal</li>
                  <li>• Reserva con 48h de antelación</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                   <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
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
