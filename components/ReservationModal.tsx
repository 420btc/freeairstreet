"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Mail, Phone, MapPin, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendReservationEmail, type ReservationFormData } from "@/lib/emailjs"
import { useInventory } from "@/contexts/InventoryContext"

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  type: "rental" | "tour"
  itemName?: string
  itemPrice?: string
  itemDuration?: string
  itemId?: string
  prefillData?: {
    name?: string
    email?: string
    phone?: string
    date?: string
    time?: string
    participants?: string
    pickupLocation?: string
    comments?: string
  }
}

export function ReservationModal({ isOpen, onClose, type, itemName, itemPrice, itemDuration, itemId, prefillData }: ReservationModalProps) {
  const { makeReservation } = useInventory()
  const [formData, setFormData] = useState({
    name: prefillData?.name || "",
    email: prefillData?.email || "",
    phone: prefillData?.phone || "",
    date: prefillData?.date || new Date().toISOString().split('T')[0],
    time: prefillData?.time || "",
    duration: itemDuration || "",
    participants: prefillData?.participants || "1",
    pickupLocation: prefillData?.pickupLocation || "",
    comments: prefillData?.comments || ""
  })

  // Update form data when props change
  useEffect(() => {
    setFormData({
      name: prefillData?.name || "",
      email: prefillData?.email || "",
      phone: prefillData?.phone || "",
      date: prefillData?.date || new Date().toISOString().split('T')[0],
      time: prefillData?.time || "",
      duration: itemDuration || "",
      participants: prefillData?.participants || "1",
      pickupLocation: prefillData?.pickupLocation || "",
      comments: prefillData?.comments || ""
    })
  }, [itemDuration, prefillData])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const reservationData: ReservationFormData = {
        ...formData,
        type,
        itemName: itemName || '',
        itemPrice: itemPrice || ''
      }

      const result = await sendReservationEmail(reservationData)
      
      if (result.success) {
        // Si es un alquiler y tenemos itemId, hacer la reserva en el inventario
        if (type === 'rental' && itemId && formData.duration) {
          const reservationId = makeReservation(itemId, formData.duration, {
            name: formData.name,
            email: formData.email
          })
          
          if (!reservationId) {
            setSubmitError('No hay stock disponible para este vehículo.')
            return
          }
        }
        
        setIsSubmitted(true)
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: new Date().toISOString().split('T')[0],
          time: "",
          duration: "",
          participants: "1",
          pickupLocation: "",
          comments: ""
        })
      } else {
        const errorMsg = result.error || 'Error al enviar la reserva. Por favor, inténtalo de nuevo.'
        setSubmitError(errorMsg)
        console.error('Detalles del error:', result.details)
      }
    } catch (error) {
      console.error('Error submitting reservation:', error)
      setSubmitError('Error al enviar la reserva. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setSubmitError(null)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  const isRental = type === "rental"
  const title = isRental ? "Reservar Alquiler" : "Reservar Excursión"
  const subtitle = isRental ? "Completa el formulario para alquilar" : "Completa el formulario para tu excursión"

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-lg my-4 sm:my-8 bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 border-2 border-blue-600 shadow-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white relative -m-6 mb-0 p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center">
              <CardTitle className="text-3xl font-bold mb-1">
                {isSubmitted ? "¡Reserva Enviada!" : title}
              </CardTitle>
              {itemName && !isSubmitted && (
                <div className="mt-1">
                  <p className="text-3xl font-semibold text-white mb-0 border-b-2 border-yellow-400 pb-1 inline-block">{itemName}</p>
                  {itemDuration && itemPrice && (
                    <p className="text-lg font-medium mt-2 text-center flex items-center justify-center"><span className="text-3xl font-bold text-white">{itemDuration}</span> <span className="mx-2 text-xl">=</span> <span className="text-3xl font-bold text-yellow-300">{itemPrice}</span></p>
                  )}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-8 w-8 sm:h-8 sm:w-8 md:h-8 md:w-8 p-0 ml-4 flex-shrink-0 absolute top-3 right-6"
            >
              <X className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                ¡Reserva enviada exitosamente!
              </h3>
              <p className="text-gray-600 mb-4">
                Hemos recibido tu solicitud de {type === "rental" ? "alquiler" : "excursión"}.
                Te contactaremos pronto para confirmar los detalles.
              </p>
              
              {/* Video de confirmación */}
              <div className="my-6">
                <video 
                  width="100%" 
                  height="auto" 
                  controls 
                  autoPlay 
                  className="rounded-lg shadow-lg max-w-md mx-auto"
                >
                  <source src="/videopedido.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
              
              <Button onClick={handleClose} className="mt-4">
                Cerrar
              </Button>
            </div>
          ) : (
            <>
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Detalles de la Reserva */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Detalles de la Reserva
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">Hora preferida (Opcional)</Label>
                  <Select onValueChange={(value) => handleInputChange("time", value)} value={formData.time}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue placeholder="Selecciona hora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isRental && (
                  <div>
                    <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">Duración *</Label>
                    {itemDuration ? (
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                        placeholder="Duración seleccionada"
                      />
                    ) : (
                      <Select onValueChange={(value) => handleInputChange("duration", value)} value={formData.duration}>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                          <SelectValue placeholder="Selecciona duración" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 hora</SelectItem>
                          <SelectItem value="2h">2 horas</SelectItem>
                          <SelectItem value="3h">3 horas</SelectItem>
                          <SelectItem value="4h">4 horas</SelectItem>
                          <SelectItem value="6h">6 horas</SelectItem>
                          <SelectItem value="1d">1 día completo</SelectItem>
                          <SelectItem value="2d">2 días</SelectItem>
                          <SelectItem value="3d">3 días</SelectItem>
                          <SelectItem value="1w">1 semana</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="participants" className="text-gray-700 dark:text-gray-300">
                    {isRental ? "Número de vehículos" : "Número de participantes"} *
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("participants", value)} defaultValue="1">
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isRental && (
                <div>
                  <Label htmlFor="pickupLocation" className="text-gray-700 dark:text-gray-300">Lugar de recogida preferido</Label>
                  <Select onValueChange={(value) => handleInputChange("pickupLocation", value)} value={formData.pickupLocation}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue placeholder="Selecciona ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tienda">Nuestra tienda - Calle de la Playa 22, Torremolinos</SelectItem>
                      <SelectItem value="hotel">Mi hotel (especificar en comentarios)</SelectItem>
                      <SelectItem value="aeropuerto">Aeropuerto de Málaga</SelectItem>
                      <SelectItem value="estacion">Estación de tren/autobús</SelectItem>
                      <SelectItem value="otro">Otro lugar (especificar en comentarios)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Comentarios adicionales */}
            <div>
              <Label htmlFor="comments" className="text-gray-700 dark:text-gray-300">Comentarios adicionales</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                placeholder={isRental ? "Especifica detalles sobre la recogida, preferencias del vehículo, etc." : "Menciona cualquier requerimiento especial, alergias, etc."}
                className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 min-h-[100px]"
              />
            </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-medium py-3"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : (isRental ? "Confirmar Alquiler" : "Confirmar Reserva")}
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}