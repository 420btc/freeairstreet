import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Guardar en la base de datos
    const adRequest = await (prisma as any).advertisingRequest.create({
      data: {
        businessName: data.businessName,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        advertisingType: data.advertisingType,
        message: data.message,
      },
    });

    return NextResponse.json({ success: true, adRequest });
  } catch (error) {
    console.error('Error saving advertising request to database:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar la solicitud en la base de datos' },
      { status: 500 }
    );
  }
}
