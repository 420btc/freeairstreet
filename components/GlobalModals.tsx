"use client"

import { useModal } from '../contexts/ModalContext'
import { ReservationModal } from './ReservationModal'

export function GlobalModals() {
  const { isReservationModalOpen, reservationModalData, closeReservationModal } = useModal()
  
  return (
    <ReservationModal
      isOpen={isReservationModalOpen}
      onClose={closeReservationModal}
      type={reservationModalData.type === 'appointment' ? 'rental' : reservationModalData.type}
      itemName={reservationModalData.itemName}
      itemPrice={reservationModalData.itemPrice}
      itemDuration={reservationModalData.itemDuration}
    />
  )
}