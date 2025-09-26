"use client"

import { useState } from "react"
import { X, MapPin, Clock, CheckCircle, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TourConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  tourName: string
  isEnglish?: boolean
}

export function TourConfirmationModal({ isOpen, onClose, tourName, isEnglish = false }: TourConfirmationModalProps) {
  if (!isOpen) return null

  const translations = {
    es: {
      title: "¡Reserva Confirmada!",
      subtitle: "Tu excursión ha sido reservada exitosamente",
      tourReserved: "Excursión reservada:",
      importantInfo: "Información Importante",
      storeVisitTitle: "Confirmación Final de Reserva",
      storeVisitMessage: "Para confirmar al 100% tu reserva, te recomendamos visitar nuestra tienda física:",
      storeAddress: "Calle de la Playa 22, Torremolinos",
      storeHours: "Horario: Lunes a Domingo de 9:00 a 22:00",
      whyVisit: "¿Por qué visitar la tienda?",
      reasons: [
        "Confirmar detalles específicos de tu excursión",
        "Recibir información adicional y recomendaciones",
        "Resolver cualquier duda o consulta",
        "Garantizar tu plaza en la excursión"
      ],
      contactInfo: "También puedes contactarnos:",
      phone: "Teléfono: +34 XXX XXX XXX",
      email: "Email: rentairstreet@gmail.com",
      close: "Entendido",
      thankYou: "¡Gracias por elegir Free Air Street!"
    },
    en: {
      title: "Booking Confirmed!",
      subtitle: "Your tour has been successfully booked",
      tourReserved: "Tour reserved:",
      importantInfo: "Important Information",
      storeVisitTitle: "Final Booking Confirmation",
      storeVisitMessage: "To confirm your booking 100%, we recommend visiting our physical store:",
      storeAddress: "Calle de la Playa 22, Torremolinos",
      storeHours: "Hours: Monday to Sunday from 9:00 to 22:00",
      whyVisit: "Why visit the store?",
      reasons: [
        "Confirm specific details of your tour",
        "Receive additional information and recommendations",
        "Resolve any questions or queries",
        "Guarantee your spot on the tour"
      ],
      contactInfo: "You can also contact us:",
      phone: "Phone: +34 XXX XXX XXX",
      email: "Email: rentairstreet@gmail.com",
      close: "Understood",
      thankYou: "Thank you for choosing Free Air Street!"
    }
  }

  const t = translations[isEnglish ? 'en' : 'es']

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
                <p className="text-green-100 mt-1">{t.subtitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Tour confirmado */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800 dark:text-green-200">{t.tourReserved}</h3>
            </div>
            <p className="text-green-700 dark:text-green-300 font-medium">{tourName}</p>
          </div>

          {/* Información importante */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">{t.storeVisitTitle}</h3>
            </div>
            
            <p className="text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
              {t.storeVisitMessage}
            </p>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.storeAddress}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.storeHours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">{t.whyVisit}</h4>
              <ul className="space-y-2">
                {t.reasons.map((reason, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-blue-700 dark:text-blue-300 text-sm">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{t.contactInfo}</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{t.phone}</p>
              <p>{t.email}</p>
            </div>
          </div>

          {/* Mensaje de agradecimiento */}
          <div className="text-center py-4">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {t.thankYou}
            </p>
            <Button 
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              {t.close}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}