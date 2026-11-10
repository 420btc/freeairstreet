import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false });
    }

    // Guardar en la base de datos
    const reservation = await (prisma as any).reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        duration: data.duration || null,
        participants: data.participants,
        pickupLocation: data.pickupLocation || null,
        comments: data.comments || null,
        itemName: data.itemName || null,
        itemPrice: data.itemPrice || null,
        type: data.type,
      },
    });

    return NextResponse.json({ success: true, stored: true, reservation });
  } catch (error) {
    console.error('Error saving reservation to database:', error);
    // El email sigue siendo la vía principal de reserva
    return NextResponse.json({ success: true, stored: false });
  }
}
