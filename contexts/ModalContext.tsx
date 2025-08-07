"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
  isReservationModalOpen: boolean
  reservationModalData: {
    type: 'rental' | 'tour' | 'appointment'
    itemName?: string
    itemPrice?: string
    itemDuration?: string
  }
  openReservationModal: (data: {
    type: 'rental' | 'tour' | 'appointment'
    itemName?: string
    itemPrice?: string
    itemDuration?: string
  }) => void
  closeReservationModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [reservationModalData, setReservationModalData] = useState<{
    type: 'rental' | 'tour' | 'appointment'
    itemName?: string
    itemPrice?: string
    itemDuration?: string
  }>({ type: 'rental' })

  const openReservationModal = (data: {
    type: 'rental' | 'tour' | 'appointment'
    itemName?: string
    itemPrice?: string
    itemDuration?: string
  }) => {
    setReservationModalData(data)
    setIsReservationModalOpen(true)
  }

  const closeReservationModal = () => {
    setIsReservationModalOpen(false)
  }

  return (
    <ModalContext.Provider value={{
      isReservationModalOpen,
      reservationModalData,
      openReservationModal,
      closeReservationModal
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}