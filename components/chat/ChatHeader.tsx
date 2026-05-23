'use client';

import React from 'react';
import { MessageCircle, X, RotateCcw, Minimize2, Maximize2, Columns2 } from 'lucide-react';

interface ChatHeaderProps {
  language: 'es' | 'en';
  chatSize: 'S' | 'M' | 'L';
  onSizeChange: (size: 'S' | 'M' | 'L') => void;
  onReset: () => void;
  onClose: () => void;
}

const sizeIcons: Record<string, React.ElementType> = {
  S: Minimize2,
  M: Columns2,
  L: Maximize2,
};

const sizeNext: Record<string, 'S' | 'M' | 'L'> = {
  S: 'M',
  M: 'L',
  L: 'S',
};

const sizeLabels: Record<string, { es: string; en: string }> = {
  S: { es: 'Compacto', en: 'Compact' },
  M: { es: 'Mediano', en: 'Medium' },
  L: { es: 'Grande', en: 'Large' },
};

export default function ChatHeader({ language, chatSize, onSizeChange, onReset, onClose }: ChatHeaderProps) {
  const SizeIcon = sizeIcons[chatSize];

  const handleSizeToggle = () => {
    onSizeChange(sizeNext[chatSize]);
  };

  return (
    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold text-sm">AirX Assistant</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <button
          onClick={handleSizeToggle}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-blue-700"
          title={`${sizeLabels[chatSize][language === 'en' ? 'en' : 'es']} (${chatSize})`}
        >
          <SizeIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onReset}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-blue-700"
          title={language === 'en' ? 'Reset chat' : 'Reiniciar chat'}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-blue-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
