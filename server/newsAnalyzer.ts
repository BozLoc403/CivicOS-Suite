import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { db } from './db';
import * as schema from '@shared/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface NewsSource {
  name: string;
  url: string;
  rssUrl?: string;
  selectors: {
    title: string;
    content: string;
    author?: string;
    publishDate?: string;
    links?: string;
  };
  politicalLean: 'left' | 'center' | 'right';
  credibilityScore: number;
}

const CANADIAN_NEWS_SOURCES: NewsSource[] = [
  {
    name: "CBC News",
    url: "https://www.cbc.ca/news",
    rssUrl: "https://www.cbc.ca/cmlink/rss-topstories",
    selectors: {
      title: "h1, .headline, .story-headline",
      content: ".story-content, .story-body, .story-text, p",
      author: ".byline, .author",
      publishDate: ".story-date, .timestamp, time",
      links: "a[href*='/news/']"
    },
    politicalLean: "center",
    credibilityScore: 85
  },
  {
    name: "Globe and Mail",
    url: "https://www.theglobeandmail.com",
    rssUrl: "https://www.theglobeandmail.com/arc/outboundfeeds/rss/",
    selectors: {
      title: "h1, .headline",
      content: ".article-body, .story-content, p",
      author: ".byline, .author-name",
      publishDate: ".published-date, time",
      links: "a[href*='/politics/']"
    },
    politicalLean: "center",
    credibilityScore: 82
  },
  {
    name: "National Post",
    url: "https://nationalpost.com",
    rssUrl: "https://nationalpost.com/feed",
    selectors: {
      title: "h1, .entry-title",
      content: ".entry-content, .article-content, p",
      author: ".author, .byline",
      publishDate: ".published, time",
      links: "a[href*='/news/']"
    },
    politicalLean: "right",
    credibilityScore: 78
  },
  {
    name: "Toronto Star",
    url: "https://www.thestar.com",
    rssUrl: "https://www.thestar.com/content/thestar/feed.RSSManagerServlet.articles.topstories.rss",
    selectors: {
      title: "h1, .headline",
      content: ".text, .article-body, p",
      author: ".byline, .author",
      publishDate: ".published-date, time",
      links: "a[href*='/politics/']"
    },
    politicalLean: "left",
    credibilityScore: 79
  },
  {
    name: "CTV News",
    url: "https://www.ctvnews.ca",
    rssUrl: "https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009",
    selectors: {
      title: "h1, .page-title",
      content: ".articleBody, .story-copy, p",
      author: ".byline, .author",
      publishDate: ".story-date, time",
      links: "a[href*='/politics/']"
    },
    politicalLean: "center",
    credibilityScore: 83
  },
  {
    name: "Global News",
    url: "https://globalnews.ca",
    rssUrl: "https://globalnews.ca/feed/",
    selectors: {
      title: "h1, .c-breadcrumbs__title",
      content: ".l-article__text, .c-entry-content, p",
      author: ".c-byline__author, .author",
      publishDate: ".c-byline__published, time",
      links: "a[href*='/politics/']"
    },
    politicalLean: "center",
    credibilityScore: 81
  },
  {
    name: "The Tyee",
    url: "https://thetyee.ca",
    rssUrl: "https://feeds.feedburner.com/thetyee/mqsf",
    selectors: {
      title: "h1, .story-title",
      content: ".story-text, .article-body, p",
      author: ".byline, .author",
      publishDate: ".story-date, time",
      links: "a[href*='/News/']"
    },
    politicalLean: "left",
    credibilityScore: 77
  },
  {
    name: "iPolitics",
    url: "https://ipolitics.ca",
    rssUrl: "https://ipolitics.ca/feed/",
    selectors: {
      title: "h1, .entry-title",
      content: ".entry-content, .post-content, p",
      author: ".author, .byline",
      publishDate: ".entry-date, time",
      links: "a[href*='/news/']"
    },
    politicalLean: "center",
    credibilityScore: 84
  }
];

interface ScrapedArticle {
  title: string;
  content: string;
  url: string;
  source: string;
  author?: string;
  publishedAt: Date;
  category: string;
}

