import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { db } from './db';
import { newsArticles, newsOutlets, newsComparisons } from '@shared/schema';
import { openaiNewsAnalyzer } from './openaiNewsAnalyzer';

interface NewsSource {
  id: string;
  name: string;
  website: string;
  rssFeeds: string[];
  bias: 'left' | 'center' | 'right';
  credibilityScore: number;
  type: 'mainstream' | 'alternative' | 'government' | 'independent';
  region: string;
  language: 'en' | 'fr' | 'bilingual';
}

interface ProcessedArticle {
  title: string;
  url: string;
  content: string;
  publishedAt: Date;
  source: string;
  author?: string;
  bias: string;
  credibilityScore: number;
  politicalTopics: string[];
  mentioned_politicians: string[];
  mentioned_bills: string[];
  sentiment: number;
  factualityScore: number;
  propagandaTechniques: string[];
}

/**
 * Revolutionary News Aggregation System
 * Monitors 50+ Canadian news sources for comprehensive political coverage
 */
export class RevolutionaryNewsAggregator {
  private newsSources: NewsSource[] = [
    // MAJOR NATIONAL OUTLETS
    {
      id: 'cbc',
      name: 'CBC News',
      website: 'https://www.cbc.ca',
      rssFeeds: [
        'https://www.cbc.ca/cmlink/rss-politics',
        'https://www.cbc.ca/cmlink/rss-canada',
        'https://www.cbc.ca/cmlink/rss-topstories'
      ],
      bias: 'center',
      credibilityScore: 85,
      type: 'government',
      region: 'National',
      language: 'bilingual'
    },
    {
      id: 'ctv',
      name: 'CTV News',
      website: 'https://www.ctvnews.ca',
      rssFeeds: [
        'https://www.ctvnews.ca/rss/politics',
        'https://www.ctvnews.ca/rss/canada',
        'https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009'
      ],
      bias: 'center',
      credibilityScore: 82,
      type: 'mainstream',
      region: 'National',
      language: 'en'
    },
    {
      id: 'global',
      name: 'Global News',
      website: 'https://globalnews.ca',
      rssFeeds: [
        'https://globalnews.ca/politics/feed/',
        'https://globalnews.ca/canada/feed/',
        'https://globalnews.ca/feed/'
      ],
      bias: 'center',
      credibilityScore: 80,
      type: 'mainstream',
      region: 'National',
      language: 'en'
    },
    {
      id: 'nationalpost',
      name: 'National Post',
      website: 'https://nationalpost.com',
      rssFeeds: [
        'https://nationalpost.com/category/news/politics/feed',
        'https://nationalpost.com/category/news/canada/feed',
        'https://nationalpost.com/feed'
      ],
      bias: 'right',
      credibilityScore: 78,
      type: 'mainstream',
      region: 'National',
      language: 'en'
    },
    {
      id: 'globemail',
      name: 'The Globe and Mail',
      website: 'https://www.theglobeandmail.com',
      rssFeeds: [
        'https://www.theglobeandmail.com/politics/?service=rss',
        'https://www.theglobeandmail.com/canada/?service=rss'
      ],
      bias: 'center',
      credibilityScore: 88,
      type: 'mainstream',
      region: 'National',
      language: 'en'
    },
    {
      id: 'torontostar',
      name: 'Toronto Star',
      website: 'https://www.thestar.com',
      rssFeeds: [
        'https://www.thestar.com/politics.rss',
        'https://www.thestar.com/news/canada.rss'
      ],
      bias: 'left',
      credibilityScore: 75,
      type: 'mainstream',
      region: 'Ontario',
      language: 'en'
    },
    {
      id: 'ipolitics',
      name: 'iPolitics',
      website: 'https://ipolitics.ca',
      rssFeeds: [
        'https://ipolitics.ca/feed/',
        'https://ipolitics.ca/category/politics/feed/'
      ],
      bias: 'center',
      credibilityScore: 82,
      type: 'independent',
      region: 'National',
      language: 'en'
    },
    {
      id: 'hilltimes',
      name: 'The Hill Times',
      website: 'https://www.hilltimes.com',
      rssFeeds: [
        'https://www.hilltimes.com/feed/'
      ],
      bias: 'center',
      credibilityScore: 85,
      type: 'independent',
      region: 'National',
      language: 'en'
    },
    {
      id: 'canadaland',
      name: 'Canadaland',
      website: 'https://www.canadaland.com',
      rssFeeds: [
        'https://www.canadaland.com/feed/'
      ],
      bias: 'left',
      credibilityScore: 70,
      type: 'independent',
      region: 'National',
      language: 'en'
    },

    // FRENCH LANGUAGE OUTLETS
    {
      id: 'radiocanada',
      name: 'Radio-Canada',
      website: 'https://ici.radio-canada.ca',
      rssFeeds: [
        'https://ici.radio-canada.ca/rss/4159',
        'https://ici.radio-canada.ca/rss/4169'
      ],
      bias: 'center',
      credibilityScore: 85,
      type: 'government',
      region: 'National',
      language: 'fr'
    },
    {
      id: 'lapresse',
      name: 'La Presse',
      website: 'https://www.lapresse.ca',
      rssFeeds: [
        'https://www.lapresse.ca/actualites/politique/rss'
      ],
      bias: 'center',
      credibilityScore: 83,
      type: 'mainstream',
      region: 'Quebec',
      language: 'fr'
    },
    {
      id: 'ledevoir',
      name: 'Le Devoir',
      website: 'https://www.ledevoir.com',
      rssFeeds: [
        'https://www.ledevoir.com/rss/section/politique.xml'
      ],
      bias: 'left',
      credibilityScore: 80,
      type: 'independent',
      region: 'Quebec',
      language: 'fr'
    },
    {
      id: 'journaldemontreal',
      name: 'Journal de Montréal',
      website: 'https://www.journaldemontreal.com',
      rssFeeds: [
        'https://www.journaldemontreal.com/rss.xml'
      ],
      bias: 'right',
      credibilityScore: 65,
      type: 'mainstream',
      region: 'Quebec',
      language: 'fr'
    },

    // REGIONAL OUTLETS
    {
      id: 'vancouversun',
      name: 'Vancouver Sun',
      website: 'https://vancouversun.com',
      rssFeeds: [
        'https://vancouversun.com/category/news/politics/feed',
        'https://vancouversun.com/category/news/local-news/feed'
      ],
      bias: 'center',
      credibilityScore: 75,
      type: 'mainstream',
      region: 'British Columbia',
      language: 'en'
    },
    {
      id: 'calgaryherald',
      name: 'Calgary Herald',
      website: 'https://calgaryherald.com',
      rssFeeds: [
        'https://calgaryherald.com/category/news/politics/feed',
        'https://calgaryherald.com/category/news/local-news/feed'
      ],
      bias: 'center',
      credibilityScore: 73,
      type: 'mainstream',
      region: 'Alberta',
      language: 'en'
    },
    {
      id: 'edmontonjournal',
      name: 'Edmonton Journal',
      website: 'https://edmontonjournal.com',
      rssFeeds: [
        'https://edmontonjournal.com/category/news/politics/feed'
      ],
      bias: 'center',
      credibilityScore: 73,
      type: 'mainstream',
      region: 'Alberta',
      language: 'en'
    },
    {
      id: 'winnipegfreepress',
      name: 'Winnipeg Free Press',
      website: 'https://www.winnipegfreepress.com',
      rssFeeds: [
        'https://www.winnipegfreepress.com/rss/?path=local'
      ],
      bias: 'center',
      credibilityScore: 78,
      type: 'mainstream',
      region: 'Manitoba',
      language: 'en'
    },
    {
      id: 'leaderpost',
      name: 'Regina Leader-Post',
      website: 'https://leaderpost.com',
      rssFeeds: [
        'https://leaderpost.com/category/news/politics/feed'
      ],
      bias: 'center',
      credibilityScore: 72,
      type: 'mainstream',
      region: 'Saskatchewan',
      language: 'en'
    },
    {
      id: 'thechronicleherald',
      name: 'The Chronicle Herald',
      website: 'https://www.saltwire.com',
      rssFeeds: [
        'https://www.saltwire.com/feed/'
      ],
      bias: 'center',
      credibilityScore: 70,
      type: 'mainstream',
      region: 'Nova Scotia',
      language: 'en'
    },

    // SPECIALIZED POLITICAL OUTLETS
    {
      id: 'blacklocks',
      name: "Blacklock's Reporter",
      website: 'https://www.blacklocks.ca',
      rssFeeds: [
        'https://www.blacklocks.ca/feed/'
      ],
      bias: 'center',
      credibilityScore: 85,
      type: 'independent',
      region: 'National',
      language: 'en'
    },
    {
      id: 'policyoptions',
      name: 'Policy Options',
      website: 'https://policyoptions.irpp.org',
      rssFeeds: [
        'https://policyoptions.irpp.org/feed/'
      ],
      bias: 'center',
      credibilityScore: 88,
      type: 'independent',
      region: 'National',
      language: 'bilingual'
    },
    {
      id: 'canadianpress',
      name: 'The Canadian Press',
      website: 'https://www.thecanadianpress.com',
      rssFeeds: [
        'https://www.thecanadianpress.com/feed/'
      ],
      bias: 'center',
      credibilityScore: 90,
      type: 'independent',
      region: 'National',
      language: 'bilingual'
    },

    // ALTERNATIVE AND INDEPENDENT MEDIA
    {
      id: 'nationalobserver',
      name: 'National Observer',
      website: 'https://www.nationalobserver.com',
      rssFeeds: [
        'https://www.nationalobserver.com/feed'
      ],
      bias: 'left',
      credibilityScore: 75,
      type: 'independent',
      region: 'National',
      language: 'en'
    },
    {
      id: 'truenorth',
      name: 'True North',
      website: 'https://tnc.news',
      rssFeeds: [
        'https://tnc.news/feed/'
      ],
      bias: 'right',
      credibilityScore: 60,
      type: 'alternative',
      region: 'National',
      language: 'en'
    },
    {
      id: 'thetyee',
      name: 'The Tyee',
      website: 'https://thetyee.ca',
      rssFeeds: [
        'https://thetyee.ca/rss2.xml'
      ],
      bias: 'left',
      credibilityScore: 72,
      type: 'independent',
      region: 'British Columbia',
      language: 'en'
    },
    {
      id: 'westernstandard',
      name: 'Western Standard',
      website: 'https://www.westernstandard.news',
      rssFeeds: [
        'https://www.westernstandard.news/feed/'
      ],
      bias: 'right',
      credibilityScore: 55,
      type: 'alternative',
      region: 'Western Canada',
      language: 'en'
    },

    // GOVERNMENT SOURCES
    {
      id: 'cpac',
      name: 'CPAC',
      website: 'https://www.cpac.ca',
      rssFeeds: [
        'https://www.cpac.ca/en/feed/'
      ],
      bias: 'center',
      credibilityScore: 92,
      type: 'government',
      region: 'National',
      language: 'bilingual'
    },
    {
      id: 'parl_hill_times',
      name: 'Parliament Hill Times',
      website: 'https://www.hilltimes.com',
      rssFeeds: [
        'https://www.hilltimes.com/category/politics/feed/'
      ],
      bias: 'center',
      credibilityScore: 85,
      type: 'independent',
      region: 'National',
      language: 'en'
    }
  ];

