import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { CivicChatBot } from './CivicChatBot';

export function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600"
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