'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, MapPin, Clock, User, Mail, Phone, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { sendReservationEmail, type ReservationFormData } from '@/lib/emailjs'
import Link from 'next/link'

interface VehicleType {
  id: string
  name: string
  icon: string
  image: string
  priceFrom: string
}

const QuickRentalSection: React.FC = () => {
  const { t } = useLanguage()
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [showMobileForm, setShowMobileForm] = useState(false)
  const [showDesktopForm, setShowDesktopForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '1',
    participants: '1',
    pickupLocation: '',
    comments: '',
    dni: ''
  })
  const [confirmations, setConfirmations] = useState({
    purchaseInfo: false,
    dniRequired: false,
    dataPolicy: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const vehicles: VehicleType[] = [
    {
      id: 'bicycles',
      name: 'Bicicleta',
      icon: '🚲',
      image: '/urban-bicycle.png',
      priceFrom: '3€/h'
    },
    {
      id: 'electric-bikes',
      name: 'E-Bike',
      icon: '⚡',
      image: '/modern-electric-bike.png',
      priceFrom: '10€/h'
    },
    {
      id: 'fat-bikes',
      name: 'Fat Bike',
      icon: '🚵',
      image: '/fat-bike-electric-wide-tires.png',
      priceFrom: '10€/h'
    },
    {
      id: 'scooters',
      name: 'Patinete',
      icon: '🛴',
      image: '/patinelectrico.jpg',
      priceFrom: '10€/30min'
    },
    {
      id: 'motorcycles',
      name: 'Moto',
      icon: '🏍️',
      image: '/motos/motobike.jpeg',
      priceFrom: '15€/h'
    },
    {
      id: 'quads',
      name: 'Quad',
      icon: '🏎️',
      image: '/quad.jpeg',
      priceFrom: '30€/h'
    },
    {
      id: 'cars',
      name: 'Coche',
      icon: '🚗',
      image: '/coches/toyotaaygo.png',
      priceFrom: '54€/día'
    }
  ]

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle) || vehicles[0]

  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicle(vehicleId)
    // En móvil, mostrar el formulario cuando se selecciona un vehículo
    if (window.innerWidth < 768) {
      setShowMobileForm(true)
    } else {
      // En desktop también mostrar el formulario
      setShowDesktopForm(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    
    // Validar campos requeridos
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setSubmitError('Por favor, completa todos los campos obligatorios.')
      setIsSubmitting(false)
      return
    }
    
    // Validar confirmaciones
    if (!confirmations.purchaseInfo || !confirmations.dniRequired || !confirmations.dataPolicy) {
      setSubmitError('Debes aceptar todas las condiciones para continuar.')
      setIsSubmitting(false)
      return
    }

    try {
      const reservationData: ReservationFormData = {
        ...formData,
        type: 'rental',
        itemName: selectedVehicleData.name,
        itemPrice: selectedVehicleData.priceFrom
      }

      const result = await sendReservationEmail(reservationData)
      
      if (result.success) {
        setIsSubmitted(true)
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: new Date().toISOString().split('T')[0],
          time: '',
          duration: '1',
          participants: '1',
          pickupLocation: '',
          comments: '',
          dni: ''
        })
        setConfirmations({
          purchaseInfo: false,
          dniRequired: false,
          dataPolicy: false
        })
      } else {
        setSubmitError(result.error || 'Error al enviar la reserva. Por favor, inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error submitting reservation:', error)
      setSubmitError('Error al enviar la reserva. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfirmationChange = (field: string, checked: boolean) => {
    setConfirmations(prev => ({ ...prev, [field]: checked }))
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  ¡Reserva Enviada!
                </h3>
                <p className="text-green-700 mb-6">
                  Hemos recibido tu solicitud de reserva. Te contactaremos pronto para confirmar los detalles.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Hacer Otra Reserva
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Alquila Ahora
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona tu vehículo ideal y reserva al instante
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-6 lg:p-8">
              {/* Vista móvil - Solo selector inicial */}
              <div className="md:hidden">
                {!showMobileForm ? (
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Selecciona tu Vehículo
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelection(vehicle.id)}
                          className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg border-gray-200 hover:border-blue-300 hover:bg-gray-50 shadow-md hover:shadow-xl"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                              {vehicle.icon}
                            </div>
                            <div className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
                              {vehicle.name}
                            </div>
                            <div className="text-xs font-bold text-blue-600">
                              {vehicle.priceFrom}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Vehículo seleccionado - móvil */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{selectedVehicleData.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{selectedVehicleData.name}</h4>
                            <p className="text-sm text-blue-600 font-medium">{selectedVehicleData.priceFrom}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowMobileForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cambiar
                        </button>
                      </div>
                    </div>

                    {/* Formulario móvil */}
                    <div className="space-y-4">
                      {/* Información personal */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name-mobile" className="flex items-center gap-1 mb-2">
                            <User className="h-4 w-4" />
                            Nombre completo *
                          </Label>
                          <Input
                            id="name-mobile"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Tu nombre completo"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email-mobile" className="flex items-center gap-1 mb-2">
                            <Mail className="h-4 w-4" />
                            Email *
                          </Label>
                          <Input
                            id="email-mobile"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="tu@email.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone-mobile" className="flex items-center gap-1 mb-2">
                            <Phone className="h-4 w-4" />
                            Teléfono *
                          </Label>
                          <Input
                            id="phone-mobile"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+34 XXX XXX XXX"
                            required
                          />
                        </div>
                      </div>

                      {/* Detalles de la reserva */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date-mobile" className="flex items-center gap-1 mb-2">
                            <Calendar className="h-4 w-4" />
                            Fecha *
                          </Label>
                          <Input
                            id="date-mobile"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="time-mobile" className="flex items-center gap-1 mb-2">
                            <Clock className="h-4 w-4" />
                            Hora *
                          </Label>
                          <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Hora" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 14 }, (_, i) => {
                                const hour = 9 + i
                                return (
                                  <SelectItem key={hour} value={`${hour}:00`}>
                                    {hour}:00
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration-mobile" className="mb-2 block">
                            Duración
                          </Label>
                          <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 día</SelectItem>
                              <SelectItem value="2">2 días</SelectItem>
                              <SelectItem value="3">3 días</SelectItem>
                              <SelectItem value="7">1 semana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="participants-mobile" className="mb-2 block">
                            Participantes
                          </Label>
                          <Select value={formData.participants} onValueChange={(value) => handleInputChange('participants', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  {i + 1} {i === 0 ? 'persona' : 'personas'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="comments-mobile" className="mb-2 block">
                          Comentarios adicionales
                        </Label>
                        <Textarea
                          id="comments-mobile"
                          value={formData.comments}
                          onChange={(e) => handleInputChange('comments', e.target.value)}
                          placeholder="Cualquier información adicional..."
                          rows={3}
                        />
                      </div>

                      {/* Confirmaciones móvil */}
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="purchaseInfo-mobile"
                            checked={confirmations.purchaseInfo}
                            onCheckedChange={(checked) => handleConfirmationChange('purchaseInfo', checked as boolean)}
                          />
                          <Label htmlFor="purchaseInfo-mobile" className="text-sm leading-relaxed">
                            Acepto las condiciones de alquiler.
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="dniRequired-mobile"
                            checked={confirmations.dniRequired}
                            onCheckedChange={(checked) => handleConfirmationChange('dniRequired', checked as boolean)}
                          />
                          <Label htmlFor="dniRequired-mobile" className="text-sm leading-relaxed">
                            Presentaré documento de identidad válido.
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="dataPolicy-mobile"
                            checked={confirmations.dataPolicy}
                            onCheckedChange={(checked) => handleConfirmationChange('dataPolicy', checked as boolean)}
                          />
                          <Label htmlFor="dataPolicy-mobile" className="text-sm leading-relaxed">
                            Acepto la política de privacidad.
                          </Label>
                        </div>
                      </div>

                      {/* Error message móvil */}
                      {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700 text-sm">{submitError}</p>
                        </div>
                      )}

                      {/* Botón enviar móvil */}
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar Reserva'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Vista desktop */}
              <div className="hidden md:block">
                {!showDesktopForm ? (
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">
                      Selecciona tu Vehículo
                    </h3>
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-6">
                      {vehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelection(vehicle.id)}
                          className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg border-gray-200 hover:border-blue-300 hover:bg-gray-50 shadow-md hover:shadow-xl"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">
                              {vehicle.icon}
                            </div>
                            <div className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                              {vehicle.name}
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              {vehicle.priceFrom}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Vehículo seleccionado - desktop */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{selectedVehicleData.icon}</span>
                          <div>
                            <h4 className="text-xl font-semibold text-gray-900">{selectedVehicleData.name}</h4>
                            <p className="text-lg text-blue-600 font-medium">{selectedVehicleData.priceFrom}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowDesktopForm(false)}
                          className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Cambiar Vehículo
                        </button>
                      </div>
                    </div>

                    {/* Formulario desktop */}
                    <div className="space-y-6">
                      {/* Información personal */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="name" className="flex items-center gap-1 mb-2">
                            <User className="h-4 w-4" />
                            Nombre completo *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Tu nombre completo"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="flex items-center gap-1 mb-2">
                            <Mail className="h-4 w-4" />
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="tu@email.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="flex items-center gap-1 mb-2">
                            <Phone className="h-4 w-4" />
                            Teléfono *
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+34 XXX XXX XXX"
                            required
                          />
                        </div>
                      </div>

                      {/* Detalles de la reserva */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-1 mb-2">
                      <Calendar className="h-4 w-4" />
                      Fecha *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="flex items-center gap-1 mb-2">
                      <Clock className="h-4 w-4" />
                      Hora *
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 14 }, (_, i) => {
                          const hour = 9 + i
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration" className="mb-2 block">
                      Duración
                    </Label>
                    <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 día</SelectItem>
                        <SelectItem value="2">2 días</SelectItem>
                        <SelectItem value="3">3 días</SelectItem>
                        <SelectItem value="7">1 semana</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="participants" className="mb-2 block">
                      Participantes
                    </Label>
                    <Select value={formData.participants} onValueChange={(value) => handleInputChange('participants', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1} {i === 0 ? 'persona' : 'personas'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                      </div>

                      {/* Información adicional */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickupLocation" className="flex items-center gap-1 mb-2">
                      <MapPin className="h-4 w-4" />
                      Lugar de recogida
                    </Label>
                    <Input
                      id="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      placeholder="Dirección o punto de referencia"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dni" className="mb-2 block">
                      DNI/Pasaporte
                    </Label>
                    <Input
                      id="dni"
                      value={formData.dni}
                      onChange={(e) => handleInputChange('dni', e.target.value)}
                      placeholder="Documento de identidad"
                    />
                  </div>
                      </div>

                      <div>
                        <Label htmlFor="comments" className="mb-2 block">
                          Comentarios adicionales
                        </Label>
                        <Textarea
                          id="comments"
                          value={formData.comments}
                          onChange={(e) => handleInputChange('comments', e.target.value)}
                          placeholder="Cualquier información adicional..."
                          rows={3}
                        />
                      </div>

                      {/* Confirmaciones */}
                      <div className="space-y-3 border-t pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="purchaseInfo"
                      checked={confirmations.purchaseInfo}
                      onCheckedChange={(checked) => handleConfirmationChange('purchaseInfo', checked as boolean)}
                    />
                    <Label htmlFor="purchaseInfo" className="text-sm leading-relaxed">
                      He leído y acepto las condiciones de alquiler y política de cancelación.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dniRequired"
                      checked={confirmations.dniRequired}
                      onCheckedChange={(checked) => handleConfirmationChange('dniRequired', checked as boolean)}
                    />
                    <Label htmlFor="dniRequired" className="text-sm leading-relaxed">
                      Confirmo que presentaré un documento de identidad válido en el momento de la recogida.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="dataPolicy"
                      checked={confirmations.dataPolicy}
                      onCheckedChange={(checked) => handleConfirmationChange('dataPolicy', checked as boolean)}
                    />
                    <Label htmlFor="dataPolicy" className="text-sm leading-relaxed">
                      Acepto la política de privacidad y el tratamiento de mis datos personales.
                    </Label>
                  </div>
                      </div>

                      {/* Error message */}
                      {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700 text-sm">{submitError}</p>
                        </div>
                      )}

                      {/* Botones */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Reserva'}
                  </Button>
                  <Link href="/alquiler" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3"
                    >
                      Ver Todos los Precios
                    </Button>
                        </Link>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default QuickRentalSection