interface NewsAnalysis {
  truthScore: number;
  biasScore: number;
  propagandaRisk: 'low' | 'medium' | 'high' | 'extreme';
  credibilityScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  emotionalLanguage: boolean;
  factualClaims: string[];
  verifiedFacts: string[];
  falseStatements: string[];
  mentionedPoliticians: string[];
  mentionedParties: string[];
  relatedBills: string[];
  analysisNotes: string;
}

interface PropagandaAnalysis {
  techniques: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  confidenceScore: number;
  emotionalTriggers: string[];
  manipulativePhrases: string[];
  logicalFallacies: string[];
  missingContext: string[];
  analysisDetails: string;
}

/**
 * Scrape articles from RSS feeds
 */
export async function scrapeFromRSS(source: NewsSource): Promise<ScrapedArticle[]> {
  try {
    if (!source.rssUrl) return [];
    
    console.log(`Scraping RSS feed: ${source.name}`);
    
    const response = await fetch(source.rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CivicOS/1.0; +https://civicos.ca)'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch RSS for ${source.name}: ${response.status}`);
      return [];
    }
    
    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const articles: ScrapedArticle[] = [];
    
    $('item').each((i, element) => {
      const $item = $(element);
      const title = $item.find('title').text().trim();
      const link = $item.find('link').text().trim();
      const description = $item.find('description').text().trim();
      const pubDate = $item.find('pubDate').text().trim();
      
      if (title && link && (title.toLowerCase().includes('politic') || 
          description.toLowerCase().includes('government') ||
          description.toLowerCase().includes('parliament') ||
          description.toLowerCase().includes('trudeau') ||
          description.toLowerCase().includes('conservative') ||
          description.toLowerCase().includes('liberal') ||
          description.toLowerCase().includes('ndp') ||
          description.toLowerCase().includes('bloc'))) {
        
        articles.push({
          title,
          content: description,
          url: link,
          source: source.name,
          publishedAt: pubDate ? new Date(pubDate) : new Date(),
          category: 'politics'
        });
      }
    });
    
    return articles;
  } catch (error) {
    console.error(`Error scraping RSS for ${source.name}:`, error);
    return [];
  }
}

/**
 * Scrape articles directly from website
 */
export async function scrapeWebsite(source: NewsSource): Promise<ScrapedArticle[]> {
  try {
    console.log(`Scraping website: ${source.name}`);
    
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CivicOS/1.0; +https://civicos.ca)'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${source.name}: ${response.status}`);
      return [];
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: ScrapedArticle[] = [];
    
    // Find political article links
    $(source.selectors.links).each((i, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const linkText = $link.text().trim();
      
      if (href && linkText && (
        linkText.toLowerCase().includes('politic') ||
        linkText.toLowerCase().includes('government') ||
        linkText.toLowerCase().includes('parliament') ||
        href.includes('/politics/') ||
        href.includes('/government/')
      )) {
        const fullUrl = href.startsWith('http') ? href : `${source.url}${href}`;
        
        articles.push({
          title: linkText,
          content: '',
          url: fullUrl,
          source: source.name,
          publishedAt: new Date(),
          category: 'politics'
        });
      }
    });
    
    return articles.slice(0, 10); // Limit to 10 articles per source
  } catch (error) {
    console.error(`Error scraping website for ${source.name}:`, error);
    return [];
  }
}

/**
 * Fetch full article content
 */
export async function fetchArticleContent(article: ScrapedArticle, source: NewsSource): Promise<ScrapedArticle> {
  try {
    const response = await fetch(article.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CivicOS/1.0; +https://civicos.ca)'
      }
    });
    
    if (!response.ok) {
      return article;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract title if not already set
    if (!article.title || article.title.length < 10) {
      const title = $(source.selectors.title).first().text().trim();
      if (title) article.title = title;
    }
    
    // Extract content
    let content = '';
    $(source.selectors.content).each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 50) {
        content += text + '\n\n';
      }
    });
    
    if (content) {
      article.content = content.slice(0, 5000); // Limit content length
    }
    
    // Extract author
    if (source.selectors.author) {
      const author = $(source.selectors.author).first().text().trim();
      if (author) article.author = author;
    }
    
    // Extract publish date
    if (source.selectors.publishDate) {
      const dateText = $(source.selectors.publishDate).first().text().trim();
      if (dateText) {
        const parsedDate = new Date(dateText);
        if (!isNaN(parsedDate.getTime())) {
          article.publishedAt = parsedDate;
        }
      }
    }
    
    return article;
  } catch (error) {
    console.error(`Error fetching content for ${article.url}:`, error);
    return article;
  }
}

