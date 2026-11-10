import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false });
    }

    // Guardar en la base de datos
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
    return NextResponse.json({ success: true, stored: false });
  }
}
