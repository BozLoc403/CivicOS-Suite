/**
 * Free AI Service for CivicOS
 * Uses Hugging Face Inference API (free tier) as primary AI service
 */

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface AIResponse {
  message: string;
  confidence: number;
  source: 'huggingface' | 'local' | 'fallback';
  relatedTopics?: string[];
}

interface CivicContext {
  politicians?: any[];
  bills?: any[];
  recentNews?: any[];
  userLocation?: string;
}

export class FreeAiService {
  private huggingFaceApiKey = process.env.HUGGINGFACE_API_KEY || '';
  private huggingFaceUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';
  
  constructor() {
    // No initialization needed
  }

  /**
   * Main chat function that routes to available AI service
   */
  async chat(
    message: string, 
    conversationHistory: ChatMessage[] = [],
    civicContext?: CivicContext
  ): Promise<AIResponse> {
    // Try Hugging Face first, then fallback to rule-based
    if (this.huggingFaceApiKey) {
      try {
        return await this.chatWithHuggingFace(message, conversationHistory, civicContext);
      } catch (error) {
        console.log('HuggingFace unavailable, using fallback');
        return this.chatWithFallback(message, conversationHistory, civicContext);
      }
    }
    
    return this.chatWithFallback(message, conversationHistory, civicContext);
  }

  /**
   * Chat using Hugging Face Inference API (free tier)
   */
  private async chatWithHuggingFace(
    message: string,
    conversationHistory: ChatMessage[],
    civicContext?: CivicContext
  ): Promise<AIResponse> {
    const systemPrompt = this.generateCivicSystemPrompt(civicContext);
    const prompt = this.formatPromptForHuggingFace(message, conversationHistory, systemPrompt);
    
    const response = await fetch(this.huggingFaceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.huggingFaceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error('HuggingFace request failed');
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text || '';
    
    // Extract just the assistant's response
    const assistantResponse = generatedText.split('Assistant:').pop()?.trim() || 
                             'I can help you with Canadian civic matters. What would you like to know?';
    
    return {
      message: assistantResponse,
      confidence: 0.8,
      source: 'huggingface',
      relatedTopics: this.extractRelatedTopics(message, civicContext)
    };
  }

  /**
   * Fallback chat using rule-based responses and context
   */
  private async chatWithFallback(
    message: string,
    conversationHistory: ChatMessage[],
    civicContext?: CivicContext
  ): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Civic-specific pattern matching
    if (lowerMessage.includes('bill') || lowerMessage.includes('legislation')) {
      return this.generateBillResponse(message, civicContext);
    }
    
    if (lowerMessage.includes('politician') || lowerMessage.includes('mp') || lowerMessage.includes('minister')) {
      return this.generatePoliticianResponse(message, civicContext);
    }
    
    if (lowerMessage.includes('vote') || lowerMessage.includes('voting') || lowerMessage.includes('election')) {
      return this.generateVotingResponse(message, civicContext);
    }
    
    if (lowerMessage.includes('news') || lowerMessage.includes('current') || lowerMessage.includes('recent')) {
      return this.generateNewsResponse(message, civicContext);
    }
    
    if (lowerMessage.includes('legal') || lowerMessage.includes('law') || lowerMessage.includes('court')) {
      return this.generateLegalResponse(message, civicContext);
    }

    // General civic assistance
    return {
      message: this.generateGeneralCivicResponse(message, civicContext),
      confidence: 0.6,
      source: 'fallback',
      relatedTopics: this.extractRelatedTopics(message, civicContext)
    };
  }

  /**
   * Generate system prompt for civic AI
   */
  private generateCivicSystemPrompt(civicContext?: CivicContext): string {
    return `You are CivicAI, an intelligent assistant for CivicOS - Canada's digital democracy platform. You help citizens understand:

- Politicians and their voting records
- Bills and legislation 
- Legal frameworks and rights
- Election processes and civic engagement
- Government transparency and accountability

Always provide factual, non-partisan information. Encourage civic participation and democratic engagement. Keep responses concise and helpful.

Current Context:
- Politicians tracked: ${civicContext?.politicians?.length || 0}
- Active bills: ${civicContext?.bills?.length || 0}
- Recent news items: ${civicContext?.recentNews?.length || 0}

Respond as a helpful civic assistant focused on Canadian democracy and government accountability.`;
  }

  /**
   * Format prompt for Hugging Face
   */
  private formatPromptForHuggingFace(
    message: string,
    history: ChatMessage[],
    systemPrompt: string
  ): string {
    let prompt = systemPrompt + '\n\n';
    
    // Add conversation history (last 3 exchanges)
    history.slice(-6).forEach(msg => {
      prompt += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n`;
    });
    
    prompt += `Human: ${message}\nAssistant:`;
    return prompt;
  }

  /**
   * Generate bill-related response
   */
  private generateBillResponse(message: string, civicContext?: CivicContext): AIResponse {
    const bills = civicContext?.bills || [];
    const recentBill = bills[0];
    
    if (recentBill) {
      return {
        message: `I can help you understand Canadian legislation. The most recent bill in our database is "${recentBill.title}" (${recentBill.billNumber}). It's currently ${recentBill.status}. Would you like me to explain its key provisions or voting record?`,
        confidence: 0.8,
        source: 'local',
        relatedTopics: ['Bills & Legislation', 'Parliamentary Process', 'Voting Records']
      };
    }
    
    return {
      message: 'I can help you understand Canadian bills and legislation. Our platform tracks federal, provincial, and municipal bills. You can search for specific bills, view voting records, and see AI summaries of complex legislation. What specific bill or topic interests you?',
      confidence: 0.7,
      source: 'fallback',
      relatedTopics: ['Bills & Legislation', 'Parliamentary Process']
    };
  }

