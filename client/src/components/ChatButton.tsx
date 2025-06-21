import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { CivicChatBot } from './CivicChatBot';

interface ChatButtonProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function ChatButton({ variant = 'icon', className = '' }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (variant === 'full') {
    return (
      <>
        <Button
          variant="ghost"
          className={`w-full justify-start space-x-2 lg:space-x-3 text-xs lg:text-sm h-8 lg:h-9 px-2 lg:px-3 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 ${className}`}
          onClick={() => setIsChatOpen(true)}
          title="Chat with CivicAI"
        >
          <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
          <span>CivicAI Chat</span>
        </Button>
        
        {isChatOpen && (
          <div className="fixed inset-0 z-50">
            <div className="fixed bottom-6 right-6">
              <CivicChatBot onClose={() => setIsChatOpen(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 ${className}`}
        onClick={() => setIsChatOpen(true)}
        title="Chat with CivicAI"
      >
        <MessageCircle className="w-5 h-5" />
      </Button>
      
      {isChatOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed bottom-6 right-6">
            <CivicChatBot onClose={() => setIsChatOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}