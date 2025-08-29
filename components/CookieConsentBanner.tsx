'use client'

import React from 'react'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import { Button } from '@/components/ui/button'
import { X, Cookie, Settings, FileText, Shield, Scale } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const CookieConsentBanner: React.FC = () => {
  const { showBanner, acceptAllCookies, denyCookies, showPreferences, hideBanner } = useCookieConsent()
  const { t } = useLanguage()

  if (!showBanner) return null



  return (
    <>
      {/* Banner principal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Versión móvil - barra vertical mínima */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Cookie className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-gray-700 dark:text-gray-300 truncate">
                {t('cookies.shortDescription')}
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                onClick={acceptAllCookies}
                size="sm"
                className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
              >
                {t('cookies.accept')}
              </Button>
              <Button
                onClick={denyCookies}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
              >
                {t('cookies.deny')}
              </Button>
            </div>
          </div>
          
          {/* Enlaces adicionales en móvil */}
          <div className="flex justify-center gap-3 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={showPreferences}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              {t('cookies.preferences')}
            </button>
            <a
              href="/politica-cookies"
              className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              {t('cookies.cookiePolicy')}
            </a>
            <a
              href="/politica-privacidad"
              className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              {t('cookies.privacyPolicy')}
            </a>
          </div>
        </div>

        {/* Versión desktop - banner compacto horizontal */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Contenido principal compacto */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Cookie className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {t('cookies.title')}
                </h3>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 flex-1">
                {t('cookies.description')}
              </p>
            </div>

            {/* Enlaces de políticas compactos */}
            <div className="hidden lg:flex gap-3 text-xs flex-shrink-0">
              <a
                href="/politica-cookies"
                className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                {t('cookies.cookiePolicy')}
              </a>
              <a
                href="/politica-privacidad"
                className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                {t('cookies.privacyPolicy')}
              </a>
              <a
                href="/aviso-legal"
                className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                {t('cookies.legalNotice')}
              </a>
            </div>

            {/* Botones de acción compactos */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={showPreferences}
                variant="ghost"
                size="sm"
                className="text-xs px-2 h-7 hidden sm:flex items-center gap-1"
              >
                <Settings className="h-3 w-3" />
                {t('cookies.preferences')}
              </Button>
              <Button
                onClick={denyCookies}
                variant="outline"
                size="sm"
                className="text-xs px-3 h-7"
              >
                {t('cookies.deny')}
              </Button>
              <Button
                onClick={acceptAllCookies}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 h-7"
              >
                {t('cookies.accept')}
              </Button>
              
              {/* Botón cerrar */}
              <button
                onClick={hideBanner}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-1"
                aria-label="Cerrar banner de cookies"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CookieConsentBanner