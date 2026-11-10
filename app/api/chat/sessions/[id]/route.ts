import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import { isDatabaseUnavailable } from '@/lib/api-error';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Sin base de datos el historial simplemente no existe: el chat arranca vacío.
  if (!isDatabaseConfigured) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const { id } = await params;

    const session = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    const messages = session.messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.isUser,
      timestamp: msg.createdAt,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching session:', error);
    if (isDatabaseUnavailable(error)) {
      return NextResponse.json({ messages: [] });
    }
    return NextResponse.json(
      { messages: [], error: 'No se pudo cargar la conversación' },
      { status: 500 }
    );
  }
}
