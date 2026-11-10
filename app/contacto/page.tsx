"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  QrCode,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PageHero } from "@/components/site/PageHero"
import { SectionHeading } from "@/components/site/SectionHeading"
import { SiteFooter } from "@/components/site/SiteFooter"
import Image from "next/image"
import Link from "next/link"
import mapboxgl from "mapbox-gl"
import { LanguageToggle } from '../../components/LanguageToggle'
import { ThemeToggle } from '../../components/ThemeToggle'
import { sendContactEmail, sendAdvertisingEmail, type ContactFormData, type AdvertisingFormData } from '@/lib/emailjs'
import { useLanguage } from '@/contexts/LanguageContext'

const contactFaqs = [
  {
    question: "¿Necesito reservar con antelación?",
    answer: "Recomendamos reservar con 24h de antelación, especialmente en temporada alta.",
  },
  {
    question: "¿Qué documentos necesito?",
    answer: "Para bicicletas: DNI. Para coches: carnet de conducir y tarjeta de crédito.",
  },
  {
    question: "¿Incluye seguro?",
    answer: "Sí, todos nuestros alquileres incluyen seguro básico de responsabilidad civil.",
  },
  {
    question: "¿Puedo cancelar mi reserva?",
    answer: "Sí, puedes cancelar hasta 24h antes sin coste. Consulta condiciones.",
  },
]

