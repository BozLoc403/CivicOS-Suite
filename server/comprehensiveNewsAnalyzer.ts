import { db } from "./db";
import { newsArticles, newsComparisons, newsSourceCredibility, politicianControversies } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import Anthropic from '@anthropic-ai/sdk';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface NewsSource {
  name: string;
  url: string;
  rssUrl: string;
  bias: 'left' | 'center' | 'right';
  credibilityScore: number;
  type: 'mainstream' | 'alternative' | 'government';
}

interface ArticleAnalysis {
  id: string;
  title: string;
  url: string;
  source: string;
  content: string;
  publishedAt: Date;
  bias: 'left' | 'center' | 'right';
  credibilityScore: number;
  propagandaTechniques: string[];
  keyTopics: string[];
  politiciansInvolved: string[];
  factualityScore: number;
  emotionalTone: string;
  claims: Array<{
    claim: string;
    evidence: string;
    verifiable: boolean;
    contradictions: string[];
  }>;
}

interface TopicComparison {
  topic: string;
  articles: ArticleAnalysis[];
  consensusLevel: number;
  majorDiscrepancies: string[];
  propagandaPatterns: string[];
  factualAccuracy: number;
  politicalBias: {
    left: number;
    center: number;
    right: number;
  };
}

/**
 * Comprehensive news analyzer for Canadian political content
 */
export class ComprehensiveNewsAnalyzer {
  private canadianNewsSources: NewsSource[] = [
    {
      name: "CBC News",
      url: "https://www.cbc.ca",
      rssUrl: "https://www.cbc.ca/cmlink/rss-topstories",
      bias: "center",
      credibilityScore: 85,
      type: "government"
    },
    {
      name: "Global News",
      url: "https://globalnews.ca",
      rssUrl: "https://globalnews.ca/feed/",
      bias: "center",
      credibilityScore: 82,
      type: "mainstream"
    },
    {
      name: "CTV News",
      url: "https://www.ctvnews.ca",
      rssUrl: "https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009",
      bias: "center",
      credibilityScore: 83,
      type: "mainstream"
    },
    {
      name: "National Post",
      url: "https://nationalpost.com",
      rssUrl: "https://nationalpost.com/feed/",
      bias: "right",
      credibilityScore: 78,
      type: "mainstream"
    },
    {
      name: "The Globe and Mail",
      url: "https://www.theglobeandmail.com",
      rssUrl: "https://www.theglobeandmail.com/arc/outboundfeeds/rss/category/politics/",
      bias: "center",
      credibilityScore: 88,
      type: "mainstream"
    },
    {
      name: "Toronto Star",
      url: "https://www.thestar.com",
      rssUrl: "https://www.thestar.com/politics.rss",
      bias: "left",
      credibilityScore: 79,
      type: "mainstream"
    },
    {
      name: "Le Devoir",
      url: "https://www.ledevoir.com",
      rssUrl: "https://www.ledevoir.com/rss/section/politique.xml",
      bias: "center",
      credibilityScore: 84,
      type: "mainstream"
    },
    {
      name: "The Canadian Press",
      url: "https://www.thecanadianpress.com",
      rssUrl: "https://www.thecanadianpress.com/feed/",
      bias: "center",
      credibilityScore: 90,
      type: "government"
    },
    {
      name: "iPolitics",
      url: "https://ipolitics.ca",
      rssUrl: "https://ipolitics.ca/feed/",
      bias: "center",
      credibilityScore: 81,
      type: "alternative"
    },
    {
      name: "The Hill Times",
      url: "https://www.hilltimes.com",
      rssUrl: "https://www.hilltimes.com/feed/",
      bias: "center",
      credibilityScore: 86,
      type: "alternative"
    }
  ];

  /**
   * Perform comprehensive news analysis across all Canadian sources
   */
  async performComprehensiveAnalysis(): Promise<void> {
    console.log("Starting comprehensive Canadian news analysis...");
    
    const articles: ArticleAnalysis[] = [];
    
    // Scrape articles from all sources
    for (const source of this.canadianNewsSources) {
      try {
        console.log(`Analyzing news source: ${source.name}`);
        const sourceArticles = await this.scrapeNewsSource(source);
        articles.push(...sourceArticles);
        
        // Delay between sources to be respectful
        await this.delay(2000);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
      }
    }

    console.log(`Collected ${articles.length} articles for analysis`);

    // Group articles by topic for comparison
    const topicGroups = await this.groupArticlesByTopic(articles);
    
    // Perform cross-source comparison and analysis
    for (const topic of Object.keys(topicGroups)) {
      if (topicGroups[topic].length >= 2) { // Only analyze topics covered by multiple sources
        await this.performTopicComparison(topic, topicGroups[topic]);
      }
    }

    // Store individual articles
    for (const article of articles) {
      await this.storeArticle(article);
    }

    console.log("Comprehensive news analysis completed");
  }

