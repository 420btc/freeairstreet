"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone, Mail, MapPin, QrCode, Clock, Users, Car, Bike, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageToggle } from '../components/LanguageToggle'
import { ThemeToggle } from '../components/ThemeToggle'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw'

    // Initialize map
    const map = new mapboxgl.Map({
      container: 'mapbox-container',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [0, 0], // Start with global view
      zoom: 1,
      projection: 'globe'
    })

    map.on('load', () => {
      // Add atmosphere for globe effect
      map.setFog({
        'color': 'rgb(186, 210, 235)',
        'high-color': 'rgb(36, 92, 223)',
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.6
      })

      // Wait a moment then animate to location
       setTimeout(() => {
         map.flyTo({
           center: [-4.489167162077166, 36.63222134109576], // Exact coordinates
           zoom: 19,
           duration: 3000,
           essential: true
         })

        // Add custom scooter marker after animation
         setTimeout(() => {
           // Create custom marker element
           const markerElement = document.createElement('div')
           markerElement.innerHTML = '🛴'
           markerElement.style.fontSize = '12px'
           markerElement.style.backgroundColor = '#fbbf24'
           markerElement.style.borderRadius = '50%'
           markerElement.style.padding = '4px'
           markerElement.style.border = '1px solid #f59e0b'
           markerElement.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'

           new mapboxgl.Marker(markerElement)
             .setLngLat([-4.489167162077166, 36.63222134109576])
             .addTo(map)
         }, 3200)
      }, 1000)
    })

    // Cleanup
    return () => map.remove()
  }, [])

  const services = [
    {
      title: t('services.bikeRental'),
      description: t('services.bikeDescription'),
      icon: <Bike className="h-8 w-8" />,
      href: "/alquiler?tab=bicicletas",
    },
    {
      title: t('services.guidedTours'),
      description: t('services.toursDescription'),
      icon: <Users className="h-8 w-8" />,
      href: "/tours",
    },
    {
      title: t('services.carRental'),
      description: t('services.carDescription'),
      icon: <Car className="h-8 w-8" />,
      href: "/alquiler?tab=coches",
    },
    {
      title: t('services.motosScooters'),
      description: t('services.motosDescription'),
      icon: <Zap className="h-8 w-8" />,
      href: "/alquiler?tab=scooters",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center leading-3 font-mono italic tracking-tighter space-x-12">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-blue-900 birthstone-regular">Free Air Street</h1>
                <p className="text-sm text-blue-800">Rent & Tours</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                {t('header.rental')}
              </Link>
              <Link href="/tours" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                {t('header.tours')}
              </Link>
              <a href="#tienda" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                {t('header.shop')}
              </a>
              <Link href="/contacto" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                {t('header.contact')}
              </Link>
            </nav>

            {/* QR Code, Language Toggle and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <QrCode className="h-5 w-5 text-blue-900" />
                <span className="text-sm text-blue-900 font-medium">{t('header.scanPrices')}</span>
              </div>

              {/* Language Toggle and Theme Toggle */}
              <div className="flex items-center space-x-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              <button className="md:hidden text-blue-900 dark:text-blue-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-yellow-600">
              <nav className="flex flex-col space-y-4">
                <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 font-medium">
                  {t('header.rental')}
                </Link>
                <Link href="/tours" className="text-blue-900 hover:text-blue-700 font-medium">
                  {t('header.tours')}
                </Link>
                <a href="#tienda" className="text-blue-900 hover:text-blue-700 font-medium">
                  {t('header.shop')}
                </a>
                <Link href="/contacto" className="text-blue-900 hover:text-blue-700 font-medium">
                  {t('header.contact')}
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero.png" 
            alt="Hero background" 
            fill 
            className="object-cover" 
            style={{ filter: 'blur(1px)' }}
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t('hero.title')}</h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/alquiler">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                {t('hero.viewRentals')}
              </Button>
            </Link>
            <Link href="/tours">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
              >
                {t('hero.bookTour')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('services.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} href={service.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full text-blue-600 group-hover:bg-yellow-200 transition-colors">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Are Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('location.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('location.description')}
            </p>
          </div>
          
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
            <div id="mapbox-container" className="w-full h-full"></div>
          </div>
          
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Location Info */}
              <div className="bg-gray-50 rounded-lg p-8 shadow-lg border">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  {t('location.ourLocation')}
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <span className="font-semibold text-gray-900 min-w-0 flex-1">
                      {t('location.address')}<br/>
                      {t('location.city')}<br/>
                      {t('location.country')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 rounded-lg p-8 shadow-lg border">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                   <Phone className="h-6 w-6 mr-2 text-blue-600" />
                   {t('contact.title')}
                 </h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">{t('location.phone')}</p>
                      <p className="text-sm text-gray-600">{t('location.hours')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-blue-600 flex-shrink-0" />
                    <div>
                       <p className="font-semibold text-gray-900">{t('location.email')}</p>
                       <p className="text-sm text-gray-600">{t('contact.emailResponse')}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Prices Section */}
      <section className="py-16 bg-yellow-400">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{t('prices.title')}</h2>
            <p className="text-lg text-blue-800">{t('prices.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-blue-900">{t('prices.cityBike')}</CardTitle>
                <CardDescription>{t('prices.cityBikeDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('prices.hour')}</span>
                    <Badge variant="secondary">3€</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('prices.allDay')}</span>
                    <Badge className="bg-yellow-500 text-blue-900">13€</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-blue-900">{t('prices.electricBike')}</CardTitle>
                <CardDescription>{t('prices.electricBikeDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('prices.hour')}</span>
                    <Badge variant="secondary">10€</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('prices.allDay')}</span>
                    <Badge className="bg-yellow-500 text-blue-900">35€</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-blue-900">{t('prices.traditionalScooter')}</CardTitle>
                <CardDescription>{t('prices.traditionalScooterDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('prices.halfHour')}</span>
                    <Badge variant="secondary">10€</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('prices.hour')}</span>
                    <Badge className="bg-yellow-500 text-blue-900">15€</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section id="tours-destacados" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('tours.title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('tours.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🐬</span>
                    {t('tours.dolphinTrip')}
                  </CardTitle>
                  <div className="text-right">
                    <Badge className="bg-yellow-500 text-blue-900 font-bold">19€</Badge>
                    <p className="text-xs text-gray-500 mt-1">{t('tours.adults')}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">Marina Benalmádena</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('tours.dolphinDesc')}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.children')}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.familyExperience')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏰</span>
                    {t('tours.granadaAlhambra')}
                  </CardTitle>
                  <Badge className="bg-yellow-500 text-blue-900 font-bold">79€</Badge>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{t('tours.thursdayFriday')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{t('tours.granadaDesc')}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.unescoHeritage')}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.officialGuide')}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🐎</span>
                    {t('tours.horseRiding')}
                  </CardTitle>
                  <Badge className="bg-yellow-500 text-blue-900 font-bold">65€</Badge>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{t('tours.duration')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('tours.horseDesc')}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>{t('tours.onePersonPerHorse')}
                  </div>
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></span>
                    {t('tours.expertGuide')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/tours">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                {t('tours.viewAllTours')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('contact.title')}</h2>
            <p className="text-lg text-blue-100">{t('contact.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <Phone className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.phone')}</h3>
              <p className="text-blue-100">655 707 412</p>
              <p className="text-blue-200 text-sm mt-1">{t('contact.phoneHours')}</p>
            </div>

            <div className="text-white">
              <Mail className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.email')}</h3>
              <p className="text-blue-100">info@freeairstreet-rentbike.com</p>
              <p className="text-blue-200 text-sm mt-1">{t('contact.emailResponse')}</p>
            </div>

            <div className="text-white">
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('contact.location')}</h3>
              <p className="text-blue-100">{t('location.address')}</p>
              <p className="text-blue-200 text-sm mt-1">{t('location.city')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image src="/logo.png" alt="Free Air Street Logo" width={40} height={40} className="rounded-full" />
              <div>
                <h3 className="font-bold birthstone-regular">Free Air Street</h3>
                <p className="text-sm text-gray-400">Rent & Tours</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400">{t('footer.rights')}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
