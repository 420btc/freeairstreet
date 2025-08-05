'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  showReservationButton?: boolean;
  reservationType?: 'rental' | 'tour' | 'appointment';
}

interface ConversationContext {
  serviceType?: string;
  duration?: string;
  date?: string;
  participants?: string;
  vehicleType?: string;
}

interface AirXChatProps {
  onOpenReservationModal?: () => void;
}

export default function AirXChat({ onOpenReservationModal }: AirXChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy AirX, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre nuestros vehículos de alquiler, excursiones y servicios en la Costa del Sol.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to format message content with purple badges for text between asterisks
  const formatMessageContent = (content: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is text that was between asterisks
        return (
          <span
            key={index}
            className="inline-block bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium mx-1"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to extract context from user message
  const extractContext = (message: string) => {
    const newContext = { ...conversationContext };
    
    // Extract dates
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|mañana|hoy|pasado mañana|\d{1,2} de \w+)/i;
    const dateMatch = message.match(dateRegex);
    if (dateMatch) newContext.date = dateMatch[0];
    
    // Extract duration
    const durationRegex = /(\d+\s*(hora|día|semana|mes)s?|todo el día|media jornada)/i;
    const durationMatch = message.match(durationRegex);
    if (durationMatch) newContext.duration = durationMatch[0];
    
    // Extract participants
    const participantsRegex = /(\d+\s*(persona|gente|adulto|niño)s?|familia|pareja|grupo)/i;
    const participantsMatch = message.match(participantsRegex);
    if (participantsMatch) newContext.participants = participantsMatch[0];
    
    // Extract vehicle/service type
    const serviceRegex = /(bicicleta|coche|moto|quad|scooter|patinete|tour|excursión|visita)/i;
    const serviceMatch = message.match(serviceRegex);
    if (serviceMatch) newContext.serviceType = serviceMatch[0];
    
    return newContext;
  };

  // Function to determine if should show reservation button
  const shouldShowReservationButton = (response: string, context: ConversationContext) => {
    const hasServiceInfo = context.serviceType || context.duration || context.date;
    const hasReservationKeywords = /reserva|alquila|book|rent|disponible|precio/i.test(response);
    return hasServiceInfo && hasReservationKeywords;
  };

  // Function to determine reservation type
  const getReservationType = (context: ConversationContext): 'rental' | 'tour' | 'appointment' => {
    if (context.serviceType) {
      if (/tour|excursión|visita|alhambra|córdoba|sevilla|gibraltar/i.test(context.serviceType)) {
        return 'tour';
      }
      if (/bicicleta|coche|moto|quad|scooter|patinete/i.test(context.serviceType)) {
        return 'rental';
      }
    }
    return 'appointment';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Extract context from user message
    const newContext = extractContext(inputMessage);
    setConversationContext(newContext);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: inputMessage,
          context: newContext,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        }),
      });

      const data = await response.json();
      
      const showButton = shouldShowReservationButton(data.response, newContext);
      const reservationType = getReservationType(newContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Lo siento, hubo un error procesando tu consulta.',
        isUser: false,
        timestamp: new Date(),
        showReservationButton: Boolean(showButton),
        reservationType: reservationType
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error de conexión. Por favor, inténtalo de nuevo.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReservationClick = (type: 'rental' | 'tour' | 'appointment') => {
    if (onOpenReservationModal) {
      onOpenReservationModal();
    } else {
      // Fallback: scroll to reservation section or open modal
      const reservationSection = document.querySelector('#reservation-section');
      if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getReservationButtonText = (type: 'rental' | 'tour' | 'appointment') => {
    switch (type) {
      case 'rental':
        return 'Reservar Ahora';
      case 'tour':
        return 'Reservar Excursión';
      case 'appointment':
        return 'Reservar Cita';
      default:
        return 'Reservar';
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        aria-label="Abrir chat AirX"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">AirX Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {message.isUser ? message.content : formatMessageContent(message.content)}
                </div>
                {/* Reservation Button */}
                {!message.isUser && message.showReservationButton && message.reservationType && (
                  <div className="mt-2">
                    <Button
                      onClick={() => handleReservationClick(message.reservationType!)}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 h-auto"
                      size="sm"
                    >
                      {getReservationButtonText(message.reservationType)}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}