"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

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
      <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-blue-900 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Image src="/logo.png" alt="Free Air Street Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Contacto</h1>
                <p className="text-blue-800">Estamos aquí para ayudarte</p>
              </div>
            </div>
          </div>
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

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Nuestra Ubicación</CardTitle>
                <CardDescription>Calle de la Playa, 22 - 29620 Torremolinos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Mapa interactivo</p>
                    <p className="text-sm text-gray-400">Integración con Google Maps</p>
                  </div>
                </div>
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
