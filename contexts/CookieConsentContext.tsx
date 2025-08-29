'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CookieConsentContextType {
  showBanner: boolean
  acceptedCookies: boolean
  acceptAllCookies: () => void
  denyCookies: () => void
  showPreferences: () => void
  hideBanner: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider')
  }
  return context
}

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showBanner, setShowBanner] = useState(false)
  const [acceptedCookies, setAcceptedCookies] = useState(false)

  useEffect(() => {
    // Verificar si ya se ha dado consentimiento
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      setAcceptedCookies(consent === 'accepted')
    }
  }, [])

  const acceptAllCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setAcceptedCookies(true)
    setShowBanner(false)
    
    // Aquí puedes activar Google Analytics, Facebook Pixel, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      })
    }
  }

  const denyCookies = () => {
    localStorage.setItem('cookie-consent', 'denied')
    setAcceptedCookies(false)
    setShowBanner(false)
    
    // Denegar cookies de seguimiento
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      })
    }
  }

  const showPreferences = () => {
    // Aquí podrías abrir un modal de preferencias más detallado
    console.log('Mostrar preferencias de cookies')
  }

  const hideBanner = () => {
    setShowBanner(false)
  }

  return (
    <CookieConsentContext.Provider
      value={{
        showBanner,
        acceptedCookies,
        acceptAllCookies,
        denyCookies,
        showPreferences,
        hideBanner
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

// Tipos para gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}