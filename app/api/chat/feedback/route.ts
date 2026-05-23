import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { messageId, sessionId, rating } = await req.json();

    if (!messageId || !sessionId || !rating || !['up', 'down'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await prisma.chatMessageFeedback.create({
      data: {
        messageId,
        sessionId,
        rating,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
