import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, Send, MapPin, Users, AlertTriangle, TrendingUp, MessageSquare, FileText } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  analysisType?: "bill" | "politician" | "general";
  metadata?: {
    billId?: number;
    politicianId?: number;
    region?: string;
    confidence?: number;
    sources?: string[];
  };
}

interface AIResponse {
  response: string;
  analysisType: "bill" | "politician" | "general";
  confidence: number;
  sources: string[];
  relatedData?: {
    bills?: any[];
    politicians?: any[];
    votes?: any[];
  };
  followUpSuggestions?: string[];
}

export function CivicAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I'm your CivicOS AI assistant. Ask me about any legislation, politician, or political issue and I'll give you the straight facts with no sugar-coating. I can analyze voting patterns, call out inconsistencies, and help you understand what's really happening in government. What do you want to know?",
      timestamp: new Date(),
      analysisType: "general",
    }
  ]);
  const [input, setInput] = useState("");
  const [userRegion, setUserRegion] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (query: string) => {
      return await apiRequest("/api/ai/chat", "POST", { 
        query, 
        region: userRegion,
        conversationHistory: messages.slice(-5) // Last 5 messages for context
      }) as AIResponse;
    },
    onSuccess: (data, query) => {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date(),
      };

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        analysisType: data.analysisType,
        metadata: {
          confidence: data.confidence,
          sources: data.sources,
          region: userRegion || undefined,
        }
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      
      // Auto-ask for region if not set and response involves regional data
      if (!userRegion && (data.analysisType === "politician" || data.response.includes("region"))) {
        setTimeout(() => {
          const regionMessage: Message = {
            id: `region-${Date.now()}`,
            role: "assistant",
            content: "What's your region or constituency? This helps me show you which specific politicians represent you and how they voted on issues you're asking about.",
            timestamp: new Date(),
            analysisType: "general",
          };
          setMessages(prev => [...prev, regionMessage]);
        }, 500);
      }
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Error analyzing your question: ${error.message}. Try rephrasing or asking about a specific bill number or politician name.`,
        timestamp: new Date(),
        analysisType: "general",
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check if user is setting their region
    const regionRegex = /(?:i'm (?:from|in)|my (?:region|constituency) is|i live in) (.+)/i;
    const regionMatch = input.match(regionRegex);
    
    if (regionMatch) {
      const region = regionMatch[1].trim();
      setUserRegion(region);
      const confirmMessage: Message = {
        id: `region-confirm-${Date.now()}`,
        role: "assistant",
        content: `Got it! I've set your region to ${region}. Now I can show you exactly how your representatives voted and what they've said about specific issues. What would you like to know about your politicians or any legislation?`,
        timestamp: new Date(),
        analysisType: "general",
        metadata: { region }
      };
      setMessages(prev => [...prev, {
        id: `user-region-${Date.now()}`,
        role: "user",
        content: input,
        timestamp: new Date(),
      }, confirmMessage]);
      setInput("");
      return;
    }

    chatMutation.mutate(input);
    setInput("");
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getAnalysisIcon = (type?: string) => {
    switch (type) {
      case "bill": return <FileText className="w-4 h-4" />;
      case "politician": return <Users className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "bg-gray-100 text-gray-800";
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-civic-blue" />
            <CardTitle className="text-lg">CivicOS AI Assistant</CardTitle>
          </div>
          {userRegion && (
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {userRegion}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Ask about any legislation, politician, or voting pattern. I'll give you the unfiltered truth.
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-civic-blue text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      {getAnalysisIcon(message.analysisType)}
                      <span className="text-xs font-medium">
                        {message.analysisType === "bill" ? "Bill Analysis" :
                         message.analysisType === "politician" ? "Politician Analysis" :
                         "General Response"}
                      </span>
                      {message.metadata?.confidence && (
                        <Badge className={`text-xs ${getConfidenceColor(message.metadata.confidence)}`}>
                          {Math.round(message.metadata.confidence * 100)}% confident
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {message.metadata?.sources && message.metadata.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.metadata.sources.map((source, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any bill, politician, or issue..."
            disabled={chatMutation.isPending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={chatMutation.isPending || !input.trim()}
            className="bg-civic-blue hover:bg-civic-blue/90"
          >
            {chatMutation.isPending ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>

        {!userRegion && (
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Tell me your region or constituency to get personalized information about your representatives
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}