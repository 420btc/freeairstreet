'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Message } from '@/types/chat';

interface FeedbackButtonsProps {
  messageId: string;
  currentFeedback: Message['feedback'];
  onFeedback: (messageId: string, rating: 'up' | 'down') => void;
}

export default function FeedbackButtons({ messageId, currentFeedback, onFeedback }: FeedbackButtonsProps) {
  const [animating, setAnimating] = useState<string | null>(null);

  const handleFeedback = (rating: 'up' | 'down') => {
    if (currentFeedback === rating) return;
    setAnimating(rating);
    setTimeout(() => setAnimating(null), 300);
    onFeedback(messageId, rating);
  };

  return (
    <div className="flex items-center space-x-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={() => handleFeedback('up')}
        className={`p-0.5 rounded transition-colors ${
          currentFeedback === 'up'
            ? 'text-green-500'
            : 'text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400'
        } ${animating === 'up' ? 'scale-125' : ''}`}
        title="Útil"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`p-0.5 rounded transition-colors ${
          currentFeedback === 'down'
            ? 'text-red-500'
            : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
        } ${animating === 'down' ? 'scale-125' : ''}`}
        title="No útil"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