  /**
   * Scrape and analyze articles from a specific news source
   */
  private async scrapeNewsSource(source: NewsSource): Promise<ArticleAnalysis[]> {
    const articles: ArticleAnalysis[] = [];
    
    try {
      console.log(`Scraping RSS feed: ${source.name}`);
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'CivicOS News Analyzer 1.0 (Democratic Platform)',
        }
      });

      if (!response.ok) {
        console.log(`${source.name} returned ${response.status}, skipping for now`);
        return [];
      }

      const rssText = await response.text();
      const $ = cheerio.load(rssText, { xmlMode: true });

      // Parse RSS items
      $('item').each((index, element) => {
        if (index < 10) { // Limit to 10 recent articles per source
          const $item = $(element);
          const title = $item.find('title').text().trim();
          const url = $item.find('link').text().trim() || $item.find('guid').text().trim();
          const description = $item.find('description').text().trim();
          const pubDate = $item.find('pubDate').text().trim();

          if (title && url && this.isPoliticalContent(title, description)) {
            articles.push({
              id: `${source.name}-${Date.now()}-${index}`,
              title,
              url,
              source: source.name,
              content: description,
              publishedAt: pubDate ? new Date(pubDate) : new Date(),
              bias: source.bias,
              credibilityScore: source.credibilityScore,
              propagandaTechniques: [],
              keyTopics: [],
              politiciansInvolved: [],
              factualityScore: 0,
              emotionalTone: 'neutral',
              claims: []
            });
          }
        }
      });

      // Analyze each article with AI
      for (const article of articles) {
        await this.analyzeArticleContent(article);
        await this.delay(1000); // Rate limiting
      }

    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }

    return articles;
  }

  /**
   * Check if content is political/civic related
   */
  private isPoliticalContent(title: string, description: string): boolean {
    const politicalKeywords = [
      'trudeau', 'poilievre', 'singh', 'blanchet', 'parliament', 'mp', 'minister',
      'federal', 'provincial', 'government', 'policy', 'legislation', 'bill',
      'election', 'vote', 'liberal', 'conservative', 'ndp', 'bloc', 'green',
      'senate', 'house of commons', 'cabinet', 'political', 'politics',
      'healthcare', 'climate', 'economy', 'immigration', 'defence', 'budget',
      'covid', 'pandemic', 'vaccine', 'freedom convoy', 'protest'
    ];

    const content = (title + ' ' + description).toLowerCase();
    return politicalKeywords.some(keyword => content.includes(keyword));
  }

  /**
   * Analyze article content using AI for propaganda detection and bias analysis
   */
  private async analyzeArticleContent(article: ArticleAnalysis): Promise<void> {
    try {
      // Fetch full article content if possible
      let fullContent = article.content;
      
      try {
        const articleResponse = await fetch(article.url, {
          headers: {
            'User-Agent': 'CivicOS News Analyzer 1.0',
          }
        });
        
        if (articleResponse.ok) {
          const articleHtml = await articleResponse.text();
          const $article = cheerio.load(articleHtml);
          
          // Extract main content (common selectors)
          const contentSelectors = [
            'article p', '.article-content p', '.entry-content p',
            '.post-content p', '.story-content p', '.article-body p',
            'main p', '.content p'
          ];
          
          for (const selector of contentSelectors) {
            const paragraphs = $article(selector);
            if (paragraphs.length > 2) {
              fullContent = paragraphs.map((_, el) => $article(el).text()).get().join('\n');
              break;
            }
          }
        }
      } catch (fetchError) {
        // Use RSS description if full article fetch fails
        console.log(`Could not fetch full article from ${article.url}, using RSS content`);
      }

      // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
      const analysisPrompt = `
Analyze this Canadian news article for political bias, propaganda techniques, and factual accuracy:

Title: ${article.title}
Source: ${article.source}
Content: ${fullContent.substring(0, 2000)}

Provide analysis in JSON format:
{
  "propagandaTechniques": ["technique1", "technique2"],
  "keyTopics": ["topic1", "topic2"],
  "politiciansInvolved": ["politician1", "politician2"],
  "factualityScore": 0-100,
  "emotionalTone": "neutral|positive|negative|angry|fearful|hopeful",
  "biasAnalysis": "left|center|right",
  "claims": [
    {
      "claim": "specific factual claim",
      "evidence": "evidence provided",
      "verifiable": true/false,
      "contradictions": ["potential contradictions"]
    }
  ],
  "propagandaAnalysis": "detailed analysis of propaganda techniques used",
  "credibilityAssessment": "assessment of source credibility and article quality"
}

Focus on Canadian political context and identify:
- Emotional manipulation techniques
- Cherry-picked statistics or quotes
- False dichotomies
- Ad hominem attacks
- Loaded language
- Confirmation bias
- Strawman arguments
- Appeal to fear/emotion
`;

      // Use OpenAI for analysis instead of Anthropic
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are a Canadian political analyst specializing in detecting propaganda and analyzing news content. Respond only in valid JSON format."
          }, {
            role: "user",
            content: analysisPrompt
          }],
          response_format: { type: "json_object" },
          max_tokens: 2000
        })
      });

      let analysisText = '';
      if (response.ok) {
        const data = await response.json() as any;
        analysisText = data.choices?.[0]?.message?.content || '';
      } else {
        // Basic content extraction when AI analysis unavailable
        analysisText = JSON.stringify({
          propagandaTechniques: [],
          keyTopics: this.extractBasicTopics(article.title),
          politiciansInvolved: this.extractPoliticians(article.title + ' ' + (article.content || '')),
          factualityScore: 70,
          emotionalTone: 'neutral',
          claims: []
        });
      }

      const analysis = this.parseAnalysisResponse(analysisText);

      // Update article with analysis results
      article.propagandaTechniques = analysis.propagandaTechniques || [];
      article.keyTopics = analysis.keyTopics || [];
      article.politiciansInvolved = analysis.politiciansInvolved || [];
      article.factualityScore = analysis.factualityScore || 50;
      article.emotionalTone = analysis.emotionalTone || 'neutral';
      article.claims = analysis.claims || [];

    } catch (error) {
      console.error(`Error analyzing article ${article.title}:`, error);
    }
  }

  /**
   * Extract basic topics from text
   */
  private extractBasicTopics(text: string): string[] {
    const topics: string[] = [];
    const politicalKeywords = {
      'healthcare': 'Healthcare',
      'economy': 'Economy',
      'education': 'Education',
      'environment': 'Environment',
      'defense': 'Defense',
      'immigration': 'Immigration',
      'tax': 'Taxation',
      'budget': 'Budget',
      'election': 'Elections',
      'parliament': 'Parliament'
    };

    const lowerText = text.toLowerCase();
    for (const [keyword, topic] of Object.entries(politicalKeywords)) {
      if (lowerText.includes(keyword)) {
        topics.push(topic);
      }
    }

    return topics.length > 0 ? topics : ['General'];
  }

  /**
   * Extract politician names from text
   */
  private extractPoliticians(text: string): string[] {
    const politicians: string[] = [];
    const commonPoliticians = [
      'Trudeau', 'Singh', 'Poilievre', 'Blanchet', 'May',
      'Ford', 'Legault', 'Moe', 'Kenney', 'Horgan'
    ];

    for (const politician of commonPoliticians) {
      if (text.includes(politician)) {
        politicians.push(politician);
      }
    }

    return politicians;
  }

  /**
   * Parse AI analysis response
   */
  private parseAnalysisResponse(responseText: string): any {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing analysis response:', error);
    }
    
    return {
      propagandaTechniques: [],
      keyTopics: [],
      politiciansInvolved: [],
      factualityScore: 50,
      emotionalTone: 'neutral',
      claims: []
    };
  }

  /**
   * Group articles by topic for cross-source comparison
   */
  private async groupArticlesByTopic(articles: ArticleAnalysis[]): Promise<Record<string, ArticleAnalysis[]>> {
    const topicGroups: Record<string, ArticleAnalysis[]> = {};

    for (const article of articles) {
      for (const topic of article.keyTopics) {
        if (!topicGroups[topic]) {
          topicGroups[topic] = [];
        }
        topicGroups[topic].push(article);
      }
    }

    return topicGroups;
  }

  /**
   * Perform cross-source comparison for a specific topic
   */
  private async performTopicComparison(topic: string, articles: ArticleAnalysis[]): Promise<void> {
    try {
      // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
      const comparisonPrompt = `
Compare these ${articles.length} Canadian news articles covering "${topic}":

${articles.map((article, index) => `
Article ${index + 1} (${article.source}):
Title: ${article.title}
Bias: ${article.bias}
Content: ${article.content.substring(0, 500)}
`).join('\n')}

Provide comparison analysis in JSON format:
{
  "consensusLevel": 0-100,
  "majorDiscrepancies": ["discrepancy1", "discrepancy2"],
  "propagandaPatterns": ["pattern1", "pattern2"],
  "factualAccuracy": 0-100,
  "politicalBias": {
    "left": 0-100,
    "center": 0-100,
    "right": 0-100
  },
  "mediaManipulation": "analysis of potential media manipulation",
  "publicImpact": "assessment of impact on public opinion",
  "recommendedAction": "recommended action for citizens"
}

Focus on:
- Contradictory facts or claims between sources
- Different framing of the same events
- Omitted information in some sources
- Coordinated messaging patterns
- Emotional manipulation differences
`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: comparisonPrompt
          }
        ]
      });

      const comparisonText = response.content[0].type === 'text' ? response.content[0].text : '';
      const comparison = this.parseAnalysisResponse(comparisonText);

      // Store comparison results
      await this.storeTopicComparison(topic, articles, comparison);

    } catch (error) {
      console.error(`Error comparing topic ${topic}:`, error);
    }
  }

  /**
   * Store article in database
   */
  private async storeArticle(article: ArticleAnalysis): Promise<void> {
    try {
      await db.insert(newsArticles).values({
        title: article.title,
        url: article.url,
        source: article.source,
        content: article.content,
        publishedAt: article.publishedAt,
        bias: article.bias,
        credibilityScore: article.credibilityScore.toString(),
        propagandaTechniques: article.propagandaTechniques,
        keyTopics: article.keyTopics,
        politiciansInvolved: article.politiciansInvolved,
        factualityScore: article.factualityScore,
        emotionalTone: article.emotionalTone,
        claims: article.claims,
        analysisDate: new Date(),
        isVerified: true,
        publicImpact: this.calculatePublicImpact(article),
        biasScore: this.calculateBiasScore(article.bias).toString(),
        sentimentScore: this.calculateSentimentScore(article.emotionalTone)
      }).onConflictDoUpdate({
        target: newsArticles.url,
        set: {
          credibilityScore: article.credibilityScore.toString(),
          propagandaTechniques: article.propagandaTechniques,
          factualityScore: article.factualityScore,
          analysisDate: new Date()
        }
      });
    } catch (error) {
      console.error(`Error storing article ${article.title}:`, error);
    }
  }

  /**
   * Store topic comparison results
   */
  private async storeTopicComparison(topic: string, articles: ArticleAnalysis[], comparison: any): Promise<void> {
    try {
      await db.insert(newsComparisons).values({
        topic: topic,
        sources: articles.map(a => a.source),
        consensusLevel: comparison.consensusLevel || 50,
        majorDiscrepancies: comparison.majorDiscrepancies || [],
        propagandaPatterns: comparison.propagandaPatterns || [],
        factualAccuracy: comparison.factualAccuracy || 50,
        politicalBias: comparison.politicalBias || { left: 33, center: 34, right: 33 },
        mediaManipulation: comparison.mediaManipulation || '',
        publicImpact: comparison.publicImpact || '',
        recommendedAction: comparison.recommendedAction || '',
        analysisDate: new Date(),
        articleCount: articles.length
      }).onConflictDoUpdate({
        target: newsComparisons.topic,
        set: {
          consensusLevel: comparison.consensusLevel || 50,
          factualAccuracy: comparison.factualAccuracy || 50,
          analysisDate: new Date()
        }
      });
    } catch (error) {
      console.error(`Error storing topic comparison for ${topic}:`, error);
    }
  }

  /**
   * Calculate public impact score
   */
  private calculatePublicImpact(article: ArticleAnalysis): number {
    let impact = 50; // Base score
    
    // Increase for political figures
    if (article.politiciansInvolved.length > 0) impact += 20;
    
    // Increase for propaganda techniques
    impact += article.propagandaTechniques.length * 5;
    
    // Adjust for emotional tone
    if (['angry', 'fearful'].includes(article.emotionalTone)) impact += 15;
    
    // Adjust for credibility
    if (article.credibilityScore < 70) impact += 10;
    
    return Math.min(100, Math.max(0, impact));
  }

  /**
   * Calculate bias score
   */
  private calculateBiasScore(bias: string): number {
    switch (bias) {
      case 'left': return -50;
      case 'right': return 50;
      case 'center': return 0;
      default: return 0;
    }
  }

  /**
   * Calculate sentiment score
   */
  private calculateSentimentScore(tone: string): number {
    switch (tone) {
      case 'positive': case 'hopeful': return 75;
      case 'negative': case 'angry': case 'fearful': return -75;
      case 'neutral': return 0;
      default: return 0;
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const comprehensiveNewsAnalyzer = new ComprehensiveNewsAnalyzer();