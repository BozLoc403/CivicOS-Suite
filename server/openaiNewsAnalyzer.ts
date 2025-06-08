import OpenAI from "openai";
import { db } from "./db";
import { sql } from "drizzle-orm";
import * as cheerio from "cheerio";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

interface NewsSource {
  name: string;
  url: string;
  rssUrl: string;
  bias: string;
  credibility: number;
}

interface ArticleAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  credibility: number;
  bias: 'left' | 'right' | 'center';
  topics: string[];
  keyPoints: string[];
  factualAccuracy: number;
  propagandaScore: number;
  summary: string;
}

interface NewsComparison {
  topic: string;
  articles: Array<{
    source: string;
    title: string;
    bias: string;
    sentiment: string;
    credibility: number;
  }>;
  consensus: string;
  divergence: string[];
}

export class OpenAINewsAnalyzer {
  private openai: OpenAI;
  private sources: NewsSource[] = [
    {
      name: "CBC News",
      url: "https://www.cbc.ca",
      rssUrl: "https://www.cbc.ca/cmlink/rss-canada",
      bias: "center-left",
      credibility: 85
    },
    {
      name: "Global News",
      url: "https://globalnews.ca",
      rssUrl: "https://globalnews.ca/feed/",
      bias: "center",
      credibility: 82
    },
    {
      name: "CTV News",
      url: "https://www.ctvnews.ca",
      rssUrl: "https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009",
      bias: "center",
      credibility: 83
    },
    {
      name: "National Post",
      url: "https://nationalpost.com",
      rssUrl: "https://nationalpost.com/feed/",
      bias: "center-right",
      credibility: 80
    },
    {
      name: "Toronto Star",
      url: "https://www.thestar.com",
      rssUrl: "https://www.thestar.com/content/thestar/feed.rss",
      bias: "center-left",
      credibility: 78
    }
  ];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async performComprehensiveAnalysis(): Promise<void> {
    console.log("Starting comprehensive Canadian news analysis with OpenAI...");
    
    for (const source of this.sources) {
      try {
        console.log(`Analyzing news source: ${source.name}`);
        await this.scrapeAndAnalyzeSource(source);
        await this.delay(2000); // Rate limiting
      } catch (error) {
        console.error(`Error analyzing ${source.name}:`, error);
      }
    }

    await this.performCrossSourceComparison();
    console.log("Comprehensive news analysis completed");
  }

  private async scrapeAndAnalyzeSource(source: NewsSource): Promise<void> {
    try {
      console.log(`Scraping RSS feed: ${source.name}`);
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; CivicOS/1.0; +https://civicos.ca)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const rssContent = await response.text();
      const $ = cheerio.load(rssContent, { xmlMode: true });
      
      const articles: any[] = [];
      $('item').slice(0, 10).each((i, elem) => {
        const $elem = $(elem);
        const title = $elem.find('title').text().trim();
        const description = $elem.find('description').text().trim();
        const link = $elem.find('link').text().trim();
        const pubDate = $elem.find('pubDate').text().trim();

        if (title && description) {
          articles.push({
            title,
            description,
            url: link,
            publishedAt: new Date(pubDate),
            source: source.name
          });
        }
      });

      for (const article of articles) {
        try {
          const analysis = await this.analyzeArticle(article.title, article.description);
          await this.storeArticleAnalysis(article, analysis, source);
        } catch (error) {
          console.error(`Error analyzing article: ${article.title}`, error);
        }
      }
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
    }
  }

