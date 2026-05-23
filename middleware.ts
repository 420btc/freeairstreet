import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  for (const [key, record] of ipRequestCounts) {
    if (now >= record.resetAt) {
      ipRequestCounts.delete(key);
    }
  }
}

export function middleware(req: NextRequest) {
  cleanup();

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (record && now < record.resetAt && record.count >= 30) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  if (!record || now >= record.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
  } else {
    record.count++;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/chat', '/api/chat/:path*'],
};
