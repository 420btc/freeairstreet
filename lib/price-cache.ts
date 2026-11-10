import prisma, { isDatabaseConfigured } from '@/lib/prisma';

let cache: { text: string; timestamp: number } | null = null;
const TTL = 300_000; // 5 minutes

export async function getCachedPrices(): Promise<string> {
  if (!isDatabaseConfigured) return '';

  if (cache && Date.now() - cache.timestamp < TTL) {
    return cache.text;
  }

  try {
    const prices = await prisma.price.findMany();
    const text = prices
      .map((p) => `- **${p.name}** (${p.category}): ${p.price}`)
      .join('\n');

    cache = { text, timestamp: Date.now() };
    return text;
  } catch (error) {
    console.error('Price cache unavailable:', error);
    return '';
  }
}

export function invalidatePriceCache(): void {
  cache = null;
}
