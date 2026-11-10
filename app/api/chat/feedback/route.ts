import { NextRequest, NextResponse } from 'next/server';
import prisma, { isDatabaseConfigured } from '@/lib/prisma';
import {
  apiErrorResponse,
  databaseUnavailableResponse,
  isDatabaseUnavailable,
} from '@/lib/api-error';

export async function POST(req: NextRequest) {
  try {
    const { messageId, sessionId, rating } = await req.json();

    if (!messageId || !sessionId || !rating || !['up', 'down'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    if (!isDatabaseConfigured) {
      return NextResponse.json({ success: true, stored: false, skipped: true });
    }

    await prisma.chatMessageFeedback.create({
      data: {
        messageId,
        sessionId,
        rating,
      },
    });

    return NextResponse.json({ success: true, stored: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    if (isDatabaseUnavailable(error)) {
      return databaseUnavailableResponse();
    }
    return apiErrorResponse(error, 'Failed to save feedback');
  }
}
