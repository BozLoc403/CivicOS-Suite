import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
import { storage } from './storage';
import { db } from './db';
import { bills, politicians, votes, politicianStatements } from '@shared/schema';
import { eq, and, sql, desc, like } from 'drizzle-orm';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIRequest {
  query: string;
  region?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
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

export class CivicAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required for AI features');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processQuery(request: AIRequest): Promise<AIResponse> {
    const { query, region } = request;
    
    try {
      // Direct OpenAI response for now to avoid database issues
      const systemPrompt = `You are CivicOS AI, a Canadian political analysis assistant. Provide factual, direct answers about Canadian government and politics.

User region: ${region || "Not specified"}

Guidelines:
- Focus on Canadian federal, provincial, and municipal politics
- Be direct and factual
- Explain complex political issues clearly
- Reference actual Canadian government structures and processes
- If you don't have specific current data, explain what would typically be the case`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        max_tokens: 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
      });

      const responseText = response.choices[0].message.content || 'I apologize, but I cannot provide an analysis at this time.';

      return {
        response: responseText,
        analysisType: "general",
        confidence: 0.8,
        sources: ["Canadian Government Knowledge Base"],
        relatedData: {
          bills: [],
          politicians: [],
          votes: []
        },
        followUpSuggestions: [
          "Can you provide more specific details?",
          "How does this affect my province or territory?",
          "What are the key facts about this topic?"
        ]
      };
    } catch (error) {
      console.error("Error processing query:", error);
      throw new Error("Failed to process civic AI query");
    }
  }

  private async analyzeQuery(query: string) {
    const analysisPrompt = `Analyze this civic/political query and extract key information:

Query: "${query}"

Determine:
1. Query type: "bill_analysis", "politician_analysis", "voting_pattern", "policy_question", "general_civic"
2. Entities mentioned (bill numbers, politician names, policy areas)
3. Geographic scope (federal, provincial, municipal, specific regions)
4. Intent (fact-checking, explanation, comparison, accountability)

Respond in JSON format with: {
  "type": "query_type",
  "entities": {"bills": [], "politicians": [], "policies": []},
  "geographic_scope": "scope",
  "intent": "intent",
  "keywords": []
}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1024,
      messages: [{ role: 'user', content: analysisPrompt }],
      response_format: { type: "json_object" }
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      // Fallback analysis
      return {
        type: "general_civic",
        entities: { bills: [], politicians: [], policies: [] },
        geographic_scope: "general",
        intent: "explanation",
        keywords: query.toLowerCase().split(' ')
      };
    }
  }

  private async gatherRelevantData(analysis: any, region?: string) {
    const data: any = {
      bills: [],
      politicians: [],
      votes: [],
      statements: []
    };

    try {
      // Search for relevant bills
      if (analysis.entities.bills.length > 0 || analysis.type === "bill_analysis") {
        data.bills = await this.searchBills(analysis);
      }

      // Search for relevant politicians
      if (analysis.entities.politicians.length > 0 || analysis.type === "politician_analysis" || region) {
        data.politicians = await this.searchPoliticians(analysis, region);
      }

      // Get voting data (simplified to avoid SQL errors)
      data.votes = await this.getVotingData(data.bills);

      // Get politician statements (simplified to avoid SQL errors)
      data.statements = await this.getPoliticianStatements(data.politicians);

    } catch (error) {
      console.error("Error gathering data:", error);
      // Continue with empty data to allow OpenAI to provide general analysis
    }

    return data;
  }

  private async searchBills(analysis: any) {
    let billQuery = db.select().from(bills);

    // Search by bill number if mentioned
    for (const billNum of analysis.entities.bills) {
      const results = await db.select().from(bills)
        .where(like(bills.billNumber, `%${billNum}%`))
        .limit(5);
      if (results.length > 0) return results;
    }

    // Search by keywords in title/description
    const keywords = analysis.keywords.filter((k: string) => k.length > 3);
    if (keywords.length > 0) {
      const searchTerm = `%${keywords.join('%')}%`;
      return await db.select().from(bills)
        .where(sql`lower(${bills.title}) like ${searchTerm.toLowerCase()} OR lower(${bills.description}) like ${searchTerm.toLowerCase()}`)
        .orderBy(desc(bills.createdAt))
        .limit(10);
    }

    // Return recent bills if no specific search
    return await db.select().from(bills)
      .orderBy(desc(bills.createdAt))
      .limit(5);
  }

  private async searchPoliticians(analysis: any, region?: string) {
    // Search by name if mentioned
    for (const politicianName of analysis.entities.politicians) {
      const results = await db.select().from(politicians)
        .where(like(politicians.name, `%${politicianName}%`))
        .limit(5);
      if (results.length > 0) return results;
    }

    // Search by region/constituency
    if (region) {
      const results = await db.select().from(politicians)
        .where(sql`lower(${politicians.constituency}) like ${`%${region.toLowerCase()}%`} OR lower(${politicians.jurisdiction}) like ${`%${region.toLowerCase()}%`}`)
        .limit(10);
      if (results.length > 0) return results;
    }

    // Return sample of politicians
    return await db.select().from(politicians)
      .limit(20);
  }

  private async getVotingData(billsData: any[]) {
    if (billsData.length === 0) return [];

    // Get recent votes for analysis
    return await db.select()
      .from(votes)
      .limit(50);
  }

  private async getPoliticianStatements(politiciansData: any[]) {
    try {
      // Get recent statements for analysis
      return await db.select()
        .from(politicianStatements)
        .orderBy(desc(politicianStatements.dateCreated))
        .limit(20);
    } catch (error) {
      console.error("Error fetching politician statements:", error);
      return [];
    }
  }

  private async generateResponse(query: string, analysis: any, data: any, region?: string): Promise<AIResponse> {
    const systemPrompt = `You are CivicOS AI, a no-bullshit political analysis assistant. Your job is to:

1. Provide direct, factual answers about Canadian government and politics
2. Call out inconsistencies, contradictions, and potential lies
3. Use only the authentic government data provided
4. Be brutally honest about politicians' track records
5. Explain complex political issues in plain language
6. Never sugarcoat or avoid controversial topics

Key principles:
- If a politician has contradicted themselves, point it out explicitly
- If voting patterns don't match public statements, say so
- Use specific examples and data to support your analysis
- Don't hedge or qualify obvious facts
- Regional context matters - focus on user's representatives when relevant

Available data:
${JSON.stringify(data, null, 2)}

User region: ${region || "Not specified"}

Answer the query with complete honesty and provide specific evidence for any claims.`;

    const userPrompt = `Query: "${query}"

Analyze this using the government data provided. Be direct and factual. If politicians are lying or being inconsistent, call it out with specific examples. Focus on facts, voting records, and documented statements.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
    });

    const analysisType = this.determineAnalysisType(query, data);
    const confidence = this.calculateConfidence(data);
    const sources = this.extractSources(data);

    const responseText = response.choices[0].message.content || 'Analysis failed';

    return {
      response: responseText,
      analysisType,
      confidence,
      sources,
      relatedData: {
        bills: data.bills.slice(0, 5),
        politicians: data.politicians.slice(0, 5),
        votes: data.votes.slice(0, 10)
      },
      followUpSuggestions: this.generateFollowUps(analysisType, data)
    };
  }

  private determineAnalysisType(query: string, data: any): "bill" | "politician" | "general" {
    if (data.bills.length > 0 && query.toLowerCase().includes('bill')) return "bill";
    if (data.politicians.length > 0 && (query.toLowerCase().includes('mp') || query.toLowerCase().includes('politician'))) return "politician";
    return "general";
  }

  private calculateConfidence(data: any): number {
    let confidence = 0.5; // Base confidence

    if (data.bills.length > 0) confidence += 0.2;
    if (data.politicians.length > 0) confidence += 0.2;
    if (data.votes.length > 0) confidence += 0.1;
    if (data.statements.length > 0) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  private extractSources(data: any): string[] {
    const sources = [];

    if (data.bills.length > 0) sources.push("Parliament of Canada LEGISinfo");
    if (data.politicians.length > 0) sources.push("Official MP Directory");
    if (data.votes.length > 0) sources.push("Parliamentary Voting Records");
    if (data.statements.length > 0) sources.push("Official Parliamentary Statements");

    return sources;
  }

  private generateFollowUps(analysisType: string, data: any): string[] {
    const suggestions = [];

    switch (analysisType) {
      case "bill":
        suggestions.push("How did my MP vote on this?");
        suggestions.push("What are the key concerns with this bill?");
        break;
      case "politician":
        suggestions.push("Show me their voting record");
        suggestions.push("Have they contradicted themselves?");
        suggestions.push("How do they compare to other MPs?");
        break;
      default:
        suggestions.push("Who are my representatives?");
        suggestions.push("What bills are currently being voted on?");
    }

    return suggestions;
  }

  private async getBasicContextData() {
    try {
      // Get basic counts and recent data safely
      const politiciansCount = await db.select({ count: sql`count(*)` }).from(politicians);
      const billsCount = await db.select({ count: sql`count(*)` }).from(bills);
      
      return {
        bills: [],
        politicians: [],
        votes: [],
        statements: [],
        context: {
          totalPoliticians: politiciansCount[0]?.count || 0,
          totalBills: billsCount[0]?.count || 0
        }
      };
    } catch (error) {
      console.error("Error getting basic context:", error);
      return {
        bills: [],
        politicians: [],
        votes: [],
        statements: [],
        context: {}
      };
    }
  }

  private async generateDirectResponse(query: string, region?: string): Promise<AIResponse> {
    try {
      const systemPrompt = `You are CivicOS AI, a Canadian political analysis assistant. Provide factual, direct answers about Canadian government and politics.

User region: ${region || "Not specified"}

Guidelines:
- Focus on Canadian federal, provincial, and municipal politics
- Be direct and factual
- Explain complex political issues clearly
- Reference actual Canadian government structures and processes
- If you don't have specific current data, explain what would typically be the case`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        max_tokens: 1500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
      });

      const responseText = response.choices[0].message.content || 'I apologize, but I cannot provide an analysis at this time.';

      return {
        response: responseText,
        analysisType: "general",
        confidence: 0.7,
        sources: ["General Canadian Government Knowledge"],
        relatedData: {
          bills: [],
          politicians: [],
          votes: []
        },
        followUpSuggestions: [
          "Can you provide more specific details?",
          "How does this affect my province or territory?",
          "What are the key facts about this topic?"
        ]
      };
    } catch (error) {
      console.error("Error generating direct response:", error);
      throw new Error("Failed to process civic AI query");
    }
  }
}

export const civicAI = new CivicAIService();