/**
 * Analyze article for truth, bias, and propaganda using AI
 */
export async function analyzeArticle(article: ScrapedArticle): Promise<NewsAnalysis> {
  try {
    const prompt = `Analyze this Canadian news article for truth, bias, and propaganda. Provide a comprehensive analysis.

Title: ${article.title}
Source: ${article.source}
Content: ${article.content.slice(0, 2000)}

Analyze this article and provide scores and analysis for:

1. TRUTH SCORE (0-100): How factually accurate is this article?
2. BIAS SCORE (-100 to 100): Political bias (-100 = far left, 0 = neutral, 100 = far right)
3. PROPAGANDA RISK (low/medium/high/extreme): Likelihood this contains propaganda techniques
4. CREDIBILITY SCORE (0-100): Overall source and article credibility
5. SENTIMENT (positive/negative/neutral): Overall tone
6. EMOTIONAL LANGUAGE (true/false): Uses emotional manipulation
7. Extract factual claims that can be verified
8. Identify any false or misleading statements
9. Identify mentioned politicians and political parties
10. Identify any related bills or legislation mentioned

Respond in JSON format with these exact keys:
{
  "truthScore": number,
  "biasScore": number, 
  "propagandaRisk": "low|medium|high|extreme",
  "credibilityScore": number,
  "sentiment": "positive|negative|neutral",
  "emotionalLanguage": boolean,
  "factualClaims": ["claim1", "claim2"],
  "verifiedFacts": ["fact1", "fact2"],
  "falseStatements": ["false1", "false2"],
  "mentionedPoliticians": ["politician1", "politician2"],
  "mentionedParties": ["party1", "party2"],
  "relatedBills": ["bill1", "bill2"],
  "analysisNotes": "detailed analysis explanation"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a Canadian news analyst. Respond only in valid JSON format.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const analysisText = response.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(analysisText);
    
    return {
      truthScore: Math.max(0, Math.min(100, analysis.truthScore || 50)),
      biasScore: Math.max(-100, Math.min(100, analysis.biasScore || 0)),
      propagandaRisk: analysis.propagandaRisk || 'low',
      credibilityScore: Math.max(0, Math.min(100, analysis.credibilityScore || 50)),
      sentiment: analysis.sentiment || 'neutral',
      emotionalLanguage: analysis.emotionalLanguage || false,
      factualClaims: analysis.factualClaims || [],
      verifiedFacts: analysis.verifiedFacts || [],
      falseStatements: analysis.falseStatements || [],
      mentionedPoliticians: analysis.mentionedPoliticians || [],
      mentionedParties: analysis.mentionedParties || [],
      relatedBills: analysis.relatedBills || [],
      analysisNotes: analysis.analysisNotes || 'AI analysis completed'
    };
  } catch (error) {
    console.error('Error analyzing article:', error);
    return {
      truthScore: 50,
      biasScore: 0,
      propagandaRisk: 'low',
      credibilityScore: 50,
      sentiment: 'neutral',
      emotionalLanguage: false,
      factualClaims: [],
      verifiedFacts: [],
      falseStatements: [],
      mentionedPoliticians: [],
      mentionedParties: [],
      relatedBills: [],
      analysisNotes: 'Analysis failed - using default values'
    };
  }
}

/**
 * Detect propaganda techniques in article
 */
export async function detectPropaganda(article: ScrapedArticle): Promise<PropagandaAnalysis> {
  try {
    const prompt = `Analyze this news article for propaganda techniques and manipulative content.

Title: ${article.title}
Content: ${article.content.slice(0, 2000)}

Identify propaganda techniques used (if any):
- Bandwagon (appeal to popularity)
- Fear mongering (appeal to fear)
- Ad hominem (personal attacks)
- Strawman arguments
- False dichotomy
- Appeal to authority
- Cherry picking data
- Emotional manipulation
- Loaded language
- Repetition for emphasis
- Scapegoating

Also identify:
- Emotional triggers used
- Manipulative phrases
- Logical fallacies
- Missing context or cherry-picked information

Rate the overall propaganda risk level and confidence.

Respond in JSON format:
{
  "techniques": ["technique1", "technique2"],
  "riskLevel": "low|medium|high|extreme",
  "confidenceScore": number (0-100),
  "emotionalTriggers": ["trigger1", "trigger2"],
  "manipulativePhrases": ["phrase1", "phrase2"],
  "logicalFallacies": ["fallacy1", "fallacy2"],
  "missingContext": ["context1", "context2"],
  "analysisDetails": "detailed explanation"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      messages: [
        {
          role: 'system',
          content: 'You are a propaganda detection expert. Respond only in valid JSON format.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const analysisText = response.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(analysisText);
    
    return {
      techniques: analysis.techniques || [],
      riskLevel: analysis.riskLevel || 'low',
      confidenceScore: Math.max(0, Math.min(100, analysis.confidenceScore || 0)),
      emotionalTriggers: analysis.emotionalTriggers || [],
      manipulativePhrases: analysis.manipulativePhrases || [],
      logicalFallacies: analysis.logicalFallacies || [],
      missingContext: analysis.missingContext || [],
      analysisDetails: analysis.analysisDetails || 'Propaganda analysis completed'
    };
  } catch (error) {
    console.error('Error detecting propaganda:', error);
    return {
      techniques: [],
      riskLevel: 'low',
      confidenceScore: 0,
      emotionalTriggers: [],
      manipulativePhrases: [],
      logicalFallacies: [],
      missingContext: [],
      analysisDetails: 'Propaganda detection failed'
    };
  }
}

/**
 * Store article and analysis in database
 */
export async function storeArticleAnalysis(article: ScrapedArticle, analysis: NewsAnalysis, propaganda: PropagandaAnalysis): Promise<void> {
  try {
    // Check if article already exists
    const existingArticle = await db.select()
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.url, article.url))
      .limit(1);
    
    if (existingArticle.length > 0) {
      console.log(`Article already exists: ${article.title}`);
      return;
    }
    
    // Insert article
    const [insertedArticle] = await db.insert(schema.newsArticles).values({
      title: article.title,
      content: article.content,
      url: article.url,
      source: article.source,
      author: article.author,
      publishedAt: article.publishedAt,
      category: article.category,
      
      truthScore: analysis.truthScore.toString(),
      biasScore: analysis.biasScore.toString(),
      propagandaRisk: analysis.propagandaRisk,
      credibilityScore: analysis.credibilityScore.toString(),
      sentiment: analysis.sentiment,
      emotionalLanguage: analysis.emotionalLanguage,
      factualClaims: analysis.factualClaims,
      verifiedFacts: analysis.verifiedFacts,
      falseStatements: analysis.falseStatements,
      mentionedPoliticians: analysis.mentionedPoliticians,
      mentionedParties: analysis.mentionedParties,
      relatedBills: analysis.relatedBills,
      analysisNotes: analysis.analysisNotes,
    }).returning();
    
    // Insert propaganda analysis
    await db.insert(schema.propagandaDetection).values({
      articleId: insertedArticle.id,
      techniques: propaganda.techniques,
      riskLevel: propaganda.riskLevel,
      confidenceScore: propaganda.confidenceScore.toString(),
      emotionalTriggers: propaganda.emotionalTriggers,
      manipulativePhrases: propaganda.manipulativePhrases,
      logicalFallacies: propaganda.logicalFallacies,
      missingContext: propaganda.missingContext,
      analysisDetails: propaganda.analysisDetails,
    });
    
    console.log(`Stored analysis for: ${article.title}`);
  } catch (error) {
    console.error('Error storing article analysis:', error);
  }
}

/**
 * Update source credibility based on articles
 */
export async function updateSourceCredibility(sourceName: string): Promise<void> {
  try {
    const articles = await db.select()
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.source, sourceName));
    
    if (articles.length === 0) return;
    
    // Calculate averages
    const avgTruth = articles.reduce((sum, article) => sum + parseFloat(article.truthScore || '50'), 0) / articles.length;
    const avgBias = articles.reduce((sum, article) => sum + parseFloat(article.biasScore || '0'), 0) / articles.length;
    const avgCredibility = articles.reduce((sum, article) => sum + parseFloat(article.credibilityScore || '50'), 0) / articles.length;
    
    const propagandaCount = articles.filter(a => a.propagandaRisk === 'high' || a.propagandaRisk === 'extreme').length;
    const propagandaFrequency = (propagandaCount / articles.length) * 100;
    
    // Upsert source credibility
    await db.insert(schema.newsSourceCredibility).values({
      sourceName,
      overallCredibility: avgCredibility.toString(),
      factualReporting: avgTruth.toString(),
      biasRating: avgBias.toString(),
      propagandaFrequency: propagandaFrequency.toString(),
      totalArticles: articles.length,
      accurateReports: articles.filter(a => parseFloat(a.truthScore || '0') >= 80).length,
      misleadingReports: articles.filter(a => parseFloat(a.truthScore || '0') < 60 && parseFloat(a.truthScore || '0') >= 40).length,
      falseReports: articles.filter(a => parseFloat(a.truthScore || '0') < 40).length,
      reliabilityNotes: `Based on analysis of ${articles.length} articles`,
    }).onConflictDoUpdate({
      target: schema.newsSourceCredibility.sourceName,
      set: {
        overallCredibility: avgCredibility.toString(),
        factualReporting: avgTruth.toString(),
        biasRating: avgBias.toString(),
        propagandaFrequency: propagandaFrequency.toString(),
        totalArticles: articles.length,
        lastEvaluated: new Date(),
      }
    });
    
    console.log(`Updated credibility for ${sourceName}: Truth ${avgTruth.toFixed(1)}%, Bias ${avgBias.toFixed(1)}, Propaganda ${propagandaFrequency.toFixed(1)}%`);
  } catch (error) {
    console.error(`Error updating source credibility for ${sourceName}:`, error);
  }
}

