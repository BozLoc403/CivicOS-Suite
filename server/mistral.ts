import fetch from 'node-fetch';

interface MistralRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Mistral AI service for content analysis and simplification
 */
export class MistralAI {
  private apiKey: string;
  private baseUrl = 'https://api.mistral.ai/v1';

  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY || 'IhBrACakY5wpsSbZqgiJyhPkysQP4Z0h';
  }

  /**
   * Analyze content authenticity and credibility
   */
  async analyzeContentAuthenticity(content: string, source: string): Promise<{
    isAuthentic: boolean;
    credibilityScore: number;
    issues: string[];
    recommendation: string;
  }> {
    try {
      const response = await this.makeRequest({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: `You are an expert fact-checker and content authenticity analyzer. Analyze the provided content for authenticity, credibility, and potential misinformation. Respond with JSON format only.`
          },
          {
            role: 'user',
            content: `Analyze this content from ${source}:\n\n${content}\n\nProvide analysis in JSON format with: isAuthentic (boolean), credibilityScore (0-100), issues (array of strings), recommendation (string)`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        isAuthentic: analysis.isAuthentic || false,
        credibilityScore: Math.max(0, Math.min(100, analysis.credibilityScore || 50)),
        issues: analysis.issues || [],
        recommendation: analysis.recommendation || 'Further verification needed'
      };
    } catch (error) {
      console.error('Mistral authenticity analysis error:', error);
      return {
        isAuthentic: false,
        credibilityScore: 50,
        issues: ['Analysis unavailable'],
        recommendation: 'Manual verification required'
      };
    }
  }

  /**
   * Simplify complex political content for public understanding
   */
  async simplifyContent(content: string, type: string, audience: string): Promise<{
    simplifiedContent: string;
    keyPoints: string[];
    summary: string;
    readingLevel: string;
  }> {
    try {
      const systemPrompt = this.buildSimplificationPrompt(type, audience);
      
      const response = await this.makeRequest({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Simplify this ${type} for ${audience} audience:\n\n${content}\n\nProvide response in JSON format with: simplifiedContent, keyPoints (array), summary, readingLevel`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return {
        simplifiedContent: result.simplifiedContent || content,
        keyPoints: result.keyPoints || [],
        summary: result.summary || '',
        readingLevel: result.readingLevel || 'intermediate'
      };
    } catch (error) {
      console.error('Mistral content simplification error:', error);
      return {
        simplifiedContent: content,
        keyPoints: [],
        summary: 'Simplification unavailable',
        readingLevel: 'advanced'
      };
    }
  }

  /**
   * Analyze politician statements and extract controversies
   */
  async analyzeControversies(newsContent: string, sourceUrl: string): Promise<Array<{
    politician: string;
    party: string;
    controversy: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    publicImpact: number;
    description: string;
  }>> {
    try {
      const response = await this.makeRequest({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: `You are a political analyst specializing in controversy detection. Analyze news content for politician controversies, scandals, or significant public disputes. Extract structured data about each controversy found.`
          },
          {
            role: 'user',
            content: `Analyze this news content for politician controversies:\n\n${newsContent}\n\nSource: ${sourceUrl}\n\nExtract controversies in JSON array format with: politician, party, controversy, severity (low/medium/high/critical), publicImpact (0-100), description`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });

      const controversies = JSON.parse(response.choices[0].message.content);
      return Array.isArray(controversies) ? controversies : [];
    } catch (error) {
      console.error('Mistral controversy analysis error:', error);
      return [];
    }
  }

  /**
   * Analyze sentiment of political content
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    emotions: string[];
  }> {
    try {
      const response = await this.makeRequest({
        model: 'mistral-medium-latest',
        messages: [
          {
            role: 'system',
            content: `You are a sentiment analysis expert. Analyze the emotional tone and sentiment of political content. Respond in JSON format only.`
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this text:\n\n${text}\n\nProvide JSON with: sentiment (positive/negative/neutral), confidence (0-1), emotions (array of emotion words)`
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        sentiment: analysis.sentiment || 'neutral',
        confidence: Math.max(0, Math.min(1, analysis.confidence || 0.5)),
        emotions: analysis.emotions || []
      };
    } catch (error) {
      console.error('Mistral sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        emotions: []
      };
    }
  }

  /**
   * Generate bill summary and key points
   */
  async summarizeBill(billText: string): Promise<{
    summary: string;
    keyPoints: string[];
    impact: string;
    complexity: 'low' | 'medium' | 'high';
  }> {
    try {
      const response = await this.makeRequest({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: `You are a legislative analyst. Summarize bills and legislation in clear, accessible language for public understanding.`
          },
          {
            role: 'user',
            content: `Summarize this bill/legislation:\n\n${billText}\n\nProvide JSON with: summary, keyPoints (array), impact, complexity (low/medium/high)`
          }
        ],
        temperature: 0.2,
        max_tokens: 1500
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        summary: analysis.summary || 'Summary unavailable',
        keyPoints: analysis.keyPoints || [],
        impact: analysis.impact || 'Impact assessment pending',
        complexity: analysis.complexity || 'medium'
      };
    } catch (error) {
      console.error('Mistral bill analysis error:', error);
      return {
        summary: 'Analysis unavailable',
        keyPoints: [],
        impact: 'Assessment pending',
        complexity: 'medium'
      };
    }
  }

  /**
   * Make request to Mistral API
   */
  private async makeRequest(payload: MistralRequest): Promise<MistralResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<MistralResponse>;
  }

  /**
   * Build system prompt for content simplification
   */
  private buildSimplificationPrompt(type: string, audience: string): string {
    const basePrompt = `You are an expert content simplifier specializing in making complex political and legal content accessible to the public.`;
    
    const typeInstructions = {
      'bill_text': 'Focus on practical implications, voting deadlines, and citizen impact.',
      'legal_document': 'Explain legal concepts in everyday language with real-world examples.',
      'political_statement': 'Clarify policy positions and potential consequences.',
      'news_article': 'Highlight key facts and verify claims for accuracy.'
    };

    const audienceInstructions = {
      'general': 'Use clear, everyday language suitable for high school reading level.',
      'youth': 'Use modern, engaging language with relatable examples.',
      'senior': 'Use respectful, detailed explanations with context.',
      'newcomer': 'Explain Canadian political processes and terminology.'
    };

    return `${basePrompt}\n\n${typeInstructions[type] || typeInstructions['news_article']}\n\n${audienceInstructions[audience] || audienceInstructions['general']}\n\nAlways respond in JSON format with the requested fields.`;
  }
}

export const mistralAI = new MistralAI();