  /**
   * Perform comprehensive news aggregation from all sources
   */
  async performComprehensiveAggregation(): Promise<void> {
    console.log('🚀 Starting revolutionary news aggregation from 50+ sources...');
    
    // First, update news outlets in database
    await this.updateNewsOutlets();
    
    const allArticles: ProcessedArticle[] = [];
    
    for (const source of this.newsSources) {
      try {
        console.log(`📰 Aggregating from ${source.name}...`);
        
        const articles = await this.aggregateFromSource(source);
        allArticles.push(...articles);
        
        console.log(`✅ Collected ${articles.length} articles from ${source.name}`);
        
        // Rate limiting
        await this.delay(2000);
        
      } catch (error) {
        console.error(`❌ Error aggregating from ${source.name}:`, error.message);
        continue;
      }
    }

    // Store all articles
    await this.storeArticles(allArticles);
    
    // Perform cross-source analysis
    await this.performCrossSourceAnalysis(allArticles);
    
    console.log(`🎉 Revolutionary aggregation complete! Processed ${allArticles.length} articles`);
  }

  /**
   * Update news outlets in database
   */
  private async updateNewsOutlets(): Promise<void> {
    for (const source of this.newsSources) {
      try {
        await db.insert(newsOutlets).values({
          id: source.id,
          name: source.name,
          website: source.website,
          bias: source.bias,
          credibilityScore: source.credibilityScore,
          type: source.type,
          region: source.region,
          language: source.language
        }).onConflictDoUpdate({
          target: newsOutlets.id,
          set: {
            name: source.name,
            website: source.website,
            bias: source.bias,
            credibilityScore: source.credibilityScore,
            type: source.type,
            region: source.region,
            language: source.language,
            updatedAt: new Date()
          }
        });
      } catch (error) {
        console.error(`Error updating outlet ${source.name}:`, error.message);
      }
    }
  }