  /**
   * Generate politician-related response
   */
  private generatePoliticianResponse(message: string, civicContext?: CivicContext): AIResponse {
    const politicians = civicContext?.politicians || [];
    
    return {
      message: `CivicOS tracks ${politicians.length > 0 ? politicians.length : '85,000+'} politicians across Canada at federal, provincial, and municipal levels. I can help you find information about specific politicians, their voting records, contact details, and trust scores. Which politician or political topic would you like to explore?`,
      confidence: 0.8,
      source: 'local',
      relatedTopics: ['Politicians', 'Voting Records', 'Contact Information', 'Trust Metrics']
    };
  }

  /**
   * Generate voting-related response
   */
  private generateVotingResponse(message: string, civicContext?: CivicContext): AIResponse {
    return {
      message: 'Our voting system allows you to participate in civic engagement by voting on bills, petitions, and civic issues. Your votes contribute to public opinion tracking and help measure the gap between public sentiment and political action. All voting is tracked transparently in our Civic Ledger. Would you like to see current voting opportunities?',
      confidence: 0.8,
      source: 'local',
      relatedTopics: ['Civic Engagement', 'Voting System', 'Civic Ledger', 'Public Opinion']
    };
  }

  /**
   * Generate news-related response
   */
  private generateNewsResponse(message: string, civicContext?: CivicContext): AIResponse {
    const news = civicContext?.recentNews || [];
    
    if (news.length > 0) {
      const recentArticle = news[0];
      return {
        message: `Our AI analyzes Canadian political news from multiple sources. Recent coverage includes "${recentArticle.title}". We provide bias analysis, credibility scoring, and connections to relevant politicians and bills. Would you like to explore our news analysis features?`,
        confidence: 0.8,
        source: 'local',
        relatedTopics: ['News Analysis', 'Media Credibility', 'Political Coverage']
      };
    }
    
    return {
      message: 'CivicOS analyzes political news from major Canadian sources including CBC, Globe and Mail, and National Post. Our AI provides bias analysis, credibility scoring, and connects news to relevant politicians and legislation. What political news topic interests you?',
      confidence: 0.7,
      source: 'fallback',
      relatedTopics: ['News Analysis', 'Media Bias', 'Political Coverage']
    };
  }

  /**
   * Generate legal-related response
   */
  private generateLegalResponse(message: string, civicContext?: CivicContext): AIResponse {
    return {
      message: 'Our legal database contains the complete Canadian legal framework including the Criminal Code, Charter of Rights and Freedoms, and provincial legislation. You can search legal sections, view court cases, and understand your rights. Our AI can explain complex legal concepts in plain language. What legal topic would you like to explore?',
      confidence: 0.8,
      source: 'local',
      relatedTopics: ['Legal Database', 'Charter Rights', 'Court Cases', 'Legal Search']
    };
  }

  /**
   * Generate general civic response
   */
  private generateGeneralCivicResponse(message: string, civicContext?: CivicContext): string {
    const responses = [
      'I\'m here to help you navigate Canadian democracy. I can explain government processes, help you find your representatives, track legislation, and connect you with civic engagement opportunities.',
      'CivicOS is your gateway to government transparency. I can help you understand how decisions are made, track your politicians\' activities, and participate in democratic processes.',
      'As your civic AI assistant, I can help you stay informed about Canadian politics, understand complex legislation, and make your voice heard in democratic processes.',
      'I\'m designed to make Canadian democracy more accessible. Whether you\'re looking for politician contact info, bill summaries, or voting opportunities, I\'m here to help.'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Extract related topics from message and context
   */
  private extractRelatedTopics(message: string, civicContext?: CivicContext): string[] {
    const topics = new Set<string>();
    const lowerMessage = message.toLowerCase();
    
    // Add topics based on message content
    if (lowerMessage.includes('bill') || lowerMessage.includes('legislation')) {
      topics.add('Bills & Legislation');
    }
    if (lowerMessage.includes('politician') || lowerMessage.includes('mp')) {
      topics.add('Politicians');
    }
    if (lowerMessage.includes('vote') || lowerMessage.includes('voting')) {
      topics.add('Voting System');
    }
    if (lowerMessage.includes('legal') || lowerMessage.includes('law')) {
      topics.add('Legal Database');
    }
    if (lowerMessage.includes('news')) {
      topics.add('News Analysis');
    }
    
    // Add general civic topics
    topics.add('Civic Engagement');
    topics.add('Government Transparency');
    
    return Array.from(topics).slice(0, 4); // Limit to 4 topics
  }

  /**
   * Get available AI models/services
   */
  async getAvailableServices(): Promise<{
    huggingface: boolean;
    fallback: boolean;
  }> {
    return {
      huggingface: !!this.huggingFaceApiKey,
      fallback: true
    };
  }
}

export const freeAiService = new FreeAiService();