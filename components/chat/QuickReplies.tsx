'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { QuickReply } from '@/types/chat';

interface QuickRepliesProps {
  replies: QuickReply[];
  onReply: (reply: QuickReply) => void;
}

export default function QuickReplies({ replies, onReply }: QuickRepliesProps) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {replies.map((reply) => (
        <Button
          key={reply.id}
          onClick={() => onReply(reply)}
          variant="outline"
          size="sm"
          className="text-xs h-auto py-1 px-2.5 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          {reply.label}
        </Button>
      ))}
    </div>
  );
}
