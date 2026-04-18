import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all prices
export async function GET() {
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
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}

// POST update a single price
export async function POST(request: Request) {
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

    return NextResponse.json({ success: true, data: updatedPrice })
  } catch (error) {
    console.error('Error updating price:', error)
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 })
  }
}
