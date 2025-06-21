import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User, Minimize2, Maximize2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  source?: 'ollama' | 'huggingface' | 'local' | 'fallback';
  relatedTopics?: string[];
}

interface AIResponse {
  message: string;
  confidence: number;
  source: 'ollama' | 'huggingface' | 'local' | 'fallback';
  relatedTopics?: string[];
}

interface CivicChatBotProps {
  onClose?: () => void;
}

export function CivicChatBot({ onClose }: CivicChatBotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m CivicAI, your Canadian democracy assistant. I can help you understand politicians, bills, voting records, legal frameworks, and civic engagement opportunities. What would you like to know?',
      timestamp: Date.now(),
      source: 'local',
      relatedTopics: ['Getting Started', 'Civic Engagement']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get AI service status
  const { data: aiStatus } = useQuery({
    queryKey: ['/api/ai/status'],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/ai/chat', 'POST', {
        message,
        conversationHistory: messages.slice(-10) // Send last 10 messages for context
      });
      return response as AIResponse;
    },
    onSuccess: (response) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.message,
        timestamp: Date.now(),
        source: response.source,
        relatedTopics: response.relatedTopics
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: Date.now(),
        source: 'fallback'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Send to AI
    sendMessageMutation.mutate(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSourceBadgeVariant = (source?: string) => {
    switch (source) {
      case 'ollama': return 'default';
      case 'huggingface': return 'secondary';
      case 'local': return 'outline';
      default: return 'outline';
    }
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'ollama': return 'Ollama AI';
      case 'huggingface': return 'HuggingFace';
      case 'local': return 'CivicOS';
      default: return 'Assistant';
    }
  };

  if (!isOpen) {
    return null; // Chat button will be in navigation instead
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 z-50 shadow-2xl border-red-200",
      isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-red-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-sm font-medium">CivicAI Assistant</CardTitle>
          {aiStatus && (
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
              {aiStatus.ollama ? 'Ollama' : aiStatus.huggingface ? 'HF' : 'Local'}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20"
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      message.role === 'user'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        
                        {message.role === 'assistant' && (
                          <div className="mt-2 space-y-1">
                            {message.source && (
                              <Badge 
                                variant={getSourceBadgeVariant(message.source)} 
                                className="text-xs"
                              >
                                {getSourceLabel(message.source)}
                              </Badge>
                            )}
                            
                            {message.relatedTopics && message.relatedTopics.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {message.relatedTopics.map((topic) => (
                                  <Badge 
                                    key={topic} 
                                    variant="outline" 
                                    className="text-xs cursor-pointer hover:bg-red-50"
                                    onClick={() => setInputValue(`Tell me about ${topic}`)}
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Canadian politics, bills, politicians..."
                className="flex-1"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sendMessageMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1 mt-2">
              {[
                'Recent Bills',
                'My MP',
                'Voting Guide',
                'Legal Rights'
              ].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInputValue(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}