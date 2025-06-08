import Anthropic from '@anthropic-ai/sdk';
import { db } from './db';
import { newsArticles } from '@shared/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CrossSourceAnalysis {
  sourceComparison: Array<{
    source: string;
    angle: string;
    bias: string;
    credibility: number;
    keyPoints: string[];
    omittedFacts: string[];
  }>;
  consensusFacts: string[];
  contradictions: Array<{
    fact: string;
    sources: Array<{
      source: string;
      claim: string;
      evidence: string;
    }>;
  }>;
  mediaManipulation: {
    detectedTechniques: string[];
    propagandaElements: string[];
    emotionalLanguage: string[];
  };
  unbiasedSummary: string;
  reliabilityScore: number;
  recommendations: string[];
}

interface NewsComparison {
  primaryArticle: any;
  relatedArticles: any[];
  crossSourceAnalysis: CrossSourceAnalysis;
  factCheckResults: {
    verifiedFacts: string[];
    disputedClaims: string[];
    unsupportedStatements: string[];
  };
  publicInterestScore: number;
  credibilityAssessment: {
    overallScore: number;
    sourceDiversity: number;
    factualAccuracy: number;
    biasLevel: string;
  };
}

/**
 * Advanced AI-powered news comparison and analysis service
 * Provides unbiased critique and cross-source verification
 */
export class NewsComparisonService {
  
  /**
   * Perform comprehensive cross-source news analysis
   */
  async performCrossSourceAnalysis(articleId: number): Promise<NewsComparison> {
    try {
      // Get primary article
      const [primaryArticle] = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.id, articleId));

      if (!primaryArticle) {
        throw new Error('Article not found');
      }

      // Find related articles on the same topic
      const relatedArticles = await this.findRelatedArticles(primaryArticle);

      // Perform AI-powered cross-source analysis
      const crossSourceAnalysis = await this.analyzeCrossSources(primaryArticle, relatedArticles);

      // Fact-check all claims
      const factCheckResults = await this.performFactCheck(primaryArticle, relatedArticles);

      // Calculate public interest score
      const publicInterestScore = await this.calculatePublicInterestScore(primaryArticle, relatedArticles);

      // Overall credibility assessment
      const credibilityAssessment = await this.assessOverallCredibility(primaryArticle, relatedArticles, crossSourceAnalysis);

