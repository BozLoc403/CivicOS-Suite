import { mistralAI } from './mistral';
import { db } from './db';
import { eq, and, sql } from 'drizzle-orm';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface SimplificationRequest {
  content: string;
  type: 'news_article' | 'legal_document' | 'political_statement' | 'bill_text';
  targetAudience: 'general' | 'youth' | 'senior' | 'newcomer';
  complexity: 'simple' | 'intermediate' | 'detailed';
}

interface SimplificationResult {
  simplifiedContent: string;
  keyPoints: string[];
  summary: string;
  readingLevel: string;
  confidence: number;
  originalLength: number;
  simplifiedLength: number;
  politiciansInvolved?: Array<{
    name: string;
    position: string;
    stance: string;
    quotes: string[];
  }>;
}

interface ControversyAnalysis {
  id: number;
  politician: {
    name: string;
    party: string;
    position: string;
    profileImage?: string;
  };
  controversy: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    publicImpact: number;
    sources: string[];
    dateReported: string;
  };
  relatedArticles: Array<{
    title: string;
    source: string;
    url: string;
    publishedAt: string;
  }>;
}

/**
 * AI-powered content simplification service for civic engagement
 */
export class ContentSimplifier {
  /**
   * Simplify complex political/legal content for public understanding
   */
  async simplifyContent(request: SimplificationRequest): Promise<SimplificationResult> {
    try {
      const result = await mistralAI.simplifyContent(
        request.content,
        request.type,
        request.targetAudience
      );

      // Extract politician information if present
      let politiciansInvolved: any[] = [];
      if (request.type === 'news_article' || request.type === 'political_statement') {
        politiciansInvolved = await this.extractPoliticianStances(request.content);
      }

      return {
        simplifiedContent: result.simplifiedContent,
        keyPoints: result.keyPoints,
        summary: result.summary,
        readingLevel: result.readingLevel,
        confidence: 0.9,
        originalLength: request.content.length,
        simplifiedLength: result.simplifiedContent.length,
        politiciansInvolved
      };
    } catch (error) {
      console.error('Content simplification error:', error);
      throw new Error('Failed to simplify content');
    }
  }

  /**
   * Analyze and track politician controversies from news content
   */
  async analyzeControversies(newsContent: string, sourceUrl: string): Promise<ControversyAnalysis[]> {
    try {
      const controversyPrompt = `
        Analyze this news content for any political controversies, scandals, or controversial statements by Canadian politicians.
        
        For each controversy found, extract:
        1. Politician name and position
        2. Nature of the controversy
        3. Severity level (low/medium/high/critical)
        4. Public impact assessment (0-100%)
        5. Key quotes or statements
        
        Return analysis in JSON format with array of controversies.
      `;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: controversyPrompt,
        messages: [
          {
            role: 'user',
            content: newsContent
          }
        ],
      });

      const controversies = this.parseControversyResponse(response.content[0].text);
      
      // Store controversies in database for tracking
      for (const controversy of controversies) {
        await this.storeControversy(controversy, sourceUrl);
      }

