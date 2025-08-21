'use client'

import { useEffect, useState } from 'react'

interface IntroVideoProps {
  onComplete: () => void
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const [canShow, setCanShow] = useState(false)

  useEffect(() => {
    // Check if user can view the intro (max 2 times every 12 hours)
    const checkViewLimit = () => {
      const now = Date.now()
      const viewData = localStorage.getItem('introVideoViews')
      
      if (!viewData) {
        // First time viewing
        localStorage.setItem('introVideoViews', JSON.stringify({
          count: 1,
          lastReset: now
        }))
        setCanShow(true)
        return
      }

      const { count, lastReset } = JSON.parse(viewData)
      const twelveHours = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

      if (now - lastReset > twelveHours) {
        // Reset counter after 12 hours
        localStorage.setItem('introVideoViews', JSON.stringify({
          count: 1,
          lastReset: now
        }))
        setCanShow(true)
      } else if (count < 2) {
        // Can still view (less than 2 times)
        localStorage.setItem('introVideoViews', JSON.stringify({
          count: count + 1,
          lastReset
        }))
        setCanShow(true)
      } else {
        // Already viewed 2 times in the last 12 hours
        onComplete()
      }
    }

    checkViewLimit()
  }, [onComplete])

  useEffect(() => {
    if (canShow) {
      // Auto redirect after 4 seconds
      const timer = setTimeout(() => {
        onComplete()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [canShow, onComplete])

  const handleSkip = () => {
    onComplete()
  }

  if (!canShow) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          autoPlay
          muted
          playsInline
          controls={false}
          className="w-1/2 h-auto object-contain"
          style={{
            maxWidth: '50%',
            maxHeight: '50%'
          }}
        >
          <source src="/videopedido.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
        
        <button
          onClick={handleSkip}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs opacity-70 hover:opacity-100 bg-transparent border-none cursor-pointer"
        >
          Saltar intro
        </button>
      </div>
    </div>
  )
}