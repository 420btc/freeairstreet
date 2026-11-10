import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import {
  apiErrorResponse,
  databaseUnavailableResponse,
  isDatabaseUnavailable,
} from '@/lib/api-error';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (typeof data?.success !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'El campo success es obligatorio y debe ser booleano' },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false, skipped: true });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const log = await (prisma as any).adminAccessLog.create({
      data: {
        success: data.success,
        ipAddress: ipAddress,
        userAgent: userAgent,
      },
    });

    return NextResponse.json({ success: true, stored: true, log });
  } catch (error) {
    console.error('Error saving admin access log to database:', error);
    if (isDatabaseUnavailable(error)) {
      return databaseUnavailableResponse();
    }
    return apiErrorResponse(error, 'Error al guardar el registro de acceso en la base de datos');
  }
}
