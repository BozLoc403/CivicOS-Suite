import OpenAI from "openai";
import { db } from "./db";
import { newsArticles } from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface NewsSource {
  name: string;
  url: string;
  rssUrl: string;
  selectors: {
    title: string[];
    content: string[];
    author: string[];
    publishDate: string[];
  };
}

interface AnalyzedArticle {
  title: string;
  content: string;
  url: string;
  author: string;
  publishedAt: Date;
  source: string;
  credibilityScore: number;
  sentimentScore: number;
  biasRating: string;
  keyTopics: string[];
  politicalImpact: number;
  factCheck: string;
  summary: string;
}

/**
 * Revolutionary OpenAI-powered Canadian news analysis system
 * Provides authentic news data with fallback when other APIs are constrained
 */
export class OpenAINewsAnalyzer {
  private newsSources: NewsSource[] = [
    {
      name: "CBC News",
      url: "https://www.cbc.ca",
      rssUrl: "https://www.cbc.ca/webfeed/rss/rss-politics",
      selectors: {
        title: [".detailHeadline", "h1", ".headline"],
        content: [".story-content", ".detailBodyText", "main p"],
        author: [".byline", ".author", "[data-testid='byline']"],
        publishDate: [".timeStamp", "time", ".published-date"]
      }
    },
    {
      name: "Global News",
      url: "https://globalnews.ca",
      rssUrl: "https://globalnews.ca/politics/feed/",
      selectors: {
        title: ["h1", ".entry-title", ".headline"],
        content: [".l-article__body", ".entry-content", "article p"],
        author: [".c-byline__author", ".author", ".byline"],
        publishDate: [".c-byline__published", "time", ".published"]
      }
    },
    {
      name: "CTV News",
      url: "https://www.ctvnews.ca",
      rssUrl: "https://www.ctvnews.ca/rss/politics",
      selectors: {
        title: ["h1", ".articleHeadline", ".entry-title"],
        content: [".articleBody", ".entry-content", "article p"],
        author: [".byline", ".author", ".articleByline"],
        publishDate: [".timestamp", "time", ".published"]
      }
    },
    {
      name: "National Post",
      url: "https://nationalpost.com",
      rssUrl: "https://nationalpost.com/category/news/politics/feed",
      selectors: {
        title: ["h1", ".article-title", ".headline"],
        content: [".article-content", ".entry-content", "article p"],
        author: [".author-name", ".byline", ".author"],
        publishDate: [".published-date", "time", ".timestamp"]
      }
    },
    {
      name: "The Globe and Mail",
      url: "https://www.theglobeandmail.com",
      rssUrl: "https://www.theglobeandmail.com/politics/?service=rss",
      selectors: {
        title: ["h1", ".headline", ".article-headline"],
        content: [".article-body", ".content", "article p"],
        author: [".author", ".byline", ".writer"],
        publishDate: [".published-date", "time", ".date"]
      }
    }
  ];

  /**
   * Perform comprehensive Canadian news analysis with OpenAI
   */
  async performComprehensiveNewsAnalysis(): Promise<void> {
    console.log("Starting OpenAI-powered Canadian news analysis...");

    for (const source of this.newsSources) {
      try {
        await this.analyzeNewsSource(source);
        await this.delay(2000); // Rate limiting
      } catch (error) {
        console.error(`Error analyzing ${source.name}:`, error);
        continue;
      }
    }

    console.log("OpenAI news analysis completed");
  }

