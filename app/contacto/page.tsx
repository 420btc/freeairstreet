"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, CheckCircle, Menu, X, QrCode } from "lucide-react"
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
import { sendContactEmail, sendAdvertisingEmail, type ContactFormData, type AdvertisingFormData } from '@/lib/emailjs'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactoPage() {
  const { t } = useLanguage()
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
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Advertising form states
  const [isAdvertisingSubmitted, setIsAdvertisingSubmitted] = useState(false)
  const [isAdvertisingSubmitting, setIsAdvertisingSubmitting] = useState(false)
  const [advertisingSubmitError, setAdvertisingSubmitError] = useState<string | null>(null)
  const [advertisingFormData, setAdvertisingFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    advertisingType: '',
    message: ''
  })

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

  const handleAdvertisingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAdvertisingFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // La función sendAdvertisingEmail ahora se importa desde @/lib/emailjs

  const handleAdvertisingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdvertisingSubmitting(true)
    setAdvertisingSubmitError(null)

    try {
      const result = await sendAdvertisingEmail(advertisingFormData)
      
      if (result.success) {
        setIsAdvertisingSubmitted(true)
        setAdvertisingFormData({
          businessName: '',
          contactPerson: '',
          email: '',
          phone: '',
          advertisingType: '',
          message: ''
        })
      } else {
        setAdvertisingSubmitError(result.error || 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error submitting advertising form:', error)
      setAdvertisingSubmitError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
    } finally {
      setIsAdvertisingSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: t('contact.phone'),
      info: "655 707 412",
      description: t('contact.phoneHours'),
      href: "tel:+34655707412",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: t('contact.email'),
      info: "rentairstreet@gmail.com",
      description: t('contact.emailResponse'),
      href: "mailto:rentairstreet@gmail.com",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('contact.location'),
      info: "Calle de la Playa, 22",
      description: "29620 - Torremolinos",
      href: "https://maps.google.com/?q=Calle+de+la+Playa+22+Torremolinos",
    },
  ]

  const businessHours = [
    { day: t('contact.mondayToSunday'), hours: t('contact.regularHours') },
    { day: t('contact.holidays'), hours: t('contact.holidayHours') },
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
               <Link href="/tienda" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors">
                 {t('header.shop')}
               </Link>
               <Link href="/contacto" className="text-blue-900 hover:text-blue-700 navbar-desktop-link font-medium transition-colors border-b-2 border-blue-900">
                 {t('header.contact')}
               </Link>
             </nav>

             {/* Page Title for Mobile - Centered */}
             <div className="md:hidden flex-1 text-center">
               <h1 className="text-lg font-bold text-blue-900 navbar-title">{t('header.contact')}</h1>
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
            <div className="md:hidden py-4 border-t border-yellow-500 animate-slideDown">
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
                  className="text-blue-900 hover:text-blue-700 navbar-mobile-text font-medium border-l-4 border-blue-900 pl-2 animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>{t('header.contact')}</span>
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
            {t('contact.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6">
          {/* Contact Form */}
          <Card className="order-2 lg:order-1 xl:col-span-3 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">{t('contact.form.title')}</CardTitle>
              <CardDescription>
                {t('contact.form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('contact.form.success')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('contact.form.successMessage')}
                  </p>
                  <Button onClick={() => {
                    setIsSubmitted(false)
                    setSubmitError(null)
                  }} className="bg-blue-600 hover:bg-blue-700">
                    {t('contact.form.sendAnother')}
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
                      <Label htmlFor="name" className="text-base font-medium">{t('contact.form.name')} *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 h-11"
                        placeholder={t('contact.form.namePlaceholder') as string}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base font-medium">{t('contact.form.phone')} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1 h-11"
                        placeholder={t('contact.form.phonePlaceholder') as string}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium">{t('contact.form.email')} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 h-11"
                        placeholder={t('contact.form.emailPlaceholder') as string}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-base font-medium">{t('contact.form.subject')} *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1 h-11"
                      placeholder={t('contact.form.subjectPlaceholder') as string}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-medium">{t('contact.form.message')} *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="mt-1 min-h-[120px] text-base"
                      placeholder={t('contact.form.messagePlaceholder') as string}
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
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        {t('contact.form.send')}
                      </>
                    )}
                  </Button>
                </form>
                </>
              )}
            </CardContent>
          </Card>

          {/* Advertising Request Form */}
          <Card className="order-3 xl:col-span-4 lg:col-span-3 col-span-1 mt-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-xl text-orange-800 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Solicitar Publicidad
              </CardTitle>
              <CardDescription className="text-orange-700">
                ¿Tienes un negocio? Solicita información sobre nuestros espacios publicitarios en la web y en nuestra tienda física.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAdvertisingSubmitted ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Solicitud Enviada!</h3>
                  <p className="text-gray-600 mb-4">
                    Hemos recibido tu solicitud de publicidad. Te contactaremos pronto con más información.
                  </p>
                  <Button onClick={() => {
                    setIsAdvertisingSubmitted(false)
                    setAdvertisingSubmitError(null)
                  }} className="bg-orange-600 hover:bg-orange-700">
                    Enviar Otra Solicitud
                  </Button>
                </div>
              ) : (
                <>
                  {advertisingSubmitError && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-red-700 text-sm">{advertisingSubmitError}</p>
                    </div>
                  )}
                  <form onSubmit={handleAdvertisingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="adv-name" className="text-sm font-medium text-orange-800">Nombre del Negocio *</Label>
                        <Input
                          id="adv-name"
                          name="businessName"
                          type="text"
                          value={advertisingFormData.businessName}
                          onChange={handleAdvertisingInputChange}
                          required
                          className="mt-1 h-10 border-orange-200 focus:border-orange-400"
                          placeholder="Nombre de tu empresa o negocio"
                        />
                      </div>
                      <div>
                        <Label htmlFor="adv-contact" className="text-sm font-medium text-orange-800">Contacto *</Label>
                        <Input
                          id="adv-contact"
                          name="contactPerson"
                          type="text"
                          value={advertisingFormData.contactPerson}
                          onChange={handleAdvertisingInputChange}
                          required
                          className="mt-1 h-10 border-orange-200 focus:border-orange-400"
                          placeholder="Tu nombre"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="adv-email" className="text-sm font-medium text-orange-800">Email *</Label>
                        <Input
                          id="adv-email"
                          name="email"
                          type="email"
                          value={advertisingFormData.email}
                          onChange={handleAdvertisingInputChange}
                          required
                          className="mt-1 h-10 border-orange-200 focus:border-orange-400"
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="adv-phone" className="text-sm font-medium text-orange-800">Teléfono</Label>
                        <Input
                          id="adv-phone"
                          name="phone"
                          type="tel"
                          value={advertisingFormData.phone}
                          onChange={handleAdvertisingInputChange}
                          className="mt-1 h-10 border-orange-200 focus:border-orange-400"
                          placeholder="655 123 456"
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-2 xl:col-span-3">
                      <Label htmlFor="adv-type" className="text-sm font-medium text-orange-800">Tipo de Publicidad *</Label>
                      <select
                        id="adv-type"
                        name="advertisingType"
                        value={advertisingFormData.advertisingType}
                        onChange={handleAdvertisingInputChange}
                        required
                        className="mt-1 w-full h-10 px-3 border border-orange-200 rounded-md focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="web">Solo en la web</option>
                        <option value="tienda">Solo en la tienda física</option>
                        <option value="ambos">En la web y tienda física</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="adv-message" className="text-sm font-medium text-orange-800">Mensaje</Label>
                      <Textarea
                        id="adv-message"
                        name="message"
                        value={advertisingFormData.message}
                        onChange={handleAdvertisingInputChange}
                        className="mt-1 min-h-[80px] text-sm border-orange-200 focus:border-orange-400"
                        placeholder="Cuéntanos sobre tu negocio y qué tipo de publicidad te interesa..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isAdvertisingSubmitting}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white h-10 text-sm font-semibold"
                    >
                      {isAdvertisingSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                          </svg>
                          Solicitar Información
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
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{t('contact.hours')}</h3>
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