      return controversies;
    } catch (error) {
      console.error('Controversy analysis error:', error);
      return [];
    }
  }

  /**
   * Extract politician stances and quotes from content
   */
  async extractPoliticianStances(content: string): Promise<Array<{
    name: string;
    position: string;
    stance: string;
    quotes: string[];
  }>> {
    try {
      const stancePrompt = `
        Extract all Canadian politicians mentioned in this content along with:
        1. Their official position/title
        2. Their stance on the issue discussed
        3. Direct quotes (if any)
        4. Party affiliation
        
        Return as JSON array.
      `;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: stancePrompt,
        messages: [
          {
            role: 'user',
            content: content
          }
        ],
      });

      return this.parseStanceResponse(response.content[0].text);
    } catch (error) {
      console.error('Stance extraction error:', error);
      return [];
    }
  }

  /**
   * Build system prompt based on content type and audience
   */
  private buildSystemPrompt(type: string, audience: string, complexity: string): string {
    const basePrompt = `You are an expert civic educator specializing in making complex political and legal content accessible to Canadian citizens.`;
    
    const typeInstructions = {
      'news_article': 'Focus on the key facts, who is involved, what happened, and why it matters to Canadians.',
      'legal_document': 'Explain legal terms in plain language, focus on citizen rights and obligations.',
      'political_statement': 'Clarify the politician\'s position, implications for policy, and impact on citizens.',
      'bill_text': 'Explain what the bill does, who it affects, and potential changes to current law.'
    };

    const audienceInstructions = {
      'general': 'Use clear, accessible language appropriate for average Canadian adults.',
      'youth': 'Use engaging, modern language that resonates with young Canadians aged 16-25.',
      'senior': 'Use respectful, detailed explanations with context for historical references.',
      'newcomer': 'Explain Canadian political processes and avoid cultural assumptions.'
    };

    const complexityInstructions = {
      'simple': 'Keep explanations very basic, use short sentences, avoid jargon.',
      'intermediate': 'Provide moderate detail with some context and background.',
      'detailed': 'Include comprehensive explanations with full context and implications.'
    };

    return `${basePrompt}

${typeInstructions[type] || typeInstructions['news_article']}

Target audience: ${audienceInstructions[audience] || audienceInstructions['general']}

Complexity level: ${complexityInstructions[complexity] || complexityInstructions['intermediate']}

Always include:
- A brief summary (2-3 sentences)
- 3-5 key points in bullet format
- Reading level assessment
- Any politicians involved and their positions

Format your response as JSON with keys: summary, keyPoints, simplifiedContent, readingLevel, politiciansInvolved`;
  }

  /**
   * Parse AI response into structured result
   */
  private parseSimplificationResponse(responseText: string, originalContent: string): SimplificationResult {
    try {
      const parsed = JSON.parse(responseText);
      
      return {
        simplifiedContent: parsed.simplifiedContent || responseText,
        keyPoints: parsed.keyPoints || [],
        summary: parsed.summary || '',
        readingLevel: parsed.readingLevel || 'intermediate',
        confidence: 0.85, // Default confidence
        originalLength: originalContent.length,
        simplifiedLength: (parsed.simplifiedContent || responseText).length,
        politiciansInvolved: parsed.politiciansInvolved || []
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        simplifiedContent: responseText,
        keyPoints: [],
        summary: responseText.substring(0, 200) + '...',
        readingLevel: 'intermediate',
        confidence: 0.7,
        originalLength: originalContent.length,
        simplifiedLength: responseText.length
      };
    }
  }

  /**
   * Parse controversy analysis response
   */
  private parseControversyResponse(responseText: string): ControversyAnalysis[] {
    try {
      const parsed = JSON.parse(responseText);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Failed to parse controversy response:', error);
      return [];
    }
  }

  /**
   * Parse politician stance response
   */
  private parseStanceResponse(responseText: string): Array<{
    name: string;
    position: string;
    stance: string;
    quotes: string[];
  }> {
    try {
      const parsed = JSON.parse(responseText);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Failed to parse stance response:', error);
      return [];
    }
  }

  /**
   * Store controversy in database for tracking
   */
  private async storeControversy(controversy: ControversyAnalysis, sourceUrl: string): Promise<void> {
    try {
      // Find politician in database
      const politician = await db.execute(sql`
        SELECT id, name, party, position 
        FROM politicians 
        WHERE name ILIKE ${`%${controversy.politician.name}%`}
        LIMIT 1
      `);

      if (politician.rows.length > 0) {
        // Store controversy record
        await db.execute(sql`
          INSERT INTO politician_controversies 
          (politician_id, title, description, severity, public_impact, source_url, date_reported)
          VALUES (${politician.rows[0].id}, ${controversy.controversy.title}, 
                  ${controversy.controversy.description}, ${controversy.controversy.severity},
                  ${controversy.controversy.publicImpact}, ${sourceUrl}, NOW())
          ON CONFLICT (politician_id, title) DO UPDATE SET
            public_impact = EXCLUDED.public_impact,
            date_reported = EXCLUDED.date_reported
        `);
      }
    } catch (error) {
      console.error('Failed to store controversy:', error);
    }
  }
}

export const contentSimplifier = new ContentSimplifier();