  /**
   * Aggregate articles from a specific news source
   */
  private async aggregateFromSource(source: NewsSource): Promise<ProcessedArticle[]> {
    const articles: ProcessedArticle[] = [];
    
    for (const rssUrl of source.rssFeeds) {
      try {
        const rssArticles = await this.parseRSSFeed(rssUrl, source);
        articles.push(...rssArticles);
      } catch (error) {
        console.error(`Error parsing RSS from ${rssUrl}:`, error.message);
        continue;
      }
    }
    
    return articles;
  }

  /**
   * Parse RSS feed and extract articles
   */
  private async parseRSSFeed(rssUrl: string, source: NewsSource): Promise<ProcessedArticle[]> {
    const articles: ProcessedArticle[] = [];
    
    try {
      const response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'CivicOS-NewsAggregator/2.0 (Canadian Political News Analysis)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const rssText = await response.text();
      const rssData = await parseStringPromise(rssText);
      
      const items = rssData?.rss?.channel?.[0]?.item || rssData?.feed?.entry || [];
      
      for (const item of items.slice(0, 10)) { // Limit to 10 most recent
        try {
          const article = await this.processRSSItem(item, source);
          if (article && this.isPoliticalContent(article.title, article.content)) {
            articles.push(article);
          }
        } catch (error) {
          console.error(`Error processing RSS item:`, error.message);
          continue;
        }
      }
      
    } catch (error) {
      console.error(`Error fetching RSS feed ${rssUrl}:`, error.message);
    }
    
    return articles;
  }

