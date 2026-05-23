import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    return NextResponse.json({ messages: [] });
  }
}