  /**
   * Analyze individual news source with OpenAI intelligence
   */
  private async analyzeNewsSource(source: NewsSource): Promise<void> {
    console.log(`Analyzing news source: ${source.name}`);

    try {
      // Fetch RSS feed
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'CivicOS-NewsAnalyzer/1.0 (https://civicos.ca)'
        },
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rssContent = await response.text();
      const articles = await this.parseRSSFeed(rssContent, source);

      for (const article of articles.slice(0, 5)) { // Limit to 5 recent articles
        try {
          const analyzedArticle = await this.analyzeArticleWithOpenAI(article, source);
          await this.storeAnalyzedArticle(analyzedArticle);
          await this.delay(1000);
        } catch (error) {
          console.error(`Error analyzing article from ${source.name}:`, error);
          continue;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Parse RSS feed and extract article data
   */
  private async parseRSSFeed(rssContent: string, source: NewsSource): Promise<any[]> {
    const $ = cheerio.load(rssContent, { xmlMode: true });
    const articles: any[] = [];

    $('item').each((index, element) => {
      const $item = $(element);
      
      const article = {
        title: $item.find('title').text().trim(),
        url: $item.find('link').text().trim(),
        description: $item.find('description').text().trim(),
        pubDate: new Date($item.find('pubDate').text()),
        source: source.name
      };

      if (article.title && article.url) {
        articles.push(article);
      }
    });

    return articles;
  }

  /**
   * Analyze article content using OpenAI
   */
  private async analyzeArticleWithOpenAI(article: any, source: NewsSource): Promise<AnalyzedArticle> {
    // Fetch full article content
    let fullContent = article.description;
    
    try {
      const articleResponse = await fetch(article.url, {
        headers: {
          'User-Agent': 'CivicOS-NewsAnalyzer/1.0 (https://civicos.ca)'
        },
        timeout: 8000
      });

      if (articleResponse.ok) {
        const html = await articleResponse.text();
        const $ = cheerio.load(html);
        
        // Extract content using selectors
        let extractedContent = '';
        for (const selector of source.selectors.content) {
          const content = $(selector).text().trim();
          if (content && content.length > extractedContent.length) {
            extractedContent = content;
          }
        }
        
        if (extractedContent.length > 100) {
          fullContent = extractedContent;
        }
      }
    } catch (error) {
      // Use RSS description as fallback
    }

    // Analyze with OpenAI
    const analysisPrompt = `
    Analyze this Canadian political news article:
    
    Title: ${article.title}
    Content: ${fullContent.substring(0, 2000)}
    Source: ${source.name}
    
    Provide analysis in JSON format:
    {
      "credibilityScore": number (0-100),
      "sentimentScore": number (-1 to 1),
      "biasRating": "left" | "center" | "right",
      "keyTopics": ["topic1", "topic2", "topic3"],
      "politicalImpact": number (0-100),
      "factCheck": "verified" | "disputed" | "unverified",
      "summary": "2-sentence summary",
      "canadianRelevance": number (0-100)
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a Canadian political news analyst. Provide objective, factual analysis of news articles with focus on Canadian political relevance."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    return {
      title: article.title,
      content: fullContent,
      url: article.url,
      author: "Unknown", // Extract from selectors if needed
      publishedAt: article.pubDate || new Date(),
      source: source.name,
      credibilityScore: analysis.credibilityScore || 50,
      sentimentScore: analysis.sentimentScore || 0,
      biasRating: analysis.biasRating || "center",
      keyTopics: analysis.keyTopics || [],
      politicalImpact: analysis.politicalImpact || 0,
      factCheck: analysis.factCheck || "unverified",
      summary: analysis.summary || article.description.substring(0, 200)
    };
  }

  /**
   * Store analyzed article in database
   */
  private async storeAnalyzedArticle(article: AnalyzedArticle): Promise<void> {
    try {
      // Check if article already exists
      const existing = await db.select()
        .from(newsArticles)
        .where(eq(newsArticles.url, article.url))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(newsArticles).values({
          title: article.title,
          content: article.content,
          url: article.url,
          author: article.author,
          publishedAt: article.publishedAt,
          source: article.source,
          credibilityScore: article.credibilityScore.toString(),
          sentimentScore: article.sentimentScore,
          biasRating: article.biasRating,
          keyTopics: JSON.stringify(article.keyTopics),
          politicalImpact: article.politicalImpact,
          factCheckStatus: article.factCheck,
          summary: article.summary,
          isVerified: true,
          analysisVersion: "openai-v1"
        });

        console.log(`Stored article: ${article.title.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error("Error storing article:", error);
    }
  }

  /**
   * Get latest analyzed news for dashboard
   */
  async getLatestNews(limit: number = 10): Promise<any[]> {
    try {
      const articles = await db.select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit);

      return articles.map(article => ({
        ...article,
        keyTopics: JSON.parse(article.keyTopics || '[]'),
        credibilityScore: parseInt(article.credibilityScore || '50')
      }));
    } catch (error) {
      console.error("Error fetching latest news:", error);
      return [];
    }
  }

  /**
   * Get news analytics for dashboard
   */
  async getNewsAnalytics(): Promise<any> {
    try {
      const [totalResult] = await db.execute(sql`
        SELECT 
          COUNT(*) as total,
          COALESCE(AVG(CAST(credibility_score AS INTEGER)), 50) as avgCredibility,
          COALESCE(AVG(sentiment_score), 0) as avgSentiment,
          COUNT(CASE WHEN published_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as recent
        FROM news_articles
      `);

      return {
        total: parseInt(totalResult.total || '0'),
        avgCredibility: Math.round(totalResult.avgCredibility || 50),
        avgSentiment: parseFloat(totalResult.avgSentiment || '0'),
        recent: parseInt(totalResult.recent || '0')
      };
    } catch (error) {
      console.error("Error fetching news analytics:", error);
      return {
        total: 0,
        avgCredibility: 50,
        avgSentiment: 0,
        recent: 0
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const openaiNewsAnalyzer = new OpenAINewsAnalyzer();