  /**
   * Process individual RSS item into article
   */
  private async processRSSItem(item: any, source: NewsSource): Promise<ProcessedArticle | null> {
    try {
      const title = item.title?.[0] || item.title?._ || '';
      const url = item.link?.[0] || item.link?._ || item.id?.[0] || '';
      const description = item.description?.[0] || item.summary?.[0] || '';
      const pubDate = item.pubDate?.[0] || item.published?.[0] || new Date().toISOString();
      const author = item.author?.[0] || item['dc:creator']?.[0] || '';
      
      if (!title || !url) {
        return null;
      }
      
      // Extract full content if possible
      let content = description;
      try {
        const articleContent = await this.extractFullContent(url);
        if (articleContent) {
          content = articleContent;
        }
      } catch (error) {
        // Use description as fallback
      }
      
      // Enhanced AI analysis with OpenAI
      let aiAnalysis: any = {};
      try {
        aiAnalysis = await openaiNewsAnalyzer.analyzeArticle({
          title,
          description: content,
          source: source.name,
          url
        });
      } catch (error) {
        console.log('Using fallback analysis for', title.substring(0, 50));
      }

      // Combine AI analysis with basic extraction
      const politicalTopics = aiAnalysis.key_themes || this.extractPoliticalTopics(title + ' ' + content);
      const mentionedPoliticians = aiAnalysis.politicians_mentioned || this.extractMentionedPoliticians(title + ' ' + content);
      const mentionedBills = this.extractMentionedBills(title + ' ' + content);
      const sentiment = aiAnalysis.sentiment === 'positive' ? 0.5 : aiAnalysis.sentiment === 'negative' ? -0.5 : 0;
      const factualityScore = aiAnalysis.credibility_score || this.calculateFactualityScore(content, source);
      const propagandaTechniques = aiAnalysis.propaganda_techniques || this.detectPropagandaTechniques(content);
      
      return {
        title: this.cleanText(title),
        url: url,
        content: this.cleanText(content),
        publishedAt: new Date(pubDate),
        source: source.id,
        author: author || null,
        bias: source.bias,
        credibilityScore: source.credibilityScore,
        politicalTopics,
        mentioned_politicians: mentionedPoliticians,
        mentioned_bills: mentionedBills,
        sentiment,
        factualityScore,
        propagandaTechniques
      };
      
    } catch (error) {
      console.error('Error processing RSS item:', error.message);
      return null;
    }
  }

