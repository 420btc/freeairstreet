import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false });
    }

    // Extraer información útil del request para tener más contexto de quién intenta acceder
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Guardar en la base de datos
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
    return NextResponse.json({ success: true, stored: false });
  }
}
