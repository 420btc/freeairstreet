"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Users, MapPin, Calendar, Euro, Info, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { LanguageToggle } from '../../components/LanguageToggle'
import { ThemeToggle } from '../../components/ThemeToggle'

export default function ToursPage() {
  const [activeTab, setActiveTab] = useState("excursiones")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <Button variant="ghost" size="lg" className="text-blue-900 hover:text-blue-700 p-4">
                <ArrowLeft className="h-12 w-12" />
              </Button>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex space-x-8 flex-1 justify-center">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                Alquiler
              </Link>
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 font-medium transition-colors border-b-2 border-blue-900">
                Visitas Guiadas
              </Link>
              <a href="/#tienda" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                Tienda
              </a>
              <Link href="/contacto" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                Contacto
              </Link>
            </nav>

            {/* Page Title for Mobile - Centered */}
            <div className="md:hidden flex-1 text-center">
              <h1 className="text-lg font-bold text-blue-900">Visitas Guiadas</h1>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-blue-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-yellow-600">
              <nav className="flex flex-col space-y-4">
                <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 font-medium">
                  Alquiler
                </Link>
                <Link href="/tours" className="text-blue-900 hover:text-blue-700 font-medium border-l-4 border-blue-900 pl-2">
                  Visitas Guiadas
                </Link>
                <a href="/#tienda" className="text-blue-900 hover:text-blue-700 font-medium">
                  Tienda
                </a>
                <Link href="/contacto" className="text-blue-900 hover:text-blue-700 font-medium">
                  Contacto
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-yellow-600">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Descubre Lugares Increíbles</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Desde paseos a caballo hasta excursiones culturales, tenemos la experiencia perfecta para ti. Guías expertos
            y aventuras inolvidables te esperan.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="excursiones" className="flex items-center space-x-2">
              <span>🏛️</span>
              <span>Excursiones</span>
            </TabsTrigger>
            <TabsTrigger value="actividades-marinas" className="flex items-center space-x-2">
              <span>🚢</span>
              <span>Actividades Marinas</span>
            </TabsTrigger>
            <TabsTrigger value="caballos" className="flex items-center space-x-2">
              <span>🐎</span>
              <span>Paseos a Caballo</span>
            </TabsTrigger>
          </TabsList>

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

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
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

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
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

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
    </div>
  )
}
