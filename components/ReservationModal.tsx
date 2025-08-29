"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Mail, Phone, MapPin, Clock, Users, CheckCircle, Languages, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
    comments: prefillData?.comments || "",
    dni: ""
  })
  
  const [confirmations, setConfirmations] = useState({
    purchaseInfo: false,
    dniRequired: false,
    dataPolicy: false
  })
  
  const [showDataPolicy, setShowDataPolicy] = useState(false)
  const [dniError, setDniError] = useState("")

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
      comments: prefillData?.comments || "",
      dni: ""
    })
  }, [itemDuration, prefillData])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isEnglish, setIsEnglish] = useState(false)
  const [submittedInEnglish, setSubmittedInEnglish] = useState(false)

  // Función para validar DNI español
  const validateDNI = (dni: string): boolean => {
    // Limpiar espacios y convertir a mayúsculas
    const cleanDNI = dni.replace(/\s/g, '').toUpperCase()
    
    // Patrones válidos: 12345678A, A12345678, 12345678 A
    const dniPattern = /^([0-9]{8}[A-Z]|[A-Z][0-9]{8}|[0-9]{8}\s[A-Z])$/
    
    if (!dniPattern.test(cleanDNI)) {
      return false
    }
    
    // Extraer números y letra
    let numbers = ''
    let letter = ''
    
    if (/^[0-9]{8}[A-Z]$/.test(cleanDNI)) {
      numbers = cleanDNI.substring(0, 8)
      letter = cleanDNI.substring(8, 9)
    } else if (/^[A-Z][0-9]{8}$/.test(cleanDNI)) {
      letter = cleanDNI.substring(0, 1)
      numbers = cleanDNI.substring(1, 9)
    } else {
      numbers = cleanDNI.substring(0, 8)
      letter = cleanDNI.substring(9, 10)
    }
    
    // Validar letra de control
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
    const expectedLetter = letters[parseInt(numbers) % 23]
    
    return letter === expectedLetter
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setDniError("")
    
    // Validar DNI (solo para formatos españoles, otros países pueden usar cualquier formato)
     if (formData.dni.length < 5) {
       setDniError("Por favor, introduce un documento de identidad válido")
       setIsSubmitting(false)
       return
     }
    
    // Validar confirmaciones
    if (!confirmations.purchaseInfo || !confirmations.dniRequired || !confirmations.dataPolicy) {
      setSubmitError("Debes aceptar todas las condiciones para continuar.")
      setIsSubmitting(false)
      return
    }

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
        
        // Guardar el idioma en el que se envió la reserva
        setSubmittedInEnglish(isEnglish)
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
          comments: "",
          dni: ""
        })
        setConfirmations({
          purchaseInfo: false,
          dniRequired: false,
          dataPolicy: false
        })
        setDniError("")
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
    setSubmittedInEnglish(false)
    setConfirmations({
      purchaseInfo: false,
      dniRequired: false,
      dataPolicy: false
    })
    setDniError("")
    setShowDataPolicy(false)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  const isRental = type === "rental"
  
  // Traducciones
  const translations = {
    es: {
      title: isRental ? "Reservar Alquiler" : "Reservar Excursión",
      subtitle: isRental ? "Completa el formulario para alquilar" : "Completa el formulario para tu excursión",
      reservationSent: "¡Reserva Enviada!",
      personalInfo: "Información Personal",
      fullName: "Nombre completo *",
      email: "Email *",
      phone: "Teléfono *",
      dni: "DNI / ID *",
      reservationDetails: "Detalles de la Reserva",
      date: "Fecha *",
      preferredTime: "Hora preferida (Opcional)",
      selectTime: "Selecciona hora",
      duration: "Duración *",
      selectedDuration: "Duración seleccionada",
      selectDuration: "Selecciona duración",
      numberOfVehicles: "Número de vehículos",
      numberOfParticipants: "Número de participantes",
      pickupLocation: "Lugar de recogida preferido",
      selectLocation: "Selecciona ubicación",
      additionalComments: "Comentarios adicionales",
      rentalPlaceholder: "Especifica detalles sobre la recogida, preferencias del vehículo, etc.",
      tourPlaceholder: "Menciona cualquier requerimiento especial, alergias, etc.",
      cancel: "Cancelar",
      confirmRental: "Confirmar Alquiler",
      confirmReservation: "Confirmar Reserva",
      sending: "Enviando...",
      close: "Cerrar",
      reservationSentSuccess: "¡Reserva enviada exitosamente!",
      reservationReceived: "Hemos recibido tu solicitud de",
      rental: "alquiler",
      tour: "excursión",
      contactSoon: "Te contactaremos pronto para confirmar los detalles.",
      videoNotSupported: "Tu navegador no soporta el elemento de video.",
      durations: {
        "1h": "1 hora",
        "2h": "2 horas",
        "3h": "3 horas",
        "4h": "4 horas",
        "6h": "6 horas",
        "1d": "1 día completo",
        "2d": "2 días",
        "3d": "3 días",
        "1w": "1 semana"
      },
      locations: {
        tienda: "Nuestra tienda - Calle de la Playa 22, Torremolinos",
        hotel: "Mi hotel (especificar en comentarios)",
        aeropuerto: "Aeropuerto de Málaga",
        estacion: "Estación de tren/autobús",
        otro: "Otro lugar (especificar en comentarios)"
      },
      confirmations: {
        purchaseInfo: "Confirmo que estoy realizando la reserva de",
        dniRequired: "Entiendo que debo presentar mi DNI antes de recoger el vehículo/iniciar la excursión",
        dataPolicy: "Acepto la política de protección de datos",
        seeMore: "Ver más",
        dataProtectionTitle: "Política de Protección de Datos",
        dataProtectionText: "De conformidad con la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) y el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016 (RGPD), le informamos que sus datos personales serán tratados por Free Air Street con la finalidad de gestionar su reserva y prestar el servicio solicitado. Sus datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar de dicha finalidad. No se cederán datos a terceros, salvo obligación legal. Puede ejercer sus derechos de acceso, rectificación, supresión, portabilidad, limitación y oposición dirigiéndose a nuestras oficinas o enviando un correo electrónico a protecciondatos@freeairstreet.com junto con copia de su DNI."
      }
    },
    en: {
      title: isRental ? "Book Rental" : "Book Tour",
      subtitle: isRental ? "Complete the form to rent" : "Complete the form for your tour",
      reservationSent: "Reservation Sent!",
      personalInfo: "Personal Information",
      fullName: "Full name *",
      email: "Email *",
      phone: "Phone *",
      dni: "DNI / ID *",
      reservationDetails: "Reservation Details",
      date: "Date *",
      preferredTime: "Preferred time (Optional)",
      selectTime: "Select time",
      duration: "Duration *",
      selectedDuration: "Selected duration",
      selectDuration: "Select duration",
      numberOfVehicles: "Number of vehicles",
      numberOfParticipants: "Number of participants",
      pickupLocation: "Preferred pickup location",
      selectLocation: "Select location",
      additionalComments: "Additional comments",
      rentalPlaceholder: "Specify pickup details, vehicle preferences, etc.",
      tourPlaceholder: "Mention any special requirements, allergies, etc.",
      cancel: "Cancel",
      confirmRental: "Confirm Rental",
      confirmReservation: "Confirm Reservation",
      sending: "Sending...",
      close: "Close",
      reservationSentSuccess: "Reservation sent successfully!",
      reservationReceived: "We have received your",
      rental: "rental",
      tour: "tour",
      contactSoon: "request. We will contact you soon to confirm the details.",
      videoNotSupported: "Your browser does not support the video element.",
      durations: {
        "1h": "1 hour",
        "2h": "2 hours",
        "3h": "3 hours",
        "4h": "4 hours",
        "6h": "6 hours",
        "1d": "1 full day",
        "2d": "2 days",
        "3d": "3 days",
        "1w": "1 week"
      },
      locations: {
        tienda: "Our store - Calle de la Playa 22, Torremolinos",
        hotel: "My hotel (specify in comments)",
        aeropuerto: "Málaga Airport",
        estacion: "Train/bus station",
        otro: "Other location (specify in comments)"
      },
      confirmations: {
        purchaseInfo: "I confirm that I am making a reservation for",
        dniRequired: "I understand that I must present my ID document before picking up the vehicle/starting the tour",
        dataPolicy: "I accept the data protection policy",
        seeMore: "See more",
        dataProtectionTitle: "Data Protection Policy",
        dataProtectionText: "In accordance with Organic Law 3/2018, of December 5, on Personal Data Protection and guarantee of digital rights (LOPDGDD) and Regulation (EU) 2016/679 of the European Parliament and of the Council of April 27, 2016 (GDPR), we inform you that your personal data will be processed by Free Air Street for the purpose of managing your reservation and providing the requested service. Your data will be kept for the time necessary to fulfill the purpose for which it was collected and to determine any possible responsibilities that may arise from said purpose. Data will not be transferred to third parties, except legal obligation. You can exercise your rights of access, rectification, deletion, portability, limitation and opposition by contacting our offices or sending an email to protecciondatos@freeairstreet.com along with a copy of your ID."
      }
    }
  }
  
  // Usar el idioma de envío para la confirmación, o el idioma actual para el formulario
  const currentLanguage = isSubmitted ? submittedInEnglish : isEnglish
  const t = translations[currentLanguage ? 'en' : 'es']
  const title = t.title
  const subtitle = t.subtitle

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-lg my-4 sm:my-8 bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 border-2 border-blue-600 shadow-2xl overflow-hidden">
        <CardHeader className="bg-blue-600 text-white relative -m-6 mb-0 p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-center">
              <CardTitle className="text-3xl font-bold mb-1">
                {isSubmitted ? t.reservationSent : title}
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
            <div className="flex items-center gap-2 ml-4 flex-shrink-0 absolute top-3 right-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEnglish(!isEnglish)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                title={isEnglish ? "Cambiar a Español" : "Switch to English"}
              >
                <Languages className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {t.reservationSentSuccess}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.reservationReceived} {type === "rental" ? t.rental : t.tour}{isEnglish ? " " + t.contactSoon : ". " + t.contactSoon}
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
                  {t.videoNotSupported}
                </video>
              </div>
              
              <Button onClick={handleClose} className="mt-4">
                {t.close}
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
                {t.personalInfo}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">{t.fullName}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">{t.email}</Label>
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
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">{t.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                />
              </div>
              
              <div>
                <Label htmlFor="dni" className="text-gray-700 dark:text-gray-300">{t.dni}</Label>
                <Input
                  id="dni"
                  type="text"
                  value={formData.dni}
                  onChange={(e) => {
                    handleInputChange("dni", e.target.value)
                    setDniError("")
                  }}
                  required
                  placeholder="DNI, ID, Passport..."
                  className={`border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 ${
                    dniError ? 'border-red-500' : ''
                  }`}
                />
                {dniError && (
                  <p className="text-red-500 text-sm mt-1">{dniError}</p>
                )}
              </div>
            </div>

            {/* Detalles de la Reserva */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                {t.reservationDetails}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">{t.date}</Label>
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
                  <Label htmlFor="time" className="text-gray-700 dark:text-gray-300">{t.preferredTime}</Label>
                  <Select onValueChange={(value) => handleInputChange("time", value)} value={formData.time}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue placeholder={t.selectTime} />
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
                    <Label htmlFor="duration" className="text-gray-700 dark:text-gray-300">{t.duration}</Label>
                    {itemDuration ? (
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                        className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                        placeholder={t.selectedDuration}
                      />
                    ) : (
                      <Select onValueChange={(value) => handleInputChange("duration", value)} value={formData.duration}>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                          <SelectValue placeholder={t.selectDuration} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">{t.durations["1h"]}</SelectItem>
                          <SelectItem value="2h">{t.durations["2h"]}</SelectItem>
                          <SelectItem value="3h">{t.durations["3h"]}</SelectItem>
                          <SelectItem value="4h">{t.durations["4h"]}</SelectItem>
                          <SelectItem value="6h">{t.durations["6h"]}</SelectItem>
                          <SelectItem value="1d">{t.durations["1d"]}</SelectItem>
                          <SelectItem value="2d">{t.durations["2d"]}</SelectItem>
                          <SelectItem value="3d">{t.durations["3d"]}</SelectItem>
                          <SelectItem value="1w">{t.durations["1w"]}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
                
                <div>
                  <Label htmlFor="participants" className="text-gray-700 dark:text-gray-300">
                    {isRental ? t.numberOfVehicles : t.numberOfParticipants} *
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
                  <Label htmlFor="pickupLocation" className="text-gray-700 dark:text-gray-300">{t.pickupLocation}</Label>
                  <Select onValueChange={(value) => handleInputChange("pickupLocation", value)} value={formData.pickupLocation}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue placeholder={t.selectLocation} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tienda">{t.locations.tienda}</SelectItem>
                      <SelectItem value="hotel">{t.locations.hotel}</SelectItem>
                      <SelectItem value="aeropuerto">{t.locations.aeropuerto}</SelectItem>
                      <SelectItem value="estacion">{t.locations.estacion}</SelectItem>
                      <SelectItem value="otro">{t.locations.otro}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Comentarios adicionales */}
            <div>
              <Label htmlFor="comments" className="text-gray-700 dark:text-gray-300">{t.additionalComments}</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                placeholder={isRental ? t.rentalPlaceholder : t.tourPlaceholder}
                className="border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 min-h-[100px]"
              />
            </div>

            {/* Casillas de Confirmación */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white">Confirmaciones requeridas</h4>
              
              {/* Confirmación de compra */}
               <div className="flex items-start space-x-2">
                 <Checkbox
                   id="purchaseInfo"
                   checked={confirmations.purchaseInfo}
                   onCheckedChange={(checked) => 
                     setConfirmations(prev => ({ ...prev, purchaseInfo: !!checked }))
                   }
                   className="mt-0.5"
                 />
                 <div className="flex-1">
                   <Label htmlFor="purchaseInfo" className="text-xs text-gray-600 dark:text-gray-400 leading-tight cursor-pointer">
                     {t.confirmations.purchaseInfo} <strong>{itemName}</strong> {itemPrice && `por ${itemPrice}`} {itemDuration && `durante ${itemDuration}`}.
                   </Label>
                 </div>
               </div>
               
               {/* Confirmación DNI */}
               <div className="flex items-start space-x-2">
                 <Checkbox
                   id="dniRequired"
                   checked={confirmations.dniRequired}
                   onCheckedChange={(checked) => 
                     setConfirmations(prev => ({ ...prev, dniRequired: !!checked }))
                   }
                   className="mt-0.5"
                 />
                 <div className="flex-1">
                   <Label htmlFor="dniRequired" className="text-xs text-gray-700 dark:text-gray-300 leading-tight cursor-pointer">
                     {t.confirmations.dniRequired}
                   </Label>
                 </div>
               </div>
               
               {/* Política de datos */}
               <div className="flex items-start space-x-2">
                 <Checkbox
                   id="dataPolicy"
                   checked={confirmations.dataPolicy}
                   onCheckedChange={(checked) => 
                     setConfirmations(prev => ({ ...prev, dataPolicy: !!checked }))
                   }
                   className="mt-0.5"
                 />
                 <div className="flex-1">
                   <Label htmlFor="dataPolicy" className="text-xs text-gray-700 dark:text-gray-300 leading-tight cursor-pointer">
                     {t.confirmations.dataPolicy}
                   </Label>
                   <Button
                     type="button"
                     variant="link"
                     onClick={() => setShowDataPolicy(true)}
                     className="text-blue-600 hover:text-blue-800 p-0 h-auto text-xs underline ml-1"
                   >
                     {t.confirmations.seeMore}
                   </Button>
                 </div>
               </div>
            </div>

            {/* Modal de Política de Datos */}
            {showDataPolicy && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t.confirmations.dataProtectionTitle}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowDataPolicy(false)}
                      className="p-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t.confirmations.dataProtectionText}
                  </p>
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setShowDataPolicy(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            )}

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 font-medium py-3"
                  >
                    {t.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !confirmations.purchaseInfo || !confirmations.dniRequired || !confirmations.dataPolicy}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t.sending : (isRental ? t.confirmRental : t.confirmReservation)}
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