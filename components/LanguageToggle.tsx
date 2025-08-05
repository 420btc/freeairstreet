"use client"

import { useLanguage } from '../contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-blue-900 hover:text-blue-700 hover:bg-yellow-300/20 transition-colors"
    >
      <Globe className="h-4 w-4 mr-1" />
      <span className="font-medium">{language.toUpperCase()}</span>
    </Button>
  )
}