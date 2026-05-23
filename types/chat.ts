export type SupportedLanguage = 'es' | 'en' | 'pt' | 'fr' | 'de';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  showReservationButton?: boolean;
  reservationType?: 'rental' | 'tour' | 'appointment';
  showTranslateButton?: boolean;
  translatedContent?: string;
  quickReplies?: QuickReply[];
  feedback?: 'up' | 'down' | null;
  isStreaming?: boolean;
}

export interface QuickReply {
  id: string;
  label: string;
  action: 'send' | 'modal';
  value: string;
}

export interface ConversationContext {
  serviceType?: string;
  duration?: string;
  date?: string;
  participants?: string;
  vehicleType?: string;
}

export interface PageContext {
  route: string;
  tab?: string;
}

export interface ExtractedContext {
  serviceType?: string;
  duration?: string;
  date?: string;
  participants?: string;
  language?: SupportedLanguage;
}
