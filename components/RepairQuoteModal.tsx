"use client"

import { useState } from "react"
import { X, Wrench, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendContactEmail, type ContactFormData } from "@/lib/emailjs"

interface RepairQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  repairType: string
  repairTitle: string
}

export function RepairQuoteModal({ isOpen, onClose, repairType, repairTitle }: RepairQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleBrand: "",
    vehicleModel: "",
    problemDescription: "",
    urgency: "",
    preferredContact: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const contactData: ContactFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Solicitud de presupuesto - ${repairTitle}`,
        message: `Tipo de reparación: ${repairTitle}\n\nDetalles del vehículo:\n- Marca: ${formData.vehicleBrand}\n- Modelo: ${formData.vehicleModel}\n\nDescripción del problema:\n${formData.problemDescription}\n\nUrgencia: ${formData.urgency}\nMétodo de contacto preferido: ${formData.preferredContact}`
      }

      const result = await sendContactEmail(contactData)
      
      if (result.success) {
        setIsSubmitted(true)
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          vehicleBrand: "",
          vehicleModel: "",
          problemDescription: "",
          urgency: "",
          preferredContact: ""
        })
      } else {
        const errorMsg = result.error || 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.'
        setSubmitError(errorMsg)
        console.error('Detalles del error:', result.details)
      }
    } catch (error) {
      console.error('Error submitting repair quote request:', error)
      setSubmitError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-lg my-4 sm:my-8 bg-white dark:bg-gray-900 border-2 border-blue-600 shadow-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white relative p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center mb-2">
                <Wrench className="h-6 w-6 mr-2 text-yellow-400" />
                <CardTitle className="text-2xl font-bold">
                  {isSubmitted ? "¡Solicitud Enviada!" : "Solicitar Presupuesto"}
                </CardTitle>
              </div>
              {!isSubmitted && (
                <p className="text-xl font-semibold text-yellow-400">{repairTitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0 ml-4 flex-shrink-0 absolute top-4 right-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-4 bg-white dark:bg-gray-900">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                ¡Solicitud enviada exitosamente!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Hemos recibido tu solicitud de presupuesto para {repairTitle.toLowerCase()}.
                Te contactaremos pronto con un presupuesto detallado.
              </p>
              <Button 
                onClick={handleClose} 
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              >
                Cerrar
              </Button>
            </div>
          ) : (
            <>
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-600">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                    <p className="text-red-700 dark:text-red-300">{submitError}</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-yellow-400" />
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
                        className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
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
                        className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
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
                      className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Información del Vehículo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-yellow-400" />
                    Información del Vehículo
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleBrand" className="text-gray-700 dark:text-gray-300">Marca del vehículo *</Label>
                      <Input
                        id="vehicleBrand"
                        value={formData.vehicleBrand}
                        onChange={(e) => handleInputChange("vehicleBrand", e.target.value)}
                        required
                        placeholder="Ej: Xiaomi, Segway, Trek..."
                        className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="vehicleModel" className="text-gray-700 dark:text-gray-300">Modelo del vehículo</Label>
                      <Input
                        id="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
                        placeholder="Ej: Mi Electric Scooter Pro 2"
                        className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción del Problema */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
                    Descripción del Problema
                  </h3>
                  <div>
                    <Label htmlFor="problemDescription" className="text-gray-700 dark:text-gray-300">Describe el problema *</Label>
                    <Textarea
                      id="problemDescription"
                      value={formData.problemDescription}
                      onChange={(e) => handleInputChange("problemDescription", e.target.value)}
                      required
                      placeholder="Describe detalladamente el problema que presenta tu vehículo..."
                      className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="urgency" className="text-gray-700 dark:text-gray-300">Urgencia *</Label>
                      <Select onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500">
                          <SelectValue placeholder="Selecciona urgencia" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="baja" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Baja - No hay prisa</SelectItem>
                          <SelectItem value="media" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Media - En unos días</SelectItem>
                          <SelectItem value="alta" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Alta - Lo antes posible</SelectItem>
                          <SelectItem value="urgente" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Urgente - Hoy mismo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="preferredContact" className="text-gray-700 dark:text-gray-300">Contacto preferido *</Label>
                      <Select onValueChange={(value) => handleInputChange("preferredContact", value)}>
                        <SelectTrigger className="bg-white dark:bg-black border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500">
                          <SelectValue placeholder="Selecciona método" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="telefono" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Teléfono</SelectItem>
                          <SelectItem value="email" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">Email</SelectItem>
                          <SelectItem value="whatsapp" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium py-3"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar Presupuesto"}
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