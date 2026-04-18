"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type PriceData = Record<string, string>

interface PricingContextType {
  prices: PriceData
  updatePrice: (id: string, newPrice: string, category?: string, name?: string) => Promise<void>
  getPrice: (id: string, defaultPrice: string) => string
  isLoading: boolean
}

const PricingContext = createContext<PricingContextType | undefined>(undefined)

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<PriceData>({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetch prices from Neon DB via API on mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/prices')
        if (response.ok) {
          const data = await response.json()
          setPrices(data)
        }
      } catch (error) {
        console.error('Failed to fetch prices from DB:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPrices()
  }, [])

  const updatePrice = async (id: string, newPrice: string, category?: string, name?: string) => {
    // Optimistic update
    const updated = { ...prices, [id]: newPrice }
    setPrices(updated)
    
    try {
      // Save to Neon DB via API
      const response = await fetch('/api/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, price: newPrice, category, name }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save to DB')
      }
    } catch (error) {
      console.error('Error saving price:', error)
      // Rollback logic could be implemented here if needed
    }
  }

  const getPrice = (id: string, defaultPrice: string) => {
    // Always return defaultPrice during SSR to avoid hydration mismatch
    // But since this is client side, we use the loaded prices
    if (isLoading && !prices[id]) return defaultPrice
    return prices[id] || defaultPrice
  }

  return (
    <PricingContext.Provider value={{ prices, updatePrice, getPrice, isLoading }}>
      {children}
    </PricingContext.Provider>
  )
}

export function usePricing() {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error('usePricing must be used within a PricingProvider')
  }
  return context
}
