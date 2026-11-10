import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false });
    }

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

    return NextResponse.json({ success: true, stored: true, adRequest });
  } catch (error) {
    console.error('Error saving advertising request to database:', error);
    return NextResponse.json({ success: true, stored: false });
  }
}
