"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ReservationModalData {
  type: 'rental' | 'tour' | 'appointment'
  itemName?: string
  itemPrice?: string
  itemDuration?: string
  // Campos pre-rellenados desde la conversación con IA
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

interface ModalContextType {
  isReservationModalOpen: boolean
  reservationModalData: ReservationModalData
  openReservationModal: (data: ReservationModalData) => void
  closeReservationModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [reservationModalData, setReservationModalData] = useState<ReservationModalData>({ type: 'rental' })

  const openReservationModal = (data: ReservationModalData) => {
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