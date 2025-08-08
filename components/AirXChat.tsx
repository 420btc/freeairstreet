'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { useModal } from '../contexts/ModalContext';

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

export default function AirXChat() {
  const { openReservationModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! 👋 Soy AirX, tu asistente virtual. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información o a reservar nuestros vehículos de alquiler, excursiones y servicios en Torremolinos 😊🌴',
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
  const getReservationType = (context: ConversationContext = conversationContext): 'rental' | 'tour' | 'appointment' => {
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

  // Function to extract reservation context from conversation
  const extractReservationContext = () => {
    const lastMessages = messages.slice(-5); // Get last 5 messages for more context
    let itemName = '';
    let itemPrice = '';
    let itemDuration = '';
    
    // Initialize prefill data
    const prefillData: {
      name?: string;
      email?: string;
      phone?: string;
      date?: string;
      time?: string;
      participants?: string;
      pickupLocation?: string;
      comments?: string;
    } = {};

    // Extract information from recent messages
    for (const message of lastMessages) {
      const content = message.content.toLowerCase();
      
      if (!message.isUser) {
        // Look for price patterns in AI responses
        const priceMatch = message.content.match(/(\d+)€/g);
        if (priceMatch && !itemPrice) {
          itemPrice = priceMatch[0];
        }
        
        // Look for duration patterns
        const durationMatch = message.content.match(/(\d+\s*(hora|día|semana|mes)s?|todo el día|media jornada)/i);
        if (durationMatch && !itemDuration) {
          itemDuration = durationMatch[0];
        }
      } else {
        // Extract user preferences from user messages
        
        // Extract dates
        const datePatterns = [
          /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
          /(mañana|pasado mañana|hoy)/i,
          /(lunes|martes|miércoles|jueves|viernes|sábado|domingo)/i,
          /(\d{1,2}\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre))/i
        ];
        
        for (const pattern of datePatterns) {
          const dateMatch = content.match(pattern);
          if (dateMatch && !prefillData.date) {
            let dateValue = dateMatch[0];
            
            // Convert relative dates to actual dates
            if (dateValue.toLowerCase() === 'mañana') {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              dateValue = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format
            } else if (dateValue.toLowerCase() === 'hoy') {
              const today = new Date();
              dateValue = today.toISOString().split('T')[0]; // YYYY-MM-DD format
            } else if (dateValue.toLowerCase() === 'pasado mañana') {
              const dayAfterTomorrow = new Date();
              dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
              dateValue = dayAfterTomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format
            }
            
            prefillData.date = dateValue;
            break;
          }
        }
        
        // Extract times
        const timePatterns = [
          /(\d{1,2}:\d{2})/,
          /(\d{1,2}\s*(am|pm|h))/i,
          /(mañana|tarde|noche)/i,
          /(por la mañana|por la tarde|por la noche)/i
        ];
        
        for (const pattern of timePatterns) {
          const timeMatch = content.match(pattern);
          if (timeMatch && !prefillData.time) {
            prefillData.time = timeMatch[0];
            break;
          }
        }
        
        // Extract pickup locations
        const locationPatterns = [
          /(hotel\s+[\w\s]+)/i,
          /(aeropuerto|estación|centro|plaza\s+[\w\s]*)/i,
          /(calle\s+[\w\s]+)/i,
          /(recoger\s+en\s+[\w\s]+)/i
        ];
        
        for (const pattern of locationPatterns) {
          const locationMatch = content.match(pattern);
          if (locationMatch && !prefillData.pickupLocation) {
            prefillData.pickupLocation = locationMatch[0];
            break;
          }
        }
        
        // Extract special requests or comments - capture the full user message if it contains relevant keywords
         const commentKeywords = /(necesito|prefiero|tengo|quiero|me gustaría|quisiera|solicito|requiero|importante|especial)/i;
         
         if (commentKeywords.test(content) && !prefillData.comments) {
           // Use the original message content (not lowercased) for better readability
           prefillData.comments = message.content;
         }
      }
    }

    // Use conversation context for item name
    if (conversationContext.serviceType) {
      itemName = conversationContext.serviceType;
    }

    // Use conversation context for duration if not found in messages
    if (conversationContext.duration && !itemDuration) {
      itemDuration = conversationContext.duration;
    }
    
    // Use conversation context for participants
    if (conversationContext.participants && !prefillData.participants) {
      // Extract number from participants string
      const participantsMatch = conversationContext.participants.match(/\d+/);
      if (participantsMatch) {
        prefillData.participants = participantsMatch[0];
      }
    }
    
    // Use conversation context for date if not found
    if (conversationContext.date && !prefillData.date) {
      prefillData.date = conversationContext.date;
    }

    return {
      itemName,
      itemPrice,
      itemDuration,
      prefillData
    };
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

  const handleReservationClick = () => {
    const reservationType = getReservationType(conversationContext)
    const context = extractReservationContext()
    
    openReservationModal({
      type: reservationType,
      itemName: context.itemName,
      itemPrice: context.itemPrice,
      itemDuration: context.itemDuration,
      prefillData: context.prefillData
    })
  }

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
                  {!message.isUser && (
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                {/* Reservation Button */}
                {!message.isUser && message.showReservationButton && message.reservationType && (
                  <div className="mt-2">
                    <Button
                      onClick={handleReservationClick}
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