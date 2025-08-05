"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, CheckCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import mapboxgl from "mapbox-gl"
import { LanguageToggle } from '../../components/LanguageToggle'
import { ThemeToggle } from '../../components/ThemeToggle'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiNDIwYnRjIiwiYSI6ImNtOTN3ejBhdzByNjgycHF6dnVmeHl2ZTUifQ.Utq_q5wN6DHwpkn6rcpZdw'

    const map = new mapboxgl.Map({
      container: 'contact-mapbox-container',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-4.489167162077166, 36.63222134109576],
      zoom: 17
    })

    // Add custom marker
    const markerElement = document.createElement('div')
    markerElement.innerHTML = '🛴'
    markerElement.style.fontSize = '20px'
    markerElement.style.backgroundColor = '#fbbf24'
    markerElement.style.borderRadius = '50%'
    markerElement.style.padding = '8px'
    markerElement.style.border = '2px solid #f59e0b'
    markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'

    new mapboxgl.Marker(markerElement)
      .setLngLat([-4.489167162077166, 36.63222134109576])
      .addTo(map)

    return () => map.remove()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Aquí integrarías EmailJS
    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_PUBLIC_KEY')

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Teléfono",
      info: "655 707 412",
      description: "Llámanos de 9:00 a 20:00",
      href: "tel:+34655707412",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      info: "info@freeairstreet-rentbike.com",
      description: "Respuesta en 24h",
      href: "mailto:info@freeairstreet-rentbike.com",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Ubicación",
      info: "Calle de la Playa, 22",
      description: "29620 - Torremolinos",
      href: "https://maps.google.com/?q=Calle+de+la+Playa+22+Torremolinos",
    },
  ]

  const businessHours = [
    { day: "Lunes - Domingo", hours: "9:00 - 20:00" },
    { day: "Festivos", hours: "10:00 - 19:00" },
  ]

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
               <Link href="/tours" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                 Visitas Guiadas
               </Link>
               <a href="/#tienda" className="text-blue-900 hover:text-blue-700 font-medium transition-colors">
                 Tienda
               </a>
               <Link href="/contacto" className="text-blue-900 hover:text-blue-700 font-medium transition-colors border-b-2 border-blue-900">
                 Contacto
               </Link>
             </nav>

             {/* Page Title for Mobile - Centered */}
             <div className="md:hidden flex-1 text-center">
               <h1 className="text-lg font-bold text-blue-900 navbar-title">Contacto</h1>
             </div>

             {/* Desktop Controls */}
             <div className="hidden md:flex items-center space-x-2">
               <LanguageToggle />
               <ThemeToggle />
             </div>

             {/* Mobile Menu Button */}
             <button className="md:hidden text-blue-900 navbar-mobile-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X className="h-6 w-6 navbar-mobile-icon" /> : <Menu className="h-6 w-6 navbar-mobile-icon" />}
             </button>
           </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-yellow-600">
              <nav className="flex flex-col space-y-4">
                <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium">
                  Alquiler
                </Link>
                <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium">
                  Visitas Guiadas
                </Link>
                <a href="/#tienda" className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium">
                  Tienda
                </a>
                <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium border-l-4 border-blue-900 pl-2">
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¡Hablemos!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestros servicios? ¿Necesitas ayuda con tu reserva? Estamos aquí para
            ayudarte en tu próxima aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Envíanos un mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y te responderemos lo antes posible. Todos los campos son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-600 mb-4">
                    Gracias por contactarnos. Te responderemos en las próximas 24 horas.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} className="bg-blue-600 hover:bg-blue-700">
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="+34 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="mt-1 min-h-[120px]"
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-4">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-100 rounded-full text-blue-600">{contact.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                        <a
                          href={contact.href}
                          className="text-blue-600 hover:text-blue-700 font-medium block mb-1"
                          target={contact.href.startsWith("http") ? "_blank" : undefined}
                          rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {contact.info}
                        </a>
                        <p className="text-sm text-gray-600">{contact.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-yellow-900">Horarios de Atención</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {businessHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-yellow-800 font-medium">{schedule.day}</span>
                      <span className="text-yellow-700">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Nuestra Ubicación</CardTitle>
                <CardDescription>Calle de la Playa, 22 - 29620 Torremolinos</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="contact-mapbox-container" className="aspect-video rounded-lg overflow-hidden shadow-lg"></div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open("https://maps.google.com/?q=Calle+de+la+Playa+22+Torremolinos", "_blank")}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver en Google Maps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Preguntas Frecuentes</CardTitle>
            <CardDescription>Respuestas rápidas a las consultas más comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">¿Necesito reservar con antelación?</h4>
                <p className="text-blue-800 text-sm mb-4">
                  Recomendamos reservar con 24h de antelación, especialmente en temporada alta y fines de semana.
                </p>

                <h4 className="font-semibold text-blue-900 mb-2">¿Qué documentos necesito?</h4>
                <p className="text-blue-800 text-sm">
                  Para bicicletas y scooters: DNI o pasaporte. Para coches: carnet de conducir, DNI/pasaporte y tarjeta
                  de crédito.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">¿Incluye seguro?</h4>
                <p className="text-blue-800 text-sm mb-4">
                  Sí, todos nuestros alquileres incluyen seguro básico de responsabilidad civil.
                </p>

                <h4 className="font-semibold text-blue-900 mb-2">¿Puedo cancelar mi reserva?</h4>
                <p className="text-blue-800 text-sm">
                  Sí, puedes cancelar hasta 24h antes sin coste. Consulta nuestras condiciones completas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