export default function ContactoPage() {
  const { t, language } = useLanguage()
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
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

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
      icon: <Phone className="h-5 w-5" />,
      title: t('contact.phone'),
      info: "655 707 412",
      description: t('contact.phoneHours'),
      href: "tel:+34655707412",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: t('contact.email'),
      info: "rentairstreet@gmail.com",
      description: t('contact.emailResponse'),
      href: "mailto:rentairstreet@gmail.com",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
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

  const fieldClasses =
    "mt-1 h-12 rounded-xl border-slate-300 bg-white text-base dark:border-white/15 dark:bg-white/5"

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f6f8] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
             {/* Back Arrow */}
              <Link href="/">
                <Button variant="ghost" size="lg" className="navbar-back-button p-4 text-blue-900 hover:text-blue-700">
                  <ArrowLeft className="h-12 w-12" />
                </Button>
              </Link>

            {/* Logo */}
            <Link href="/" className="flex cursor-pointer items-center justify-center space-x-4 font-mono italic leading-3 tracking-tighter transition-opacity hover:opacity-80 sm:justify-start lg:space-x-8">
              <Image src="/icon/iconf.png" alt="Free Air Street Logo" width={64} height={64} className="rounded" />
              <div className="hidden text-center sm:text-left md:block">
                <h1 className="birthstone-regular navbar-title text-2xl font-black leading-tight text-blue-900 sm:text-4xl">Free Air Street</h1>
                <p className="birthstone-regular navbar-subtitle -mt-3 hidden text-2xl text-blue-800 sm:block">Rent &amp; Tours</p>
              </div>
            </Link>

             {/* Desktop Navigation - Centered */}
             <nav className="hidden flex-1 justify-center space-x-4 md:flex lg:space-x-8">
               <Link href="/alquiler" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                 {t('header.rental')}
               </Link>
               <Link href="/tours" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                 {t('header.tours')}
               </Link>
               <Link href="/rutas" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                 {t('header.routes')}
               </Link>
               <Link href="/tienda" className="navbar-desktop-link font-medium text-blue-900 transition-colors hover:text-blue-700">
                 {t('header.shop')}
               </Link>
               <Link href="/contacto" className="navbar-desktop-link border-b-2 border-blue-900 font-medium text-blue-900 transition-colors hover:text-blue-700">
                 {t('header.contact')}
               </Link>
             </nav>

             {/* Page Title for Mobile - Centered */}
             <div className="flex-1 text-center md:hidden">
               <h1 className="navbar-title text-lg font-bold text-blue-900">{t('header.contact')}</h1>
             </div>

             {/* QR Code, Language Toggle and Mobile Menu */}
             <div className="flex items-center space-x-4">
               <div 
                 className="hidden cursor-pointer items-center space-x-2 rounded-lg border border-white/20 bg-white/20 px-3 py-2 transition-colors hover:bg-white/30 sm:flex"
                 onClick={() => setIsQrModalOpen(true)}
               >
                 <QrCode className="h-5 w-5 text-blue-900" />
                 <span className="text-sm font-medium text-blue-900">Rent a Quad</span>
               </div>

               {/* Language Toggle and Theme Toggle */}
               <div className="flex items-center space-x-2">
                 <LanguageToggle />
                 <div className="hidden md:block">
                   <ThemeToggle />
                 </div>
               </div>

               <button
                 className="navbar-mobile-button text-blue-900 md:hidden"
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
                 aria-label="Menu"
               >
                 {isMenuOpen ? <X className="navbar-mobile-icon h-6 w-6" /> : <Menu className="navbar-mobile-icon h-6 w-6" />}
               </button>
             </div>
           </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="animate-slideDown border-t border-yellow-600 py-4 md:hidden">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/alquiler" 
                  className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700 animate-fadeInUp"
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="animate-typewriter">{t('header.rental')}</span>
                </Link>
                <Link 
                  href="/tours" 
                  className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700 animate-fadeInUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.2s' }}>{t('header.tours')}</span>
                </Link>
                <Link 
                  href="/rutas" 
                  className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700 animate-fadeInUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.3s' }}>{t('header.routes')}</span>
                </Link>
                <Link 
                  href="/tienda" 
                  className="navbar-mobile-text font-medium text-blue-900 hover:text-blue-700 animate-fadeInUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.4s' }}>{t('header.shop')}</span>
                </Link>
                <Link 
                  href="/contacto" 
                  className="navbar-mobile-text border-l-4 border-blue-900 pl-2 font-medium text-blue-900 animate-fadeInUp"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="animate-typewriter" style={{ animationDelay: '0.5s' }}>{t('header.contact')}</span>
                </Link>
                <div className="flex items-center space-x-4 border-t border-yellow-600 pt-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
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
            {language === 'en' ? 'We are here' : 'Estamos aquí'}
          </>
        }
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        image="/hero.png"
        imageAlt="Free Air Street · Torremolinos"
        stats={[
          { value: "24h", label: t('contact.emailResponse'), icon: <Mail className="h-5 w-5" /> },
          { value: "9:00 – 22:00", label: t('contact.hours'), icon: <Clock className="h-5 w-5" /> },
          { value: "655 707 412", label: "WhatsApp", icon: <MessageCircle className="h-5 w-5" /> },
          { value: "Torremolinos", label: t('contact.location'), icon: <MapPin className="h-5 w-5" /> },
        ]}
        actions={
          <>
            <Button asChild className="h-14 rounded-full bg-yellow-400 px-8 text-base font-bold text-blue-950 shadow-xl shadow-yellow-400/20 hover:-translate-y-0.5 hover:bg-yellow-300">
              <a href="#contacto">
                <Send className="h-5 w-5" />
                {t('contact.form.send')}
              </a>
            </Button>
            <Button asChild variant="outline" className="h-14 rounded-full border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white">
              <a href="https://wa.me/34655707412" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </>
        }
      />

      {/* Presentación */}
      <section className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 lg:grid-cols-2 lg:items-center">
          <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-4">
            <Image
              src="/banana-world-hero.png"
              alt="Banana World"
              width={800}
              height={400}
              className="h-auto w-full max-w-full object-contain"
              priority
            />
          </div>

          <div className="p-6 sm:p-10 lg:py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-yellow-400/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-700 dark:text-yellow-300">
              <Star className="h-3.5 w-3.5" />
              Free Air Street
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-4xl">
              Únete a nosotros para vivir la aventura perfecta
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              Descubre Málaga de una forma única con nuestros vehículos de alquiler. 
              Desde bicicletas eléctricas hasta quads, tenemos todo lo que necesitas 
              para explorar la ciudad y sus alrededores con total libertad.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="container mx-auto scroll-mt-24 px-4 pb-16 md:pb-20">
        <SectionHeading
          eyebrow={t('contact.info.title')}
          title={t('contact.form.title')}
          subtitle={t('contact.form.description')}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70 sm:p-8">
              {isSubmitted ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                    <CheckCircle className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 text-2xl font-black">{t('contact.form.success')}</h3>
                  <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
                    {t('contact.form.successMessage')}
                  </p>
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setSubmitError(null)
                    }}
                    className="mt-6 h-12 rounded-full bg-blue-900 px-6 font-semibold text-white hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                  >
                    {t('contact.form.sendAnother')}
                  </Button>
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">{submitError}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <Label htmlFor="name" className="text-sm font-semibold">{t('contact.form.name')} *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={fieldClasses}
                          placeholder={t('contact.form.namePlaceholder') as string}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-semibold">{t('contact.form.phone')} *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className={fieldClasses}
                          placeholder={t('contact.form.phonePlaceholder') as string}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold">{t('contact.form.email')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={fieldClasses}
                          placeholder={t('contact.form.emailPlaceholder') as string}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-sm font-semibold">{t('contact.form.subject')} *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={fieldClasses}
                        placeholder={t('contact.form.subjectPlaceholder') as string}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-semibold">{t('contact.form.message')} *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-1 min-h-[140px] rounded-xl border-slate-300 bg-white text-base dark:border-white/15 dark:bg-white/5"
                        placeholder={t('contact.form.messagePlaceholder') as string}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-full bg-blue-900 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white dark:border-blue-950"></span>
                          {t('contact.form.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          {t('contact.form.send')}
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <aside className="space-y-4">
            {contactInfo.map((contact, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-950">
                    {contact.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {contact.title}
                    </h3>
                    <a
                      href={contact.href}
                      className="mt-1 block break-words text-sm font-bold text-blue-900 transition hover:text-blue-700 dark:text-yellow-300 dark:hover:text-yellow-200"
                      target={contact.href.startsWith("http") ? "_blank" : undefined}
                      rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {contact.info}
                    </a>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{contact.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-blue-950">
                  <Clock className="h-5 w-5" />
                </span>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {t('contact.hours')}
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0 dark:border-white/10">
                    <span className="text-xs text-slate-600 dark:text-slate-400">{schedule.day}</span>
                    <span className="text-xs font-bold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Advertising Request Form */}
      <section className="border-y border-slate-200/70 bg-white/60 py-14 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow={language === 'en' ? 'Business' : 'Negocios'}
            title="Solicitar Publicidad"
            subtitle="¿Tienes un negocio? Solicita información sobre nuestros espacios publicitarios en la web y en nuestra tienda física."
          />

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-yellow-50 shadow-sm dark:border-amber-400/20 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/60">
            <div className="p-6 sm:p-8">
              {isAdvertisingSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                    <CheckCircle className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 text-2xl font-black">¡Solicitud Enviada!</h3>
                  <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
                    Hemos recibido tu solicitud de publicidad. Te contactaremos pronto con más información.
                  </p>
                  <Button
                    onClick={() => {
                      setIsAdvertisingSubmitted(false)
                      setAdvertisingSubmitError(null)
                    }}
                    className="mt-6 h-12 rounded-full bg-orange-600 px-6 font-semibold text-white hover:bg-orange-700"
                  >
                    Enviar Otra Solicitud
                  </Button>
                </div>
              ) : (
                <>
                  {advertisingSubmitError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-500/10">
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">{advertisingSubmitError}</p>
                    </div>
                  )}
                  <form onSubmit={handleAdvertisingSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="adv-name" className="text-sm font-semibold">Nombre del Negocio *</Label>
                        <Input
                          id="adv-name"
                          name="businessName"
                          type="text"
                          value={advertisingFormData.businessName}
                          onChange={handleAdvertisingInputChange}
                          required
                          className={fieldClasses}
                          placeholder="Nombre de tu empresa o negocio"
                        />
                      </div>
                      <div>
                        <Label htmlFor="adv-contact" className="text-sm font-semibold">Contacto *</Label>
                        <Input
                          id="adv-contact"
                          name="contactPerson"
                          type="text"
                          value={advertisingFormData.contactPerson}
                          onChange={handleAdvertisingInputChange}
                          required
                          className={fieldClasses}
                          placeholder="Tu nombre"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="adv-email" className="text-sm font-semibold">Email *</Label>
                        <Input
                          id="adv-email"
                          name="email"
                          type="email"
                          value={advertisingFormData.email}
                          onChange={handleAdvertisingInputChange}
                          required
                          className={fieldClasses}
                          placeholder="tu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="adv-phone" className="text-sm font-semibold">Teléfono</Label>
                        <Input
                          id="adv-phone"
                          name="phone"
                          type="tel"
                          value={advertisingFormData.phone}
                          onChange={handleAdvertisingInputChange}
                          className={fieldClasses}
                          placeholder="655 123 456"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="adv-type" className="text-sm font-semibold">Tipo de Publicidad *</Label>
                      <select
                        id="adv-type"
                        name="advertisingType"
                        value={advertisingFormData.advertisingType}
                        onChange={handleAdvertisingInputChange}
                        required
                        className="mt-1 h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300/50 dark:border-white/15 dark:bg-slate-900"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="web">Solo en la web</option>
                        <option value="tienda">Solo en la tienda física</option>
                        <option value="ambos">En la web y tienda física</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="adv-message" className="text-sm font-semibold">Mensaje</Label>
                      <Textarea
                        id="adv-message"
                        name="message"
                        value={advertisingFormData.message}
                        onChange={handleAdvertisingInputChange}
                        className="mt-1 min-h-[110px] rounded-xl border-slate-300 bg-white text-base dark:border-white/15 dark:bg-white/5"
                        placeholder="Cuéntanos sobre tu negocio y qué tipo de publicidad te interesa..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isAdvertisingSubmitting}
                      className="h-14 w-full rounded-full bg-orange-600 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-700"
                    >
                      {isAdvertisingSubmitting ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Solicitar Información
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900/70">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-6 dark:border-white/10 sm:p-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-yellow-600 dark:text-yellow-400">Cómo llegar</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">Nuestra Ubicación</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                Calle de la Playa, 22 - 29620 Torremolinos
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-yellow-500" />
              La Colina · Torremolinos
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <div
              id="contact-mapbox-container"
              className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner dark:border-white/10"
            ></div>
            <Button
              className="mt-4 h-14 w-full rounded-full bg-blue-900 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-800 dark:bg-yellow-400 dark:text-blue-950 dark:hover:bg-yellow-300"
              onClick={() => window.open("https://maps.google.com/?q=Calle+de+la+Playa+22+Torremolinos", "_blank")}
            >
              <MapPin className="h-5 w-5" />
              Ver en Google Maps
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200/70 bg-white/60 py-16 backdrop-blur-sm dark:border-white/5 dark:bg-white/[0.02] md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow={language === 'en' ? 'FAQ' : 'Dudas frecuentes'}
            title="Preguntas Frecuentes"
            subtitle="Respuestas rápidas a las consultas más comunes"
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactFaqs.map((faq, index) => (
              <div
                key={faq.question}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-xs font-black text-white dark:bg-yellow-400 dark:text-blue-950">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-3 text-sm font-bold leading-snug">{faq.question}</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter
        tagline="Rent & Tours"
        rights={t('footer.rights')}
        contactLabel={t('header.contact')}
        backHomeLabel="Volver al inicio"
      />

      {/* QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-black text-orange-600">Rent a Quad</h3>
              
              <div className="mt-5">
                <Image
                  src="/rentwuad.png"
                  alt="Rent Quad Logo"
                  width={200}
                  height={80}
                  className="mx-auto"
                />
              </div>
              
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                className="mt-6 h-12 w-full rounded-full bg-orange-600 font-semibold text-white transition-colors hover:bg-orange-700"
              >
                Acceder a Quad Aventura
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
