'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import { detectLanguage, parseQuickReplies, cleanContent, shouldShowReservationButton, getReservationType, extractContextWithRegex } from '@/lib/chat-utils';
import type { Message, ConversationContext, PageContext, QuickReply, SupportedLanguage } from '@/types/chat';

const SIZE_CLASSES: Record<string, string> = {
  S: 'w-80 h-96',
  M: 'w-[450px] h-[500px]',
  L: 'w-[600px] h-[70vh]',
};

const SIZE_MOBILE = 'w-[90vw] h-[80vh]';

function getWelcomeMessage(lang: 'es' | 'en'): string {
  return lang === 'en'
    ? "Hello! 👋 I'm AirX, your virtual assistant. How can I help you today? I can help you with information or booking our rental vehicles, tours and services in Torremolinos 😊🌴"
    : '¡Hola! 👋 Soy AirX, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información o a reservar nuestros vehículos de alquiler, excursiones y servicios en Torremolinos 😊🌴';
}

export default function AirXChat() {
  const { openReservationModal } = useModal();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('es');
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      content: getWelcomeMessage('es'),
      isUser: false,
      timestamp: new Date(),
      showTranslateButton: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const [sessionId, setSessionId] = useState<string>('');
  const [chatSize, setChatSize] = useState<'S' | 'M' | 'L'>('S');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [hasShownProactiveMessage, setHasShownProactiveMessage] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({ route: 'home' });
  const pageLoadTimeRef = useRef<number>(Date.now());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize session from localStorage or create new
  useEffect(() => {
    const existingSessionId = localStorage.getItem('airx-session-id');
    if (existingSessionId) {
      setSessionId(existingSessionId);
      fetchSessionMessages(existingSessionId);
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem('airx-session-id', newId);
      setSessionId(newId);
    }
  }, []);

  // Detect page context from URL
  useEffect(() => {
    if (!pathname) return;
    const route = pathname.replace('/', '') || 'home';
    setPageContext({ route });
  }, [pathname]);

  // Fetch existing session messages
  const fetchSessionMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        const restored: Message[] = data.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp),
          showTranslateButton: !msg.isUser,
        }));
        setMessages(restored);
      }
    } catch {
      // Silent fail - session messages are nice-to-have
    }
  };

  // Clear notification when chat is opened
  useEffect(() => {
    if (isOpen) setHasNewMessage(false);
  }, [isOpen]);

  // Proactive message after 10 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShownProactiveMessage && !isOpen) {
        const proactiveMessage: Message = {
          id: `proactive-${Date.now()}`,
          content: language === 'en'
            ? "Hi! 👋 I noticed you've been browsing for a while. Is there anything I can help you with? I'm here to assist you with rentals, tours, or any questions you might have! 😊"
            : '¡Hola! 👋 Veo que llevas un rato navegando. ¿Hay algo en lo que pueda ayudarte? ¡Estoy aquí para asistirte con alquileres, tours o cualquier pregunta que tengas! 😊',
          isUser: false,
          timestamp: new Date(),
          showTranslateButton: true,
        };
        setMessages((prev) => [...prev, proactiveMessage]);
        setHasNewMessage(true);
        setHasShownProactiveMessage(true);
      }
    }, 10 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [hasShownProactiveMessage, isOpen, language]);

  // Scroll on messages change is handled by ChatMessages component

  // Translate welcome message
  const translateMessage = async (messageId: string) => {
    const targetLang = language === 'es' ? 'en' : 'es';

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        if (msg.id === '1') {
          return {
            ...msg,
            content: getWelcomeMessage(targetLang as 'es' | 'en'),
            translatedContent: msg.content,
          };
        }
        return msg;
      })
    );

    setLanguage(targetLang);
  };

  // Reset chat
  const resetChat = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem('airx-session-id', newId);
    setSessionId(newId);

    setMessages([
      {
        id: '1',
        content: getWelcomeMessage(language === 'en' ? 'en' : 'es'),
        isUser: false,
        timestamp: new Date(),
        showTranslateButton: true,
      },
    ]);
    setConversationContext({});
    setInputMessage('');
    setIsStreaming(false);
    setStreamingContent('');
  };

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;

    const detectedLang = detectLanguage(inputMessage);
    setLanguage(detectedLang);

    const newContext = extractContextWithRegex(inputMessage);
    setConversationContext(newContext);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Abort any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let accumulatedContent = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          context: newContext,
          conversationHistory: messages.slice(-20).map((m) => ({ isUser: m.isUser, content: m.content })),
          detectedLanguage: detectedLang,
          sessionId,
          stream: true,
          pageContext,
        }),
        signal: abortController.signal,
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream body');

      const decoder = new TextDecoder();
      setIsLoading(false);
      setIsStreaming(true);

      setStreamingContent('');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Stream complete - finalize message
              const cleanedContent = cleanContent(accumulatedContent);
              const quickReplies = parseQuickReplies(accumulatedContent);
              const showButton = shouldShowReservationButton(cleanedContent, newContext);
              const reservationType = getReservationType(newContext);

              const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: cleanedContent,
                isUser: false,
                timestamp: new Date(),
                showReservationButton: showButton,
                reservationType,
                quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
              };

              setMessages((prev) => [...prev, aiMessage]);
              setIsStreaming(false);
              setStreamingContent('');
            } else {
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  setStreamingContent(accumulatedContent);
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Error sending message:', error);

      // If streaming was interrupted, save what we have
      if (accumulatedContent) {
        const cleanedContent = cleanContent(accumulatedContent);
        const quickReplies = parseQuickReplies(accumulatedContent);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: cleanedContent || (language === 'en' ? 'Sorry, there was a connection error.' : 'Lo siento, hubo un error de conexión.'),
          isUser: false,
          timestamp: new Date(),
          quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: language === 'en' ? 'Sorry, there was a connection error. Please try again.' : 'Lo siento, hubo un error de conexión. Por favor, inténtalo de nuevo.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  // Handle quick reply
  const handleQuickReply = (reply: QuickReply) => {
    if (reply.action === 'send') {
      setInputMessage(reply.value);
      setTimeout(() => {
        sendMessage();
      }, 100);
    } else if (reply.action === 'modal') {
      handleReservationClick();
    }
  };

  // Handle feedback
  const handleFeedback = async (messageId: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: rating } : msg))
    );

    try {
      await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, sessionId, rating }),
      });
    } catch {
      // Silent fail for feedback
    }
  };

  // Handle reservation
  const handleReservationClick = () => {
    const reservationType = getReservationType(conversationContext);
    openReservationModal({
      type: reservationType,
      itemName: conversationContext.serviceType,
      itemDuration: conversationContext.duration,
      prefillData: {
        date: conversationContext.date,
        participants: conversationContext.participants,
      },
    });
  };

  const inputPlaceholder = language === 'en' ? 'Type your message...' : 'Escribe tu mensaje...';

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 relative"
        style={{ zIndex: 9999, position: 'fixed' }}
        aria-label={language === 'en' ? 'Open AirX chat' : 'Abrir chat AirX'}
      >
        {isOpen ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        {hasNewMessage && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-[9998] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 flex flex-col ${
            typeof window !== 'undefined' && window.innerWidth < 768 ? SIZE_MOBILE : SIZE_CLASSES[chatSize]
          }`}
          style={{ zIndex: 9998 }}
        >
          <ChatHeader
            language={language === 'en' ? 'en' : 'es'}
            chatSize={chatSize}
            onSizeChange={setChatSize}
            onReset={resetChat}
            onClose={() => setIsOpen(false)}
          />

          <ChatMessages
            messages={messages}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            language={language === 'en' ? 'en' : 'es'}
            onReply={handleQuickReply}
            onFeedback={handleFeedback}
            onReservation={handleReservationClick}
            onTranslate={translateMessage}
            onStreamComplete={() => {}}
          />

          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={sendMessage}
            isLoading={isLoading || isStreaming}
            placeholder={inputPlaceholder}
          />
        </div>
      )}
    </>
  );
}
