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

    const requiredFields = ['businessName', 'contactPerson', 'email', 'advertisingType', 'message'];
    const missingFields = requiredFields.filter((field) => !data?.[field]);
    if (missingFields.length > 0) {
      return missingFieldsResponse(missingFields);
    }

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false, skipped: true });
    }

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
    if (isDatabaseUnavailable(error)) {
      return databaseUnavailableResponse();
    }
    return apiErrorResponse(error, 'Error al guardar la solicitud en la base de datos');
  }
}
