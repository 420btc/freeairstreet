const store = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, record] of store) {
    if (now >= record.resetAt) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  ip: string,
  opts: { maxRequests: number; windowMs: number }
): { success: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const record = store.get(ip);

  if (!record || now >= record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + opts.windowMs });
    return { success: true, remaining: opts.maxRequests - 1 };
  }

  if (record.count >= opts.maxRequests) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: opts.maxRequests - record.count };
}
