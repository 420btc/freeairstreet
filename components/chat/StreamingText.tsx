'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StreamingTextProps {
  content: string;
  isStreaming: boolean;
  onComplete?: () => void;
}

export default function StreamingText({ content, isStreaming, onComplete }: StreamingTextProps) {
  React.useEffect(() => {
    if (!isStreaming && onComplete) {
      onComplete();
    }
  }, [isStreaming, onComplete]);

  const renderContent = (content: string) => {
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

    return parts.map((part, i) => {
      if (typeof part === 'object' && 'badge' in part) {
        return (
          <span
            key={i}
            className="inline-block bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium mx-1"
          >
            {part.badge}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <span>
      {renderContent(content)}
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 bg-gray-400 dark:bg-gray-500 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}
