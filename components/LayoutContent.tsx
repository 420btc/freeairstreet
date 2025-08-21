"use client"

import { useModal } from '../contexts/ModalContext'
import { ReactNode } from 'react'

interface LayoutContentProps {
  children: ReactNode
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { showIntroVideo } = useModal()
  
  return (
    <div style={{ display: showIntroVideo ? 'none' : 'block' }}>
      {children}
    </div>
  )
}