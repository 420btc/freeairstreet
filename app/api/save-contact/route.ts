import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

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

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Error saving contact to database:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar el contacto en la base de datos' },
      { status: 500 }
    );
  }
}
