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
import { sendContactEmail, type ContactFormData } from '@/lib/emailjs'

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
  const [submitError, setSubmitError] = useState<string | null>(null)

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
    markerElement.style.fontSize = '12px'
    markerElement.style.backgroundColor = '#fbbf24'
    markerElement.style.borderRadius = '50%'
    markerElement.style.padding = '4px'
    markerElement.style.border = '1px solid #f59e0b'
    markerElement.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)'

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
    setSubmitError(null)

    try {
      const contactData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      }

      const result = await sendContactEmail(contactData)
      
      if (result.success) {
         setIsSubmitted(true)
         setFormData({
           name: "",
           email: "",
           phone: "",
           subject: "",
           message: "",
         })
       } else {
         const errorMsg = result.error || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
         setSubmitError(errorMsg)
         console.error('Detalles del error:', result.details)
       }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
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
                <Button variant="ghost" size="lg" className="text-blue-900 hover:text-blue-700 navbar-back-button p-4">
                  <ArrowLeft className="h-12 w-12" />
                </Button>
              </Link>

             {/* Desktop Navigation - Centered */}
             <nav className="hidden md:flex space-x-8 flex-1 justify-center">
               <Link href="/alquiler" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 Alquiler
               </Link>
               <Link href="/tours" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 Visitas Guiadas
               </Link>
               <a href="/#tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 Tienda
               </a>
               <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
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
            <div className="md:hidden py-4 border-t border-yellow-500 animate-slideDown">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/alquiler" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="animate-typewriter">Alquiler</span>
                </Link>
                <Link 
                  href="/tours" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.2s' }}>Visitas Guiadas</span>
                </Link>
                <a 
                  href="/#tienda" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>Tienda</span>
                </a>
                <Link 
                  href="/contacto" 
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium border-l-4 border-blue-900 pl-2 animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>Contacto</span>
                </Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-yellow-500 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Título y Subtítulo */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Contacto
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestros servicios? ¿Necesitas ayuda con tu reserva? 
            Estamos aquí para ayudarte en tu próxima aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <Card className="order-2 lg:order-1 xl:col-span-3 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Envíanos un mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y te responderemos lo antes posible.
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
                  <Button onClick={() => {
                    setIsSubmitted(false)
                    setSubmitError(null)
                  }} className="bg-blue-600 hover:bg-blue-700">
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700">{submitError}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-base font-medium">Nombre *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 h-11"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base font-medium">Teléfono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1 h-11"
                        placeholder="+34 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 h-11"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-base font-medium">Asunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1 h-11"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-medium">Mensaje *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="mt-1 min-h-[120px] text-base"
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="order-1 lg:order-2 space-y-4">
            {/* Contact Cards */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-400 rounded-full text-blue-600">{contact.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{contact.title}</h3>
                        <a
                          href={contact.href}
                          className="text-blue-600 hover:text-blue-700 font-medium block mb-1 text-sm truncate"
                          target={contact.href.startsWith("http") ? "_blank" : undefined}
                          rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {contact.info}
                        </a>
                        <p className="text-xs text-gray-600">{contact.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-400 rounded-full text-blue-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Horarios</h3>
                    <div className="space-y-1">
                      {businessHours.map((schedule, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-600 text-xs">{schedule.day}</span>
                          <span className="text-gray-700 text-xs font-medium">{schedule.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Location Map */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-gray-900 text-xl">Nuestra Ubicación</CardTitle>
            <CardDescription className="text-base">Calle de la Playa, 22 - 29620 Torremolinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="contact-mapbox-container" className="aspect-video rounded-lg overflow-hidden shadow-lg mb-4"></div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              onClick={() => window.open("https://maps.google.com/?q=Calle+de+la+Playa+22+Torremolinos", "_blank")}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Ver en Google Maps
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-blue-900 text-lg">Preguntas Frecuentes</CardTitle>
            <CardDescription className="text-sm">Respuestas rápidas a las consultas más comunes</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">¿Necesito reservar con antelación?</h4>
                <p className="text-blue-800 text-xs mb-3">
                  Recomendamos reservar con 24h de antelación, especialmente en temporada alta.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">¿Qué documentos necesito?</h4>
                <p className="text-blue-800 text-xs mb-3">
                  Para bicicletas: DNI. Para coches: carnet de conducir y tarjeta de crédito.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">¿Incluye seguro?</h4>
                <p className="text-blue-800 text-xs mb-3">
                  Sí, todos nuestros alquileres incluyen seguro básico de responsabilidad civil.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-sm">¿Puedo cancelar mi reserva?</h4>
                <p className="text-blue-800 text-xs">
                  Sí, puedes cancelar hasta 24h antes sin coste. Consulta condiciones.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
               <div className="flex items-center space-x-3">
                 <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={40} height={40} className="rounded" />
                 <div>
                   <h3 className="font-bold birthstone-regular">Free Air Street</h3>
                   <p className="text-sm text-gray-400">Rent & Tours</p>
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
             </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400">© 2025 Free Air Street. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