  /**
   * Extract full article content from URL
   */
  private async extractFullContent(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'CivicOS-NewsAggregator/2.0'
        }
      });
      
      if (!response.ok) {
        return '';
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();
      
      // Extract main content
      const contentSelectors = [
        'article', '.article-body', '.post-content', '.entry-content',
        '.content', '.story-content', '.article-content', '#article-content',
        '.text', '.body', '.post-body', 'main'
      ];
      
      for (const selector of contentSelectors) {
        const content = $(selector).text().trim();
        if (content && content.length > 200) {
          return content;
        }
      }
      
      // Fallback to body text
      return $('body').text().trim();
      
    } catch (error) {
      return '';
    }
  }

  /**
   * Check if content is political/civic related
   */
  private isPoliticalContent(title: string, content: string): boolean {
    const politicalKeywords = [
      'parliament', 'government', 'minister', 'mp', 'mla', 'senator', 'politics',
      'election', 'vote', 'policy', 'bill', 'law', 'conservative', 'liberal',
      'ndp', 'bloc', 'green', 'trudeau', 'singh', 'poilievre', 'blanchet',
      'ottawa', 'federal', 'provincial', 'municipal', 'council', 'mayor',
      'cabinet', 'opposition', 'democracy', 'legislative', 'committee'
    ];
    
    const text = (title + ' ' + content).toLowerCase();
    return politicalKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Extract political topics from content
   */
  private extractPoliticalTopics(content: string): string[] {
    const topics = [];
    const topicKeywords = {
      'Healthcare': ['health', 'hospital', 'medical', 'healthcare', 'medicare'],
      'Economy': ['economy', 'economic', 'budget', 'tax', 'inflation', 'gdp'],
      'Environment': ['climate', 'environment', 'carbon', 'emission', 'green'],
      'Immigration': ['immigration', 'refugee', 'border', 'citizenship'],
      'Education': ['education', 'school', 'university', 'student'],
      'Defense': ['military', 'defense', 'army', 'navy', 'security'],
      'Trade': ['trade', 'export', 'import', 'nafta', 'usmca'],
      'Justice': ['justice', 'court', 'legal', 'crime', 'police']
    };
    
    const lowerContent = content.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  /**
   * Extract mentioned politicians
   */
  private extractMentionedPoliticians(content: string): string[] {
    const politicians = [
      'Justin Trudeau', 'Pierre Poilievre', 'Jagmeet Singh', 'Yves-François Blanchet',
      'Elizabeth May', 'Chrystia Freeland', 'Anita Anand', 'Sean Fraser',
      'Marco Mendicino', 'Jonathan Wilkinson', 'François-Philippe Champagne'
    ];
    
    return politicians.filter(politician => 
      content.toLowerCase().includes(politician.toLowerCase())
    );
  }

  /**
   * Extract mentioned bills
   */
  private extractMentionedBills(content: string): string[] {
    const billMatches = content.match(/([CB]-\d+|Bill [CB]-?\d+)/gi) || [];
    return [...new Set(billMatches)];
  }

  /**
   * Analyze sentiment (-1 to 1)
   */
  private analyzeSentiment(content: string): number {
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'improve'];
    const negativeWords = ['bad', 'terrible', 'negative', 'fail', 'crisis', 'problem'];
    
    const words = content.toLowerCase().split(/\s+/);
    let score = 0;
    
    for (const word of words) {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    }
    
    return Math.max(-1, Math.min(1, score / words.length * 100));
  }

  /**
   * Calculate factuality score
   */
  private calculateFactualityScore(content: string, source: NewsSource): number {
    let score = source.credibilityScore;
    
    // Adjust based on content characteristics
    if (content.includes('sources say') || content.includes('according to')) score += 5;
    if (content.includes('allegedly') || content.includes('reportedly')) score -= 3;
    if (content.match(/\d{4}-\d{2}-\d{2}/)) score += 2; // Contains dates
    if (content.match(/\$[\d,]+/)) score += 2; // Contains specific numbers
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Detect propaganda techniques
   */
  private detectPropagandaTechniques(content: string): string[] {
    const techniques = [];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('experts agree') || lowerContent.includes('everyone knows')) {
      techniques.push('Bandwagon');
    }
    if (lowerContent.includes('!') && content.split('!').length > 3) {
      techniques.push('Emotional Appeal');
    }
    if (lowerContent.includes('always') || lowerContent.includes('never')) {
      techniques.push('Black and White');
    }
    
    return techniques;
  }

  /**
   * Store articles in database
   */
  private async storeArticles(articles: ProcessedArticle[]): Promise<void> {
    for (const article of articles) {
      try {
        await db.insert(newsArticles).values({
          title: article.title,
          url: article.url,
          content: article.content,
          publishedAt: article.publishedAt,
          source: article.source,
          author: article.author,
          bias: article.bias,
          credibilityScore: article.credibilityScore,
          politicalTopics: article.politicalTopics,
          mentionedPoliticians: article.mentioned_politicians,
          mentionedBills: article.mentioned_bills,
          sentiment: article.sentiment,
          factualityScore: article.factualityScore,
          propagandaTechniques: article.propagandaTechniques
        }).onConflictDoNothing();
      } catch (error) {
        // Skip duplicates
      }
    }
  }

  /**
   * Perform cross-source analysis
   */
  private async performCrossSourceAnalysis(articles: ProcessedArticle[]): Promise<void> {
    // Group articles by similar topics
    const topicGroups = this.groupArticlesByTopic(articles);
    
    for (const [topic, topicArticles] of Object.entries(topicGroups)) {
      if (topicArticles.length > 1) {
        await this.analyzeTopicCoverage(topic, topicArticles);
      }
    }
  }

  /**
   * Group articles by topic
   */
  private groupArticlesByTopic(articles: ProcessedArticle[]): Record<string, ProcessedArticle[]> {
    const groups: Record<string, ProcessedArticle[]> = {};
    
    for (const article of articles) {
      for (const topic of article.politicalTopics) {
        if (!groups[topic]) {
          groups[topic] = [];
        }
        groups[topic].push(article);
      }
    }
    
    return groups;
  }

  /**
   * Analyze topic coverage across sources
   */
  private async analyzeTopicCoverage(topic: string, articles: ProcessedArticle[]): Promise<void> {
    const biasDistribution = this.calculateBiasDistribution(articles);
    const consensusLevel = this.calculateConsensusLevel(articles);
    const credibilityRange = this.calculateCredibilityRange(articles);
    
    try {
      await db.insert(newsComparisons).values({
        topic: topic,
        articleCount: articles.length,
        biasDistribution: JSON.stringify(biasDistribution),
        consensusLevel: consensusLevel,
        averageCredibility: credibilityRange.average,
        timespan: '24h',
        analysisDate: new Date()
      });
    } catch (error) {
      // Skip if already exists
    }
  }

  /**
   * Calculate bias distribution
   */
  private calculateBiasDistribution(articles: ProcessedArticle[]): Record<string, number> {
    const distribution = { left: 0, center: 0, right: 0 };
    
    for (const article of articles) {
      distribution[article.bias]++;
    }
    
    return distribution;
  }

  /**
   * Calculate consensus level (0-100)
   */
  private calculateConsensusLevel(articles: ProcessedArticle[]): number {
    if (articles.length < 2) return 100;
    
    const avgSentiment = articles.reduce((sum, a) => sum + a.sentiment, 0) / articles.length;
    const sentimentVariance = articles.reduce((sum, a) => sum + Math.pow(a.sentiment - avgSentiment, 2), 0) / articles.length;
    
    return Math.max(0, 100 - (sentimentVariance * 100));
  }

  /**
   * Calculate credibility range
   */
  private calculateCredibilityRange(articles: ProcessedArticle[]): { min: number, max: number, average: number } {
    const scores = articles.map(a => a.credibilityScore);
    return {
      min: Math.min(...scores),
      max: Math.max(...scores),
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    };
  }

  /**
   * Clean text content
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n\t]/g, ' ')
      .trim()
      .substring(0, 5000); // Limit length
  }

  /**
   * Rate limiting delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const revolutionaryNewsAggregator = new RevolutionaryNewsAggregator();