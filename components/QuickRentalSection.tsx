'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, MapPin, Clock, User, Mail, Phone, CheckCircle, Bike, Zap, Mountain, Car, CarFront } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { sendReservationEmail, type ReservationFormData } from '@/lib/emailjs'
import Link from 'next/link'

interface VehicleType {
  id: string
  name: string
  icon: React.ReactNode
  mobileIcon: React.ReactNode
  image: string
  priceFrom: string
  prices: Array<{
    duration: string
    price: string
    featured?: boolean
  }>
}

interface SelectedPriceType {
  duration: string
  price: string
}

const QuickRentalSection: React.FC = () => {
  const { t } = useLanguage()
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [selectedPrice, setSelectedPrice] = useState<SelectedPriceType | null>(null)
  const [showMobileForm, setShowMobileForm] = useState(false)
  const [showDesktopForm, setShowDesktopForm] = useState(false)
  const [showMobilePrices, setShowMobilePrices] = useState(false)
  const [showDesktopPrices, setShowDesktopPrices] = useState(false)
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
      name: t('quickRental.vehicles.bicycle') as string,
      icon: <Bike className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <Bike className="w-12 h-12 text-yellow-500" />,
      image: '/urban-bicycle.png',
      priceFrom: `${t('quickRental.priceFrom') as string} 3€`,
      prices: [
        { duration: "1h", price: "3€" },
        { duration: "2h", price: "5€" },
        { duration: "3h", price: "6€" },
        { duration: "4h", price: "7€" },
        { duration: "Todo el día", price: "13€", featured: true },
      ]
    },
    {
      id: 'electric-bikes',
      name: t('quickRental.vehicles.electricBike') as string,
      icon: <Zap className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <Zap className="w-12 h-12 text-yellow-500" />,
      image: '/modern-electric-bike.png',
      priceFrom: `${t('quickRental.priceFrom') as string} 10€`,
      prices: [
        { duration: "1h", price: "10€" },
        { duration: "2h", price: "18€" },
        { duration: "3h", price: "25€" },
        { duration: "4h", price: "30€" },
        { duration: "Todo el día", price: "35€", featured: true },
      ]
    },
    {
      id: 'fat-bikes',
      name: t('quickRental.vehicles.fatBike') as string,
      icon: <Mountain className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <Mountain className="w-12 h-12 text-yellow-500" />,
      image: '/fat-bike-electric-wide-tires.png',
      priceFrom: `${t('quickRental.priceFrom') as string} 10€`,
      prices: [
        { duration: "1h", price: "10€" },
        { duration: "2h", price: "18€" },
        { duration: "3h", price: "25€" },
        { duration: "4h", price: "30€" },
        { duration: "Todo el día", price: "35€", featured: true },
      ]
    },
    {
      id: 'scooters',
      name: t('quickRental.vehicles.scooter') as string,
      icon: <Zap className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <Zap className="w-12 h-12 text-yellow-500" />,
      image: '/patinelectrico.jpg',
      priceFrom: `${t('quickRental.priceFrom') as string} 10€`,
      prices: [
        { duration: "30 min", price: "10€" },
        { duration: "1h", price: "15€", featured: true },
      ]
    },
    {
      id: 'motorcycles',
      name: t('quickRental.vehicles.motorcycle') as string,
      icon: <Bike className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <Bike className="w-12 h-12 text-yellow-500" />,
      image: '/motos/motobike.jpeg',
      priceFrom: `${t('quickRental.priceFrom') as string} 15€`,
      prices: [
        { duration: "1h", price: "15€" },
        { duration: "2h", price: "25€", featured: true },
        { duration: "1 día", price: "40€" },
        { duration: "2 días", price: "65€" },
        { duration: "3 días", price: "85€" },
        { duration: "7 días", price: "155€" },
      ]
    },
    {
      id: 'quads',
      name: t('quickRental.vehicles.quad') as string,
      icon: <CarFront className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <CarFront className="w-12 h-12 text-yellow-500" />,
      image: '/quad.jpeg',
      priceFrom: `${t('quickRental.priceFrom') as string} 30€`,
      prices: [
        { duration: "1 hora", price: "30€", featured: true },
        { duration: "2 horas", price: "50€", featured: true },
      ]
    },
    {
      id: 'cars',
      name: t('quickRental.vehicles.car') as string,
      icon: <Car className="w-20 h-20 text-yellow-500" />,
      mobileIcon: <Car className="w-12 h-12 text-yellow-500" />,
      image: '/coches/toyotaaygo.png',
      priceFrom: `${t('quickRental.priceFrom') as string} 54€`,
      prices: [
        { duration: "1 día", price: "54€", featured: true },
        { duration: "2 días", price: "94€" },
        { duration: "3 días", price: "118€" },
        { duration: "4 días", price: "149€" },
        { duration: "5 días", price: "172€" },
        { duration: "6 días", price: "186€" },
        { duration: "7 días", price: "196€" },
      ]
    }
  ]

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle) || vehicles[0]

  const handleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicle(vehicleId)
    setSelectedPrice(null)
    // En móvil, mostrar la selección de precios
    if (window.innerWidth < 768) {
      setShowMobilePrices(true)
      setShowMobileForm(false)
    } else {
      // En desktop también mostrar la selección de precios
      setShowDesktopPrices(true)
      setShowDesktopForm(false)
    }
  }

  const handlePriceSelection = (duration: string, price: string) => {
    setSelectedPrice({ duration, price })
    
    // Auto-rellenar la duración en el formulario basado en la selección
    let formDuration = '1'
    if (duration.includes('2h') || duration.includes('2 h')) formDuration = '2h'
    else if (duration.includes('3h') || duration.includes('3 h')) formDuration = '3h'
    else if (duration.includes('4h') || duration.includes('4 h')) formDuration = '4h'
    else if (duration.includes('30 min')) formDuration = '30min'
    else if (duration.includes('1h') || duration.includes('1 h')) formDuration = '1h'
    else if (duration.includes('Todo el día') || duration.includes('día completo')) formDuration = 'fullday'
    else if (duration.includes('1 día') || duration.includes('1D')) formDuration = '1'
    else if (duration.includes('2 días') || duration.includes('2D')) formDuration = '2'
    else if (duration.includes('3 días') || duration.includes('3D')) formDuration = '3'
    else if (duration.includes('4 días') || duration.includes('4D')) formDuration = '4'
    else if (duration.includes('5 días') || duration.includes('5D')) formDuration = '5'
    else if (duration.includes('6 días') || duration.includes('6D')) formDuration = '6'
    else if (duration.includes('7 días') || duration.includes('7D') || duration.includes('1 semana')) formDuration = '7'
    else if (duration.includes('1 hora')) formDuration = '1h'
    else if (duration.includes('2 horas')) formDuration = '2h'
    
    setFormData(prev => ({ ...prev, duration: formDuration }))
    
    // Mostrar el formulario después de seleccionar precio
    if (window.innerWidth < 768) {
      setShowMobileForm(true)
    } else {
      setShowDesktopForm(true)
    }
  }

  const handleBackToVehicles = () => {
    setSelectedVehicle('')
    setSelectedPrice(null)
    setShowMobilePrices(false)
    setShowDesktopPrices(false)
    setShowMobileForm(false)
    setShowDesktopForm(false)
  }

  const handleBackToPrices = () => {
    setSelectedPrice(null)
    setShowMobileForm(false)
    setShowDesktopForm(false)
    if (window.innerWidth < 768) {
      setShowMobilePrices(true)
    } else {
      setShowDesktopPrices(true)
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
        itemName: `${selectedVehicleData.name} - ${selectedPrice?.duration}`,
        itemPrice: selectedPrice?.price || 'No especificado'
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
        // Reset navigation states
        setSelectedVehicle('')
        setSelectedPrice(null)
        setShowMobilePrices(false)
        setShowDesktopPrices(false)
        setShowMobileForm(false)
        setShowDesktopForm(false)
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
                  onClick={() => {
                    setIsSubmitted(false)
                    setSelectedVehicle('')
                    setSelectedPrice(null)
                    setShowMobilePrices(false)
                    setShowDesktopPrices(false)
                    setShowMobileForm(false)
                    setShowDesktopForm(false)
                  }}
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
            {t('quickRental.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('quickRental.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
              {/* Vista móvil - Sistema de 3 pasos */}
              <div className="md:hidden">
                {!showMobilePrices && !showMobileForm ? (
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Primera fila: 2 tarjetas */}
                      {vehicles.slice(0, 2).map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelection(vehicle.id)}
                          className="group relative px-12 py-10 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl border-gray-200 hover:border-blue-300 shadow-md min-h-[220px] w-full"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="mb-3 transform group-hover:scale-110 transition-transform duration-200 flex justify-center">
                              <div className="w-12 h-12 flex items-center justify-center">
                                {vehicle.mobileIcon}
                              </div>
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
                      
                      {/* Segunda fila: 2 tarjetas */}
                      {vehicles.slice(2, 4).map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelection(vehicle.id)}
                          className="group relative p-8 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl border-gray-200 hover:border-blue-300 shadow-md"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="mb-3 transform group-hover:scale-110 transition-transform duration-200 flex justify-center">
                              <div className="w-12 h-12 flex items-center justify-center">
                                {vehicle.mobileIcon}
                              </div>
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
                      
                      {/* Tercera fila: 2 tarjetas */}
                      {vehicles.slice(4, 6).map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelection(vehicle.id)}
                          className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl border-gray-200 hover:border-blue-300 shadow-md"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="mb-3 transform group-hover:scale-110 transition-transform duration-200 flex justify-center">
                              <div className="w-12 h-12 flex items-center justify-center">
                                {vehicle.mobileIcon}
                              </div>
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
                      
                      {/* Cuarta fila: 1 tarjeta centrada */}
                      <div className="col-span-2 flex justify-center">
                        {vehicles.slice(6, 7).map((vehicle) => (
                          <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => handleVehicleSelection(vehicle.id)}
                            className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl w-40"
                            style={{
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                          >
                            <div className="text-center">
                              <div className="mb-3 transform group-hover:scale-110 transition-transform duration-200 flex justify-center">
                                <div className="w-12 h-12 flex items-center justify-center">
                                  {vehicle.mobileIcon}
                                </div>
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
                  </div>
                ) : showMobilePrices && !showMobileForm ? (
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={handleBackToVehicles}
                        className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                      >
                        ← Volver
                      </button>
                      <h3 className="text-xl font-semibold text-gray-900">
                         Selecciona Duración
                       </h3>
                      <div></div>
                    </div>
                    
                    {/* Vehículo seleccionado */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">{selectedVehicleData.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedVehicleData.name}</h4>
                          <p className="text-sm text-blue-600">{selectedVehicleData.priceFrom}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones de precio */}
                    <div className="grid grid-cols-1 gap-3">
                      {selectedVehicleData.prices.map((priceOption, index) => (
                        <button
                          key={index}
                          onClick={() => handlePriceSelection(priceOption.duration, priceOption.price)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            priceOption.featured
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="text-left">
                              <div className="font-semibold text-gray-900">{priceOption.duration}</div>
                              {priceOption.featured && (
                                <div className="text-xs text-blue-600 font-medium">Más popular</div>
                              )}
                            </div>
                            <div className="text-xl font-bold text-blue-600">{priceOption.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Header paso 3 */}
                     <div className="flex items-center justify-between mb-6">
                       <button
                         type="button"
                         onClick={handleBackToPrices}
                         className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                       >
                         ← Volver
                       </button>
                       <h3 className="text-xl font-semibold text-gray-900">
                          Datos de Reserva
                        </h3>
                       <div></div>
                     </div>

                     {/* Resumen de selección - móvil */}
                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                       <div className="text-center">
                         <div className="flex items-center justify-center gap-3 mb-2">
                           <span className="text-2xl">{selectedVehicleData.icon}</span>
                           <div>
                             <h4 className="font-semibold text-gray-900">{selectedVehicleData.name}</h4>
                             <p className="text-sm text-blue-600 font-medium">{selectedPrice?.duration} - {selectedPrice?.price}</p>
                           </div>
                         </div>
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
                            Duración Seleccionada
                          </Label>
                          <div className="p-3 bg-gray-50 rounded-lg border">
                            <div className="text-sm font-medium text-gray-900">
                              {selectedPrice?.duration}
                            </div>
                            <div className="text-xs text-gray-600">
                              Precio: {selectedPrice?.price}
                            </div>
                          </div>
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

              {/* Vista desktop - Sistema de 3 pasos */}
              <div className="hidden md:block">
                {!showDesktopPrices && !showDesktopForm ? (
                  <div className="text-center">
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-8">
                      {vehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          type="button"
                          onClick={() => handleVehicleSelection(vehicle.id)}
                          className="group relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl border-gray-200 hover:border-blue-300 shadow-md"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="mb-8 transform group-hover:scale-110 transition-transform duration-200 flex justify-center">
                               {vehicle.icon}
                             </div>
                             <div className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                               {vehicle.name}
                             </div>
                             <div className="text-lg font-bold text-blue-600">
                               {vehicle.priceFrom}
                             </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : showDesktopPrices && !showDesktopForm ? (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <button
                        onClick={handleBackToVehicles}
                        className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-lg"
                      >
                        ← Volver a Vehículos
                      </button>
                      <h3 className="text-3xl font-bold text-gray-900">
                         Selecciona Duración y Precio
                       </h3>
                      <div></div>
                    </div>
                    
                    {/* Vehículo seleccionado - desktop */}
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-4xl">{selectedVehicleData.icon}</span>
                        <div className="text-center">
                          <h4 className="text-2xl font-semibold text-gray-900">{selectedVehicleData.name}</h4>
                          <p className="text-lg text-blue-600">{selectedVehicleData.priceFrom}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones de precio - desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {selectedVehicleData.prices.map((priceOption, index) => (
                        <button
                          key={index}
                          onClick={() => handlePriceSelection(priceOption.duration, priceOption.price)}
                          className={`p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            priceOption.featured
                              ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 shadow-md hover:shadow-xl'
                          }`}
                          style={{
                            boxShadow: priceOption.featured 
                              ? '0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)'
                              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 mb-2">{priceOption.duration}</div>
                            {priceOption.featured && (
                              <div className="text-sm text-blue-600 font-medium mb-2">⭐ Más popular</div>
                            )}
                            <div className="text-2xl font-bold text-blue-600">{priceOption.price}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-6">
                     {/* Header paso 3 - desktop */}
                     <div className="flex items-center justify-between mb-8">
                       <button
                         type="button"
                         onClick={handleBackToPrices}
                         className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-lg"
                       >
                         ← Volver a Precios
                       </button>
                       <h3 className="text-3xl font-bold text-gray-900">
                          Completa tu Reserva
                        </h3>
                       <div></div>
                     </div>

                     {/* Resumen de selección - desktop */}
                     <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                       <div className="flex items-center justify-center gap-4">
                         <span className="text-3xl">{selectedVehicleData.icon}</span>
                         <div className="text-center">
                           <h4 className="text-xl font-semibold text-gray-900">{selectedVehicleData.name}</h4>
                           <p className="text-lg text-blue-600 font-medium">{selectedPrice?.duration} - {selectedPrice?.price}</p>
                         </div>
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
                          Duración Seleccionada
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <div className="text-sm font-medium text-gray-900">
                            {selectedPrice?.duration}
                          </div>
                          <div className="text-xs text-gray-600">
                            Precio: {selectedPrice?.price}
                          </div>
                        </div>
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
        </div>
      </div>
    </section>
  )
}

export default QuickRentalSection