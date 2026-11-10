import type { ReactNode, SVGProps } from 'react'

type VehicleIconProps = SVGProps<SVGSVGElement>

function VehicleIcon({ children, ...props }: VehicleIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.7}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function CityBikeIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <path d="M6.25 12.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m11.5 0a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7" />
      <path d="m6.25 16l4.25-7l2 7h5.25M10.5 9l-.75-2.5m-1.5 0h3m6.5 9.5L15.5 8.5H18" />
    </VehicleIcon>
  )
}

export function ScooterIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <path d="M21 4h-3.5l2 11.05M6.95 17h5.14c.52 0 .95-.41 1.06-.92a6.5 6.5 0 0 1 5.35-5" />
      <circle cx="19.5" cy="17.5" r="2.5" />
      <circle cx="4.5" cy="17.5" r="2.5" />
    </VehicleIcon>
  )
}

export function EBikeIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <path d="M7.75 17.75h3L8.46 8M7 8h3m.75 9.75l2.96-5.21m1.48-2.61L16 8.5l2.04 6.85M16 8.5l-.82-2.75h-1.75m.53 6.36l.98-1.75q.25-.43-.19-.68l-.64-.36q-.44-.25-.69.18l-.98 1.75q-.25.43.19.68l.64.36q.44.25.69-.18" />
      <circle cx="5.25" cy="17.75" r="2.5" />
      <circle cx="18.75" cy="17.75" r="2.5" />
    </VehicleIcon>
  )
}

export function FatBikeIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <circle cx="6.75" cy="17.25" r="4" strokeWidth={2.6} />
      <circle cx="17.25" cy="17.25" r="4" strokeWidth={2.6} />
      <path strokeWidth={2.2} d="M6.75 17.25h.01m10.49 0h.01" />
      <path d="m6.75 17.25l2.75-6.5l2.5 6.5l4.25-6.5m-6.75 0h6.75m-6.75 0L9 9M7.75 9h2.5m6 1.75l1 6.5m-1-6.5l-.75-2H18" />
    </VehicleIcon>
  )
}

export function MotorcycleIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <circle cx="5.75" cy="18" r="3" />
      <circle cx="18.25" cy="18" r="3" />
      <path d="M4 10h3.75q1 0 1.5-.87v-.01q.5-.87 1.5-.87H12q1 0 1.38.92l.99 2.41q.38.92-.62.92H4q-1 0-1-1V11q0-1 1-1m10.25-4H16l1.7 9.05" />
    </VehicleIcon>
  )
}

export function QuadIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <path d="M2.75 13.75v-.5q0-.75.61-1.19l1.53-1.12q.61-.44 1.36-.44h11.5q.75 0 1.36.44l1.53 1.12q.61.44.61 1.19v.5q0 .75-.75.75h-17q-.75 0-.75-.75" />
      <rect width="5.5" height="2.5" x="7.25" y="8" rx="1" />
      <path d="m15.5 10.5l1-4h2" />
      <circle cx="6" cy="17.25" r="3" />
      <circle cx="18" cy="17.25" r="3" />
    </VehicleIcon>
  )
}

export function CarIcon(props: VehicleIconProps) {
  return (
    <VehicleIcon {...props}>
      <path d="M3.75 12.5L5.6 7.1a2 2 0 0 1 1.9-1.35h9a2 2 0 0 1 1.9 1.35l1.85 5.4v4.75a1 1 0 0 1-1 1H4.75a1 1 0 0 1-1-1Zm2.75 5.75v2.5m11-2.5v2.5m-13.25-9.5h15.5" />
      <path strokeWidth={2.2} d="M7.5 14.75h.01m8.99 0h.01" />
    </VehicleIcon>
  )
}
