import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { CivicChatBot } from './CivicChatBot';

export function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Button - only show on desktop */}
      <div className="hidden lg:block">
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 z-40"
          size="icon"
          title="Chat with CivicAI"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
      
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