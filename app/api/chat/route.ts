import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { getCachedPrices } from '@/lib/price-cache';
import { rateLimit } from '@/lib/rate-limit';
import type { ChatMessage, ChatSession } from '@prisma/client';
import type { ExtractedContext } from '@/types/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Eres AirX, asistente virtual de Free Air Street Rental en Torremolinos (Calle de la Playa, 22 - 29620). Ayudas con alquiler de vehículos, excursiones y servicios turísticos en la Costa del Sol. Usa emoticonos ocasionalmente.

**Info empresa:**
- Tel: +34 655 707 412 | Email: info@freeairstreet-rentbike.com
- Horario: L-D 9:00-22:00

**Precios actualizados:**
`;

const REQUIREMENTS_PROMPT = `
**Requisitos:**
- Bicis/Patinetes: solo DNI
- Coches: carnet, pasaporte/DNI, tarjeta crédito depósito. Edad mínima: 21 años (25 para grupos C/D)
- Motos: carnet según cilindrada
- Todos los alquileres incluyen seguro básico

**IMPORTANTE - Formato de precios:**
Usa **asteriscos dobles** SOLO alrededor de PRECIOS para que aparezcan en badges morados. Ejemplo: cuesta **3€/1h** y **13€/día**.

**IMPORTANTE - Quick Replies:**
Al FINAL de cada respuesta, añade SIEMPRE un bloque [QUICK_REPLIES] con 2-3 sugerencias en este formato exacto (una por línea):
[QUICK_REPLIES]
🏷️ Ver todos los precios|Muéstrame los precios|send
📅 Quiero reservar|Quiero hacer una reserva|modal

**Idiomas:** Responde en el mismo idioma del usuario (ES, EN, PT, FR, DE). Mantén tono cercano y profesional.`;

const EXTRACT_CONTEXT_FUNCTION = {
  name: 'extract_context',
  description: 'Extract structured information from the user message',
  parameters: {
    type: 'object' as const,
    properties: {
      serviceType: { type: 'string', description: 'Vehicle or service type (bicicleta, coche, moto, quad, scooter, patinete, tour, excursión, visita)' },
      duration: { type: 'string', description: 'Duration mentioned (e.g., "2 horas", "1 día", "todo el día")' },
      date: { type: 'string', description: 'Date mentioned (e.g., "mañana", "15 de junio", "2024-06-15")' },
      participants: { type: 'string', description: 'Number of participants (e.g., "2 personas", "familia", "grupo")' },
      language: { type: 'string', enum: ['es', 'en', 'pt', 'fr', 'de'], description: 'Language the user is communicating in' },
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    const { success: rateOk } = rateLimit(ip, { maxRequests: 20, windowMs: 60_000 });
    if (!rateOk) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { message, conversationHistory, sessionId, stream = true, pageContext } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const [pricesText] = await Promise.all([
      getCachedPrices(),
    ]);

    let pageContextStr = '';
    if (pageContext?.route) {
      pageContextStr = `\n\nEl usuario está navegando en la página: ${pageContext.route}${pageContext.tab ? ` (sección: ${pageContext.tab})` : ''}. Adapta tu respuesta al contexto de esta página.`;
    }

    const systemContent = SYSTEM_PROMPT + pricesText + REQUIREMENTS_PROMPT + pageContextStr;

    if (sessionId && message) {
      await prisma.chatSession.upsert({
        where: { id: sessionId },
        update: {},
        create: { id: sessionId },
      });

      await prisma.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          isUser: true,
          content: message,
        },
      });
    }

    const historyMessages = (conversationHistory || []).slice(-20).map((msg: { isUser: boolean; content: string }) => ({
      role: msg.isUser ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }));

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...historyMessages,
      { role: 'user', content: message },
    ];

    if (stream) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      });

      const encoder = new TextEncoder();
      let fullResponse = '';

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();

            if (sessionId && fullResponse) {
              await prisma.chatMessage.create({
                data: {
                  chatSessionId: sessionId,
                  isUser: false,
                  content: fullResponse,
                },
              });
            }
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.';

    if (sessionId && response) {
      await prisma.chatMessage.create({
        data: {
          chatSessionId: sessionId,
          isUser: false,
          content: response,
        },
      });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Error procesando la consulta' },
      { status: 500 }
    );
  }
}
