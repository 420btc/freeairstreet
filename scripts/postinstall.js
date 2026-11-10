const path = require('node:path')
const { execSync } = require('node:child_process')

const prismaBin = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'prisma.cmd' : 'prisma'
)
const prisma = `"${prismaBin}"`

// Generar siempre el cliente: sin él, Next falla con "Cannot find module '.prisma/client/default'"
execSync(`${prisma} generate`, { stdio: 'inherit' })

// Sincronizar el esquema solo si hay base de datos configurada
if (process.env.DATABASE_URL) {
  try {
    execSync(`${prisma} db push --accept-data-loss`, { stdio: 'inherit' })
  } catch (error) {
    console.warn('Aviso: no se pudo sincronizar el esquema de Prisma con la base de datos.')
  }
} else {
  console.warn('DATABASE_URL no configurada: se omite prisma db push. La web funcionará con sus datos por defecto.')
}