/**
 * Run comprehensive news analysis
 */
export async function runNewsAnalysis(): Promise<void> {
  console.log("Starting comprehensive news analysis and propaganda detection...");
  
  for (const source of CANADIAN_NEWS_SOURCES) {
    try {
      console.log(`\nAnalyzing news source: ${source.name}`);
      
      // Try RSS first, then fallback to website scraping
      let articles = await scrapeFromRSS(source);
      
      if (articles.length === 0) {
        articles = await scrapeWebsite(source);
      }
      
      console.log(`Found ${articles.length} articles from ${source.name}`);
      
      // Process each article
      for (const article of articles.slice(0, 5)) { // Limit to 5 articles per source
        try {
          // Fetch full content if not available
          const fullArticle = await fetchArticleContent(article, source);
          
          if (fullArticle.content.length < 100) {
            continue; // Skip articles with insufficient content
          }
          
          // Analyze article
          const analysis = await analyzeArticle(fullArticle);
          const propaganda = await detectPropaganda(fullArticle);
          
          // Store in database
          await storeArticleAnalysis(fullArticle, analysis, propaganda);
          
          // Brief delay to avoid overwhelming the AI service
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error processing article: ${article.title}`, error);
        }
      }
      
      // Update source credibility
      await updateSourceCredibility(source.name);
      
    } catch (error) {
      console.error(`Error analyzing source ${source.name}:`, error);
    }
  }
  
  console.log("News analysis completed");
}

/**
 * Initialize daily news analysis
 */
export function initializeNewsAnalysis(): void {
  console.log("Initializing daily news analysis...");
  
  // Run initial analysis
  runNewsAnalysis();
  
  // Schedule daily analysis at 6 AM
  const runDaily = () => {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setHours(6, 0, 0, 0);
    
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilNext = nextRun.getTime() - now.getTime();
    
    setTimeout(() => {
      runNewsAnalysis();
      setInterval(runNewsAnalysis, 24 * 60 * 60 * 1000); // Every 24 hours
    }, timeUntilNext);
  };
  
  runDaily();
}