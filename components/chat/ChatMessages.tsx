'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StreamingText from './StreamingText';
import QuickReplies from './QuickReplies';
import FeedbackButtons from './FeedbackButtons';
import { formatMessageContent } from '@/lib/chat-utils';
import type { Message, QuickReply } from '@/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  language: 'es' | 'en';
  onReply: (reply: QuickReply) => void;
  onFeedback: (messageId: string, rating: 'up' | 'down') => void;
  onReservation: () => void;
  onTranslate: (messageId: string) => void;
  onStreamComplete: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function getReservationButtonText(type: string): string {
  switch (type) {
    case 'rental': return 'Reservar Ahora';
    case 'tour': return 'Reservar Excursión';
    case 'appointment': return 'Reservar Cita';
    default: return 'Reservar';
  }
}

export default function ChatMessages({
  messages,
  isStreaming,
  streamingContent,
  language,
  onReply,
  onFeedback,
  onReservation,
  onTranslate,
  onStreamComplete,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const renderMessageContent = (content: string) => {
    const parts = formatMessageContent(content);
    return parts.map((part, i) => {
      if (typeof part === 'object' && 'badge' in part) {
        return (
          <span
            key={i}
            className="inline-block bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium mx-0.5"
          >
            {part.badge}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
        >
          <div
            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
              message.isUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {message.isStreaming ? (
              <StreamingText
                content={streamingContent}
                isStreaming={isStreaming}
                onComplete={onStreamComplete}
              />
            ) : (
              renderMessageContent(message.content)
            )}
            {!message.isUser && !message.isStreaming && (
              <div className="flex items-center justify-between mt-1 group">
                <div className="text-xs opacity-70">
                  {formatTime(new Date(message.timestamp))}
                </div>
                <div className="flex items-center space-x-2">
                  <FeedbackButtons
                    messageId={message.id}
                    currentFeedback={message.feedback}
                    onFeedback={onFeedback}
                  />
                  {message.showTranslateButton && (
                    <button
                      onClick={() => onTranslate(message.id)}
                      className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded transition-colors"
                    >
                      {language === 'es' ? '🇬🇧 EN' : '🇪🇸 ES'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {!message.isUser && message.showReservationButton && message.reservationType && (
            <div className="mt-2">
              <Button
                onClick={onReservation}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
                size="sm"
              >
                {getReservationButtonText(message.reservationType)}
              </Button>
            </div>
          )}

          {!message.isUser && !message.isStreaming && message.quickReplies && (
            <QuickReplies replies={message.quickReplies} onReply={onReply} />
          )}
        </div>
      ))}

      {isStreaming && (
        <div className="flex justify-start">
          <div
            className={`max-w-[85%] px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
          >
            <StreamingText
              content={streamingContent}
              isStreaming={isStreaming}
              onComplete={onStreamComplete}
            />
          </div>
        </div>
      )}

      {!isStreaming && messages.length > 0 && messages[messages.length - 1].isUser && (
        <div className="flex justify-start">
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
