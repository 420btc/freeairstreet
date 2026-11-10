import { NextResponse } from 'next/server'
import prisma, { isDatabaseConfigured } from '@/lib/prisma'
import { invalidatePriceCache } from '@/lib/price-cache'

// GET all prices
export async function GET() {
  if (!isDatabaseConfigured) {
    return NextResponse.json({})
  }

  try {
    const prices = await prisma.price.findMany()
    // Convert array to object mapping { id: price }
    const priceMap = prices.reduce((acc: Record<string, string>, item: any) => {
      acc[item.id] = item.price
      return acc
    }, {} as Record<string, string>)
    
    return NextResponse.json(priceMap)
  } catch (error) {
    console.error('Error fetching prices:', error)
    // La web usa sus precios por defecto si la base de datos no responde
    return NextResponse.json({})
  }
}

// POST update a single price
export async function POST(request: Request) {
  if (!isDatabaseConfigured) {
    return NextResponse.json({ success: true, persisted: false })
  }

  try {
    const { id, category, name, price } = await request.json()
    
    if (!id || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updatedPrice = await prisma.price.upsert({
      where: { id },
      update: { price, updatedAt: new Date() },
      create: { id, category: category || 'unknown', name: name || id, price, updatedAt: new Date() }
    })

    invalidatePriceCache()

    return NextResponse.json({ success: true, data: updatedPrice })
  } catch (error) {
    console.error('Error updating price:', error)
    return NextResponse.json({ success: true, persisted: false })
  }
}
