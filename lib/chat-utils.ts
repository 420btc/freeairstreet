import type { SupportedLanguage, ConversationContext, QuickReply } from '@/types/chat';

const LANG_WORDS: Record<SupportedLanguage, string[]> = {
  es: ['hola', 'bici', 'alquiler', 'coche', 'tour', 'ayuda', 'por favor', 'gracias', 'sí', 'no', 'cómo', 'qué', 'cuándo', 'dónde', 'precio', 'coste', 'disponible', 'reservar', 'vale', 'buenos días', 'buenas tardes', 'hasta luego', 'adiós', 'moto', 'quad', 'scooter', 'patinete', 'excursión', 'visita'],
  en: ['hello', 'hi', 'bike', 'rent', 'car', 'tour', 'help', 'please', 'thank', 'yes', 'no', 'how', 'what', 'when', 'where', 'price', 'cost', 'available', 'book', 'reserve', 'ok', 'good morning', 'good afternoon', 'bye', 'motorcycle', 'scooter', 'excursion', 'visit', 'quad'],
  pt: ['olá', 'bicicleta', 'aluguer', 'carro', 'ajuda', 'por favor', 'obrigado', 'sim', 'não', 'como', 'o que', 'quando', 'onde', 'preço', 'custo', 'disponível', 'reservar', 'bom dia', 'boa tarde', 'adeus', 'moto', 'excursão', 'visita'],
  fr: ['bonjour', 'salut', 'vélo', 'location', 'voiture', 'aide', "s'il vous plaît", 'merci', 'oui', 'non', 'comment', 'quoi', 'quand', 'où', 'prix', 'coût', 'disponible', 'réserver', 'au revoir', 'moto', 'excursion', 'visite', 'scooter'],
  de: ['hallo', 'fahrrad', 'miete', 'auto', 'hilfe', 'bitte', 'danke', 'ja', 'nein', 'wie', 'was', 'wann', 'wo', 'preis', 'kosten', 'verfügbar', 'reservieren', 'guten tag', 'auf wiedersehen', 'motorrad', 'ausflug', 'besuch', 'roller'],
};

export function detectLanguage(text: string): SupportedLanguage {
  const lower = text.toLowerCase();
  const scores: Record<SupportedLanguage, number> = { es: 0, en: 0, pt: 0, fr: 0, de: 0 };

  for (const [lang, words] of Object.entries(LANG_WORDS)) {
    for (const word of words) {
      if (lower.includes(word)) {
        scores[lang as SupportedLanguage]++;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'es';

  const best = (Object.entries(scores) as [SupportedLanguage, number][])
    .find(([, s]) => s === maxScore);

  return best ? best[0] : 'es';
}

export function formatMessageContent(content: string): (string | { badge: string })[] {
  if (!content) return [];

  const parts: (string | { badge: string })[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    const inner = match[1];
    const hasPrice = /\d+€|€\d+|\d+\s*€|€\s*\d+/.test(inner);
    if (hasPrice) {
      parts.push({ badge: inner });
    } else {
      parts.push(inner);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

export function parseQuickReplies(content: string): QuickReply[] {
  const replies: QuickReply[] = [];
  const match = content.match(/\[QUICK_REPLIES\]([\s\S]*?)(?:\[|$)/);

  if (match) {
    const lines = match[1].trim().split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split('|');
      if (parts.length >= 3) {
        const action = parts[2].trim() as 'send' | 'modal';
        replies.push({
          id: `qr-${replies.length}`,
          label: parts[0].trim(),
          value: parts[1].trim(),
          action: ['send', 'modal'].includes(action) ? action : 'send',
        });
      }
    }
  }

  return replies;
}

export function cleanContent(content: string): string {
  return content.replace(/\[QUICK_REPLIES\][\s\S]*?(?:\[|$)/, '').trim();
}

export function shouldShowReservationButton(response: string, context: ConversationContext): boolean {
  const hasServiceInfo = !!(context.serviceType || context.duration || context.date);
  const hasReservationKeywords = /reserva|alquila|book|rent|disponible|precio/i.test(response);
  return hasServiceInfo && hasReservationKeywords;
}

export function getReservationType(context: ConversationContext): 'rental' | 'tour' | 'appointment' {
  if (context.serviceType) {
    if (/tour|excursión|excursion|visita|alhambra|córdoba|sevilla|gibraltar|cordoba/i.test(context.serviceType)) {
      return 'tour';
    }
    if (/bicicleta|bici|bike|coche|car|moto|quad|scooter|patinete/i.test(context.serviceType)) {
      return 'rental';
    }
  }
  return 'appointment';
}

export function extractContextWithRegex(message: string): ConversationContext {
  const context: ConversationContext = {};

  const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|mañana|hoy|pasado mañana|\d{1,2} de \w+)/i;
  const dateMatch = message.match(dateRegex);
  if (dateMatch) context.date = dateMatch[0];

  const durationRegex = /(\d+\s*(hora|día|semana|mes|hour|day|week|month)s?|todo el día|media jornada|all day|half day)/i;
  const durationMatch = message.match(durationRegex);
  if (durationMatch) context.duration = durationMatch[0];

  const participantsRegex = /(\d+\s*(persona|gente|adulto|niño|person|people|adult|child|kid)s?|familia|pareja|grupo|family|couple|group)/i;
  const participantsMatch = message.match(participantsRegex);
  if (participantsMatch) context.participants = participantsMatch[0];

  const serviceRegex = /(bicicleta|bici|bike|coche|car|moto|quad|scooter|patinete|tour|excursión|excursion|visita|visit)/i;
  const serviceMatch = message.match(serviceRegex);
  if (serviceMatch) context.serviceType = serviceMatch[0];

  return context;
}
