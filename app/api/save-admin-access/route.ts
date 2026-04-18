import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

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

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('Error saving admin access log to database:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar el registro de acceso en la base de datos' },
      { status: 500 }
    );
  }
}