  private async analyzeArticle(title: string, content: string): Promise<ArticleAnalysis> {
    try {
      const prompt = `Analyze this Canadian news article for political bias, credibility, and propaganda:

Title: ${title}
Content: ${content}

Provide analysis in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "credibility": 0-100,
  "bias": "left|right|center", 
  "topics": ["topic1", "topic2"],
  "keyPoints": ["point1", "point2"],
  "factualAccuracy": 0-100,
  "propagandaScore": 0-100,
  "summary": "brief summary"
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert Canadian political news analyst. Analyze articles for bias, credibility, and propaganda techniques used in Canadian media."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        sentiment: analysis.sentiment || 'neutral',
        credibility: Math.max(0, Math.min(100, analysis.credibility || 50)),
        bias: analysis.bias || 'center',
        topics: Array.isArray(analysis.topics) ? analysis.topics : [],
        keyPoints: Array.isArray(analysis.keyPoints) ? analysis.keyPoints : [],
        factualAccuracy: Math.max(0, Math.min(100, analysis.factualAccuracy || 50)),
        propagandaScore: Math.max(0, Math.min(100, analysis.propagandaScore || 0)),
        summary: analysis.summary || title
      };
    } catch (error) {
      console.error("Error in OpenAI analysis:", error);
      return {
        sentiment: 'neutral',
        credibility: 50,
        bias: 'center',
        topics: [],
        keyPoints: [],
        factualAccuracy: 50,
        propagandaScore: 0,
        summary: title
      };
    }
  }

  private async storeArticleAnalysis(article: any, analysis: ArticleAnalysis, source: NewsSource): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO news_articles (
          title, content, url, source, published_at, 
          sentiment, credibility_score, bias, topics, 
          factual_accuracy, propaganda_score, summary
        ) VALUES (
          ${article.title}, 
          ${article.description}, 
          ${article.url}, 
          ${article.source}, 
          ${article.publishedAt}, 
          ${analysis.sentiment}, 
          ${analysis.credibility}, 
          ${analysis.bias}, 
          ${JSON.stringify(analysis.topics)}, 
          ${analysis.factualAccuracy}, 
          ${analysis.propagandaScore}, 
          ${analysis.summary}
        )
        ON CONFLICT (url) DO UPDATE SET
          sentiment = EXCLUDED.sentiment,
          credibility_score = EXCLUDED.credibility_score,
          bias = EXCLUDED.bias,
          topics = EXCLUDED.topics,
          factual_accuracy = EXCLUDED.factual_accuracy,
          propaganda_score = EXCLUDED.propaganda_score,
          summary = EXCLUDED.summary,
          updated_at = NOW()
      `);
    } catch (error) {
      console.error("Error storing article analysis:", error);
    }
  }

  private async performCrossSourceComparison(): Promise<void> {
    try {
      const topics = await db.execute(sql`
        SELECT DISTINCT jsonb_array_elements_text(topics::jsonb) as topic
        FROM news_articles 
        WHERE published_at > NOW() - INTERVAL '24 hours'
        GROUP BY topic
        HAVING COUNT(*) >= 2
        LIMIT 10
      `);

      for (const topicRow of topics.rows) {
        const topic = topicRow.topic as string;
        await this.compareTopicCoverage(topic);
      }
    } catch (error) {
      console.error("Error in cross-source comparison:", error);
    }
  }

  private async compareTopicCoverage(topic: string): Promise<void> {
    try {
      const articles = await db.execute(sql`
        SELECT title, source, bias, sentiment, credibility_score, summary
        FROM news_articles 
        WHERE topics::jsonb ? ${topic}
        AND published_at > NOW() - INTERVAL '24 hours'
        ORDER BY published_at DESC
        LIMIT 5
      `);

      if (articles.rows.length < 2) return;

      const comparison = await this.generateTopicComparison(topic, articles.rows);
      await this.storeComparison(topic, comparison);
    } catch (error) {
      console.error(`Error comparing topic ${topic}:`, error);
    }
  }

  private async generateTopicComparison(topic: string, articles: any[]): Promise<NewsComparison> {
    try {
      const articlesData = articles.map(a => ({
        source: a.source,
        title: a.title,
        bias: a.bias,
        sentiment: a.sentiment,
        credibility: a.credibility_score,
        summary: a.summary
      }));

      const prompt = `Compare how different Canadian news sources cover this topic: "${topic}"

Articles:
${articlesData.map(a => `${a.source} (${a.bias}): ${a.title} - ${a.summary}`).join('\n')}

Provide comparison in JSON format:
{
  "consensus": "areas of agreement",
  "divergence": ["key differences", "bias variations"],
  "overallTrend": "positive|negative|neutral"
}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are analyzing Canadian media coverage patterns to identify bias and consensus across news sources."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 600
      });

      const analysis = JSON.parse(response.choices[0].message.content || "{}");

      return {
        topic,
        articles: articlesData,
        consensus: analysis.consensus || "No clear consensus",
        divergence: Array.isArray(analysis.divergence) ? analysis.divergence : []
      };
    } catch (error) {
      console.error("Error generating topic comparison:", error);
      return {
        topic,
        articles: [],
        consensus: "Analysis unavailable",
        divergence: []
      };
    }
  }

  private async storeComparison(topic: string, comparison: NewsComparison): Promise<void> {
    try {
      await db.execute(sql`
        INSERT INTO news_comparisons (
          topic, articles_data, consensus, divergence_points, analysis_date
        ) VALUES (
          ${topic}, 
          ${JSON.stringify(comparison.articles)}, 
          ${comparison.consensus}, 
          ${JSON.stringify(comparison.divergence)}, 
          NOW()
        )
        ON CONFLICT (topic) DO UPDATE SET
          articles_data = EXCLUDED.articles_data,
          consensus = EXCLUDED.consensus,
          divergence_points = EXCLUDED.divergence_points,
          analysis_date = EXCLUDED.analysis_date
      `);
    } catch (error) {
      console.error("Error storing comparison:", error);
    }
  }

  async getNewsAnalytics(): Promise<any> {
    try {
      const analytics = await db.execute(sql`
        SELECT 
          COUNT(*) as total_articles,
          COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive,
          COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative,
          COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral,
          AVG(credibility_score) as avg_credibility,
          AVG(factual_accuracy) as avg_accuracy,
          AVG(propaganda_score) as avg_propaganda
        FROM news_articles 
        WHERE published_at > NOW() - INTERVAL '24 hours'
      `);

      const biasDistribution = await db.execute(sql`
        SELECT bias, COUNT(*) as count
        FROM news_articles 
        WHERE published_at > NOW() - INTERVAL '24 hours'
        GROUP BY bias
      `);

      const topTopics = await db.execute(sql`
        SELECT 
          jsonb_array_elements_text(topics::jsonb) as topic,
          COUNT(*) as frequency
        FROM news_articles 
        WHERE published_at > NOW() - INTERVAL '24 hours'
        GROUP BY topic
        ORDER BY frequency DESC
        LIMIT 10
      `);

      return {
        summary: analytics.rows[0] || {},
        biasDistribution: biasDistribution.rows || [],
        topTopics: topTopics.rows || [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error getting news analytics:", error);
      return {
        summary: {},
        biasDistribution: [],
        topTopics: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const openaiNewsAnalyzer = new OpenAINewsAnalyzer();