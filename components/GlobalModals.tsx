"use client"

import { useModal } from '../contexts/ModalContext'
import { ReservationModal } from './ReservationModal'
import { IntroVideo } from './IntroVideo'

export function GlobalModals() {
  const { 
    isReservationModalOpen, 
    reservationModalData, 
    closeReservationModal,
    showIntroVideo,
    setShowIntroVideo
  } = useModal()
  
  return (
    <>
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        type={reservationModalData.type === 'appointment' ? 'rental' : reservationModalData.type}
        itemName={reservationModalData.itemName}
        itemPrice={reservationModalData.itemPrice}
        itemDuration={reservationModalData.itemDuration}
        prefillData={reservationModalData.prefillData}
      />
      
      {showIntroVideo && (
        <IntroVideo
          onComplete={() => setShowIntroVideo(false)}
        />
      )}
    </>
  )
}