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

    const requiredFields = ['name', 'email', 'phone', 'message'];
    const missingFields = requiredFields.filter((field) => !data?.[field]);
    if (missingFields.length > 0) {
      return missingFieldsResponse(missingFields);
    }

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false, skipped: true });
    }

    const contact = await (prisma as any).contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject || null,
        message: data.message,
      },
    });

    return NextResponse.json({ success: true, stored: true, contact });
  } catch (error) {
    console.error('Error saving contact to database:', error);
    if (isDatabaseUnavailable(error)) {
      return databaseUnavailableResponse();
    }
    return apiErrorResponse(error, 'Error al guardar el contacto en la base de datos');
  }
}
