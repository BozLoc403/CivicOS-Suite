import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  analysisType?: "bill" | "politician" | "general" | "news";
  metadata?: {
    billId?: number;
    politicianId?: number;
    newsSource?: string;
    truthScore?: number;
    confidence?: number;
    sources?: string[];
    propagandaRisk?: "low" | "medium" | "high";
  };
}

interface AIResponse {
  response: string;
  analysisType: "bill" | "politician" | "general" | "news";
  confidence: number;
  sources: string[];
  truthScore?: number;
  propagandaRisk?: "low" | "medium" | "high";
  relatedData?: {
    bills?: any[];
    politicians?: any[];
    newsArticles?: any[];
  };
  followUpSuggestions?: string[];
}

export function FloatingCivicBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: user ? 
          `Hey ${user.firstName || 'there'}! I'm your CivicOS assistant. I provide brutally honest analysis of politicians, bills, and news. I can detect propaganda, rate truthfulness, and give you the real story behind political events. What would you like to know?` :
          "Welcome to CivicOS! I provide unfiltered analysis of Canadian politics, detect propaganda, and rate politician truthfulness. What would you like to analyze?",
        timestamp: new Date(),
        analysisType: "general",
        metadata: { confidence: 100 }
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, user]);

  const sendMessageMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('/api/civic/chat', 'POST', {
        query,
        region: 'canada',
        conversationHistory: messages.slice(-5).map(m => ({
          role: m.role,
          content: m.content
        }))
      });
      return response as AIResponse;
    },
    onSuccess: (aiResponse: AIResponse) => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse.response,
        timestamp: new Date(),
        analysisType: aiResponse.analysisType,
        metadata: {
          confidence: aiResponse.confidence,
          sources: aiResponse.sources,
          truthScore: aiResponse.truthScore,
          propagandaRisk: aiResponse.propagandaRisk,
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm having trouble connecting to my analysis systems right now. This might be because my AI services need to be configured. Please try again in a moment.",
        timestamp: new Date(),
        analysisType: "general",
        metadata: { confidence: 0 }
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    },
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    sendMessageMutation.mutate(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAnalysisIcon = (type?: string) => {
    switch (type) {
      case "bill": return <Info className="w-4 h-4" />;
      case "politician": return <AlertTriangle className="w-4 h-4" />;
      case "news": return <MessageCircle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getTruthScoreColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-800";
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPropagandaRiskColor = (risk?: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-civic-blue hover:bg-civic-blue/90 shadow-lg z-50"
          size="lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`fixed bottom-6 right-6 z-50 shadow-2xl border-2 border-civic-blue transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          <CardHeader className="p-4 bg-civic-blue text-white flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-sm">CivicOS AI Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[280px] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-civic-blue text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center space-x-2 mb-2">
                          {getAnalysisIcon(message.analysisType)}
                          <span className="text-xs font-medium">
                            {message.analysisType === "bill" && "Bill Analysis"}
                            {message.analysisType === "politician" && "Politician Analysis"}
                            {message.analysisType === "news" && "News Analysis"}
                            {message.analysisType === "general" && "General Analysis"}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.role === "assistant" && message.metadata && (
                        <div className="mt-2 space-y-1">
                          {message.metadata.confidence !== undefined && (
                            <Badge variant="outline" className="text-xs">
                              {message.metadata.confidence}% confidence
                            </Badge>
                          )}
                          
                          {message.metadata.truthScore !== undefined && (
                            <Badge className={`text-xs ${getTruthScoreColor(message.metadata.truthScore)}`}>
                              Truth Score: {message.metadata.truthScore}%
                            </Badge>
                          )}
                          
                          {message.metadata.propagandaRisk && (
                            <Badge className={`text-xs ${getPropagandaRiskColor(message.metadata.propagandaRisk)}`}>
                              Propaganda Risk: {message.metadata.propagandaRisk}
                            </Badge>
                          )}
                          
                          {message.metadata.sources && message.metadata.sources.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              Sources: {message.metadata.sources.slice(0, 2).join(", ")}
                              {message.metadata.sources.length > 2 && "..."}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[280px]">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about politicians, bills, or news..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-civic-blue hover:bg-civic-blue/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  I provide unfiltered analysis and detect propaganda in real-time.
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}