      return {
        primaryArticle,
        relatedArticles,
        crossSourceAnalysis,
        factCheckResults,
        publicInterestScore,
        credibilityAssessment
      };

    } catch (error) {
      console.error('Cross-source analysis error:', error);
      throw error;
    }
  }

  /**
   * Find articles covering the same story from different sources
   */
  private async findRelatedArticles(primaryArticle: any): Promise<any[]> {
    const keywords = this.extractKeywords(primaryArticle.title + ' ' + primaryArticle.summary);
    
    // Find articles with similar keywords published within 48 hours
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
    const relatedArticles = await db
      .select()
      .from(newsArticles)
      .where(
        and(
          gte(newsArticles.publishedAt, twoDaysAgo.toISOString()),
          // Use title/summary similarity (simplified - in production would use vector similarity)
        )
      )
      .orderBy(desc(newsArticles.publishedAt))
      .limit(10);

    return relatedArticles.filter(article => 
      article.id !== primaryArticle.id && 
      this.calculateSimilarity(primaryArticle, article) > 0.6
    );
  }

  /**
   * AI-powered analysis of multiple sources covering the same story
   */
  private async analyzeCrossSources(primaryArticle: any, relatedArticles: any[]): Promise<CrossSourceAnalysis> {
    const allArticles = [primaryArticle, ...relatedArticles];
    
    const analysisPrompt = `
Analyze these news articles covering the same story from different sources. Provide comprehensive cross-source analysis:

PRIMARY ARTICLE:
Source: ${primaryArticle.source}
Title: ${primaryArticle.title}
Content: ${primaryArticle.summary}
Bias Rating: ${primaryArticle.bias}
Credibility: ${primaryArticle.credibilityScore}

RELATED ARTICLES:
${relatedArticles.map(article => `
Source: ${article.source}
Title: ${article.title}
Content: ${article.summary}
Bias Rating: ${article.bias}
Credibility: ${article.credibilityScore}
`).join('\n')}

Provide analysis in JSON format with:
1. sourceComparison: Compare each source's angle, bias, credibility, key points, and omitted facts
2. consensusFacts: Facts agreed upon by multiple credible sources
3. contradictions: Claims that contradict between sources with evidence
4. mediaManipulation: Detected propaganda techniques, emotional language, manipulation
5. unbiasedSummary: Objective summary based on verified facts
6. reliabilityScore: Overall reliability (0-100)
7. recommendations: Advice for readers on interpreting this story
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      system: "You are an expert media analyst specializing in detecting bias, propaganda, and providing unbiased news analysis. Focus on Canadian media and political context.",
      messages: [
        { role: 'user', content: analysisPrompt }
      ],
    });

    return JSON.parse(response.content[0].text);
  }

  /**
   * Comprehensive fact-checking across all sources
   */
  private async performFactCheck(primaryArticle: any, relatedArticles: any[]): Promise<any> {
    const allClaims = this.extractClaims([primaryArticle, ...relatedArticles]);
    
    const factCheckPrompt = `
Perform comprehensive fact-checking on these claims from multiple news sources:

CLAIMS TO VERIFY:
${allClaims.map((claim, index) => `${index + 1}. ${claim.text} (Source: ${claim.source})`).join('\n')}

For each claim, determine:
1. Is it verifiable with official sources?
2. What evidence supports or contradicts it?
3. Is it taken out of context?
4. Are there missing nuances?

Respond in JSON format with:
- verifiedFacts: Claims supported by evidence
- disputedClaims: Claims with conflicting evidence
- unsupportedStatements: Claims lacking evidence
`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: "You are a professional fact-checker with expertise in Canadian politics and government. Verify claims against official sources.",
      messages: [
        { role: 'user', content: factCheckPrompt }
      ],
    });

    return JSON.parse(response.content[0].text);
  }

  /**
   * Calculate public interest and impact score
   */
  private async calculatePublicInterestScore(primaryArticle: any, relatedArticles: any[]): Promise<number> {
    const factors = {
      politicianInvolvement: this.countPoliticianMentions([primaryArticle, ...relatedArticles]),
      policyImpact: this.assessPolicyImpact([primaryArticle, ...relatedArticles]),
      publicSafety: this.assessPublicSafetyRelevance([primaryArticle, ...relatedArticles]),
      economicImpact: this.assessEconomicImpact([primaryArticle, ...relatedArticles]),
      sourceCredibility: this.averageCredibilityScore([primaryArticle, ...relatedArticles]),
      controversyLevel: this.assessControversyLevel([primaryArticle, ...relatedArticles])
    };

    // Weighted calculation of public interest
    return Math.round(
      (factors.politicianInvolvement * 0.2) +
      (factors.policyImpact * 0.25) +
      (factors.publicSafety * 0.2) +
      (factors.economicImpact * 0.15) +
      (factors.sourceCredibility * 0.1) +
      (factors.controversyLevel * 0.1)
    );
  }

  /**
   * Assess overall credibility of the story coverage
   */
  private async assessOverallCredibility(primaryArticle: any, relatedArticles: any[], analysis: CrossSourceAnalysis): Promise<any> {
    const allArticles = [primaryArticle, ...relatedArticles];
    
    const sourceDiversity = new Set(allArticles.map(a => a.source)).size;
    const avgCredibility = this.averageCredibilityScore(allArticles);
    const biasSpread = this.calculateBiasSpread(allArticles);
    
    const overallScore = Math.round(
      (avgCredibility * 0.4) +
      (sourceDiversity * 10 * 0.3) + // More sources = better
      (analysis.reliabilityScore * 0.3)
    );

    return {
      overallScore: Math.min(100, overallScore),
      sourceDiversity: sourceDiversity,
      factualAccuracy: analysis.reliabilityScore,
      biasLevel: this.determineBiasLevel(biasSpread)
    };
  }

  // Helper methods
  private extractKeywords(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  }

  private calculateSimilarity(article1: any, article2: any): number {
    const keywords1 = this.extractKeywords(article1.title + ' ' + article1.summary);
    const keywords2 = this.extractKeywords(article2.title + ' ' + article2.summary);
    
    const intersection = keywords1.filter(word => keywords2.includes(word));
    const union = [...new Set([...keywords1, ...keywords2])];
    
    return intersection.length / union.length;
  }

  private extractClaims(articles: any[]): Array<{text: string, source: string}> {
    const claims: Array<{text: string, source: string}> = [];
    
    articles.forEach(article => {
      // Extract key statements that could be factual claims
      const sentences = article.summary.split(/[.!?]+/);
      sentences.forEach(sentence => {
        if (sentence.trim().length > 20 && this.appearsToBeFactualClaim(sentence)) {
          claims.push({
            text: sentence.trim(),
            source: article.source
          });
        }
      });
    });
    
    return claims.slice(0, 20); // Limit to most important claims
  }

  private appearsToBeFactualClaim(sentence: string): boolean {
    const factualIndicators = ['said', 'announced', 'reported', 'confirmed', 'denied', 'stated', 'according to', 'data shows'];
    return factualIndicators.some(indicator => sentence.toLowerCase().includes(indicator));
  }

  private countPoliticianMentions(articles: any[]): number {
    const politicianKeywords = ['mp', 'minister', 'prime minister', 'premier', 'mayor', 'councillor', 'senator'];
    let count = 0;
    
    articles.forEach(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase();
      politicianKeywords.forEach(keyword => {
        if (text.includes(keyword)) count += 10;
      });
    });
    
    return Math.min(100, count);
  }

  private assessPolicyImpact(articles: any[]): number {
    const policyKeywords = ['bill', 'law', 'policy', 'regulation', 'budget', 'tax', 'healthcare', 'education'];
    let score = 0;
    
    articles.forEach(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase();
      policyKeywords.forEach(keyword => {
        if (text.includes(keyword)) score += 15;
      });
    });
    
    return Math.min(100, score);
  }

  private assessPublicSafetyRelevance(articles: any[]): number {
    const safetyKeywords = ['emergency', 'safety', 'health', 'security', 'crisis', 'warning', 'alert'];
    let score = 0;
    
    articles.forEach(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase();
      safetyKeywords.forEach(keyword => {
        if (text.includes(keyword)) score += 20;
      });
    });
    
    return Math.min(100, score);
  }

  private assessEconomicImpact(articles: any[]): number {
    const economicKeywords = ['economy', 'jobs', 'employment', 'business', 'market', 'inflation', 'gdp'];
    let score = 0;
    
    articles.forEach(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase();
      economicKeywords.forEach(keyword => {
        if (text.includes(keyword)) score += 12;
      });
    });
    
    return Math.min(100, score);
  }

  private averageCredibilityScore(articles: any[]): number {
    if (articles.length === 0) return 0;
    const total = articles.reduce((sum, article) => sum + (article.credibilityScore || 50), 0);
    return total / articles.length;
  }

  private assessControversyLevel(articles: any[]): number {
    const controversyKeywords = ['scandal', 'controversy', 'dispute', 'conflict', 'protest', 'criticism'];
    let score = 0;
    
    articles.forEach(article => {
      const text = (article.title + ' ' + article.summary).toLowerCase();
      controversyKeywords.forEach(keyword => {
        if (text.includes(keyword)) score += 15;
      });
    });
    
    return Math.min(100, score);
  }

  private calculateBiasSpread(articles: any[]): number {
    const biasScores = {
      'left': 0,
      'center': 50,
      'right': 100
    };
    
    const scores = articles.map(article => biasScores[article.bias] || 50);
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    
    return max - min; // Higher spread = more diverse perspectives
  }

  private determineBiasLevel(biasSpread: number): string {
    if (biasSpread < 20) return 'homogeneous';
    if (biasSpread < 50) return 'moderate diversity';
    return 'high diversity';
  }
}

export const newsComparison = new NewsComparisonService();