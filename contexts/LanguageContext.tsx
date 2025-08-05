"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  es: {
    // Header
    'header.rental': 'Alquiler',
    'header.tours': 'Visitas Guiadas',
    'header.shop': 'Tienda',
    'header.contact': 'Contacto',
    'header.scanPrices': 'Rent a Quad',
    
    // Hero Section
    'hero.title': 'Explora con Libertad',
    'hero.subtitle': 'Alquila bicicletas, motos, coches y únete a nuestras visitas guiadas. La aventura te espera en cada rincón.',
    'hero.viewRentals': 'Ver Alquileres',
    'hero.bookTour': 'Reservar Tour',
    
    // Services Section
    'services.title': 'Nuestros Servicios',
    'services.subtitle': 'Descubre todas las opciones que tenemos para hacer tu experiencia inolvidable',
    'services.bikeRental': 'Alquiler de Bicicletas',
    'services.bikeDescription': 'Bicicletas eléctricas, mountain bikes, city bikes y más',
    'services.guidedTours': 'Visitas Guiadas',
    'services.toursDescription': 'Tours y excursiones por los mejores lugares',
    'services.carRental': 'Alquiler de Coches',
    'services.carDescription': 'Desde compactos hasta minibuses de 9 plazas',
    'services.motosScooters': 'Motos y Scooters',
    'services.motosDescription': 'Motos eléctricas, scooters y quads',
    
    // Location Section
    'location.title': 'Donde Estamos',
    'location.subtitle': 'Nos encontramos en el corazón de Torremolinos, listos para tu próxima aventura',
    'location.description': 'Visítanos en nuestra ubicación privilegiada a orillas del mar mediterráneo en Torremolinos donde podrás encontrar todo lo que necesitas para tu aventura.',
    'location.ourLocation': 'Nuestra Ubicación',
    'location.address': 'Calle de la Playa, 22',
    'location.city': '29620 Torremolinos, Málaga',
    'location.country': 'España',
    'location.phone': '+34 655 707 412',
    'location.email': 'info@freeairstreet-rentbike.com',
    'location.hours': 'Lunes a Domingo: 9:00 - 20:00',
    'location.streetView': 'Ver en Street View',
    
    // Prices Section
    'prices.title': 'Precios Destacados',
    'prices.subtitle': 'Algunas de nuestras ofertas más populares',
    'prices.cityBike': 'Bici City',
    'prices.cityBikeDesc': 'Perfecta para paseos urbanos',
    'prices.electricBike': 'Bici Eléctrica',
    'prices.electricBikeDesc': 'Sin esfuerzo, máxima diversión',
    'prices.traditionalScooter': 'Patinete Tradicional',
    'prices.traditionalScooterDesc': 'Ligero y divertido para distancias cortas',
    'prices.hour': '1 hora',
    'prices.allDay': 'Todo el día (11h)',
    'prices.halfHour': '30 min',
    
    // Featured Tours
    'tours.title': 'Tours Destacados',
    'tours.subtitle': 'Descubre nuestras experiencias más populares y vive aventuras inolvidables',
    'tours.dolphinTrip': 'Dolphin Trip',
    'tours.dolphinDesc': 'Avistamiento de delfines en su hábitat natural. Perfecto para familias.',
    'tours.granadaAlhambra': 'Granada Alhambra',
    'tours.granadaDesc': 'Visita la majestuosa Alhambra y los jardines del Generalife.',
    'tours.horseRiding': 'Paseos a Caballo',
    'tours.horseDesc': 'Disfruta de un relajante paseo a caballo por paisajes naturales únicos.',
    'tours.adults': 'Adultos',
    'tours.children': 'Niños: 12€',
    'tours.familyExperience': 'Experiencia familiar',
    'tours.thursdayFriday': 'Jueves y Viernes',
    'tours.unescoHeritage': 'Patrimonio UNESCO',
    'tours.officialGuide': 'Guía oficial incluido',
    'tours.duration': '1.30 horas',
    'tours.onePersonPerHorse': '1 persona por caballo',
    'tours.expertGuide': 'Guía experto incluido',
    'tours.viewAllTours': 'Ver Todos los Tours',
    
    // Contact Section
    'contact.title': 'Contacto',
    'contact.subtitle': '¿Listo para tu próxima aventura? Contáctanos',
    'contact.phone': 'Teléfono',
    'contact.phoneHours': 'Llámanos de 9:00 a 20:00',
    'contact.email': 'Email',
    'contact.emailResponse': 'Respuesta en 24h',
    'contact.location': 'Ubicación',
    
    // Footer
    'footer.rights': '© 2025 Free Air Street. Todos los derechos reservados.',
  },
  en: {
    // Header
    'header.rental': 'Rental',
    'header.tours': 'Guided Tours',
    'header.shop': 'Shop',
    'header.contact': 'Contact',
    'header.scanPrices': 'Rent a Quad',
    
    // Hero Section
    'hero.title': 'Explore with Freedom',
    'hero.subtitle': 'Rent bikes, motorcycles, cars and join our guided tours. Adventure awaits you at every corner.',
    'hero.viewRentals': 'View Rentals',
    'hero.bookTour': 'Book Tour',
    
    // Services Section
    'services.title': 'Our Services',
    'services.subtitle': 'Discover all the options we have to make your experience unforgettable',
    'services.bikeRental': 'Bike Rental',
    'services.bikeDescription': 'Electric bikes, mountain bikes, city bikes and more',
    'services.guidedTours': 'Guided Tours',
    'services.toursDescription': 'Tours and excursions to the best places',
    'services.carRental': 'Car Rental',
    'services.carDescription': 'From compact cars to 9-seater minibuses',
    'services.motosScooters': 'Motorcycles & Scooters',
    'services.motosDescription': 'Electric motorcycles, scooters and quads',
    
    // Location Section
    'location.title': 'Where We Are',
    'location.subtitle': 'We are located in the heart of Torremolinos, ready for your next adventure',
    'location.description': 'Visit us at our privileged location on the shores of the Mediterranean Sea in Torremolinos where you can find everything you need for your adventure.',
    'location.ourLocation': 'Our Location',
    'location.address': 'Calle de la Playa, 22',
    'location.city': '29620 Torremolinos, Málaga',
    'location.country': 'Spain',
    'location.phone': '+34 655 707 412',
    'location.email': 'info@freeairstreet-rentbike.com',
    'location.hours': 'Monday to Sunday: 9:00 - 20:00',
    'location.streetView': 'View in Street View',
    
    // Prices Section
    'prices.title': 'Featured Prices',
    'prices.subtitle': 'Some of our most popular offers',
    'prices.cityBike': 'City Bike',
    'prices.cityBikeDesc': 'Perfect for urban rides',
    'prices.electricBike': 'Electric Bike',
    'prices.electricBikeDesc': 'No effort, maximum fun',
    'prices.traditionalScooter': 'Traditional Scooter',
    'prices.traditionalScooterDesc': 'Light and fun for short distances',
    'prices.hour': '1 hour',
    'prices.allDay': 'All day (11h)',
    'prices.halfHour': '30 min',
    
    // Featured Tours
    'tours.title': 'Featured Tours',
    'tours.subtitle': 'Discover our most popular experiences and live unforgettable adventures',
    'tours.dolphinTrip': 'Dolphin Trip',
    'tours.dolphinDesc': 'Dolphin watching in their natural habitat. Perfect for families.',
    'tours.granadaAlhambra': 'Granada Alhambra',
    'tours.granadaDesc': 'Visit the majestic Alhambra and the Generalife gardens.',
    'tours.horseRiding': 'Horse Riding',
    'tours.horseDesc': 'Enjoy a relaxing horse ride through unique natural landscapes.',
    'tours.adults': 'Adults',
    'tours.children': 'Children: 12€',
    'tours.familyExperience': 'Family experience',
    'tours.thursdayFriday': 'Thursday and Friday',
    'tours.unescoHeritage': 'UNESCO Heritage',
    'tours.officialGuide': 'Official guide included',
    'tours.duration': '1.30 hours',
    'tours.onePersonPerHorse': '1 person per horse',
    'tours.expertGuide': 'Expert guide included',
    'tours.viewAllTours': 'View All Tours',
    
    // Contact Section
    'contact.title': 'Contact',
    'contact.subtitle': 'Ready for your next adventure? Contact us',
    'contact.phone': 'Phone',
    'contact.phoneHours': 'Call us from 9:00 to 20:00',
    'contact.email': 'Email',
    'contact.emailResponse': '24h response',
    'contact.location': 'Location',
    
    // Footer
    'footer.rights': '© 2025 Free Air Street. All rights reserved.',
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}