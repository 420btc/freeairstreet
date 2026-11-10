import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

// Errores de conexión: la base de datos existe pero no está accesible
const UNAVAILABLE_CODES = new Set([
  'P1000',
  'P1001',
  'P1002',
  'P1003',
  'P1008',
  'P1010',
  'P1017',
  'P2024',
])

// Errores de datos/validación que no deben ocultarse
const VALIDATION_CODES = new Set([
  'P2000',
  'P2002',
  'P2003',
  'P2005',
  'P2006',
  'P2011',
  'P2012',
  'P2013',
  'P2014',
  'P2019',
  'P2020',
  'P2023',
  'P2025',
])

export function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return UNAVAILABLE_CODES.has(error.code)
  }

  const message = error instanceof Error ? error.message : ''
  return /can't reach database server|connection refused|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|P1001|P1002|P1017|P2024|DATABASE_URL/i.test(
    message
  )
}

export function isValidationError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientValidationError) return true

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return VALIDATION_CODES.has(error.code)
  }

  return false
}

// Caso esperado: sin DATABASE_URL o base de datos caída. El email sigue funcionando.
export function databaseUnavailableResponse() {
  return NextResponse.json({ success: true, stored: false, warning: 'database_unavailable' })
}

// Error real: no se oculta al cliente.
export function apiErrorResponse(error: unknown, fallbackMessage: string) {
  if (isValidationError(error)) {
    return NextResponse.json({ success: false, error: 'Datos no válidos' }, { status: 400 })
  }

  return NextResponse.json({ success: false, error: fallbackMessage }, { status: 500 })
}

export function missingFieldsResponse(fields: string[]) {
  return NextResponse.json(
    { success: false, error: `Faltan campos obligatorios: ${fields.join(', ')}` },
    { status: 400 }
  )
}
