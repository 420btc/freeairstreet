import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import {
  apiErrorResponse,
  databaseUnavailableResponse,
  isDatabaseUnavailable,
  missingFieldsResponse,
} from '@/lib/api-error';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'participants', 'type'];
    const missingFields = requiredFields.filter((field) => !data?.[field]);
    if (missingFields.length > 0) {
      return missingFieldsResponse(missingFields);
    }

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false, skipped: true });
    }

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
    if (isDatabaseUnavailable(error)) {
      return databaseUnavailableResponse();
    }
    return apiErrorResponse(error, 'Error al guardar la reserva en la base de datos');
  }
}
