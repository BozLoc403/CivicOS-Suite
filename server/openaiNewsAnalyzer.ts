import { db } from "./db";
import { newsArticles } from "@shared/schema";
import fetch from 'node-fetch';

/**
 * OpenAI-powered news analysis system for political content
 */
export class OpenAINewsAnalyzer {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY!;
  }

  /**
   * Analyze article with OpenAI for political insights
   */
  async analyzeArticle(article: any): Promise<any> {
    if (!this.openaiApiKey) {
      return this.basicAnalysis(article);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "You are a Canadian political analyst. Analyze news articles for political sentiment, bias, key themes, and involved politicians. Always respond in valid JSON format."
          }, {
            role: "user",
            content: `Analyze this Canadian political news article:

Title: ${article.title}
Content: ${article.description || article.summary || article.content || ''}
Source: ${article.source}

Return JSON with:
{
  "sentiment": "positive/negative/neutral",
  "bias_rating": "left/center/right", 
  "credibility_score": 0-100,
  "key_themes": ["theme1", "theme2"],
  "politicians_mentioned": ["politician1", "politician2"],
  "political_impact": "brief description",
  "fact_check_needed": true/false,
  "emotional_tone": "neutral/inflammatory/measured",
  "propaganda_techniques": ["technique1", "technique2"]
}`
          }],
          response_format: { type: "json_object" },
          max_tokens: 800
        })
      });

      if (response.ok) {
        const data = await response.json() as any;
        return JSON.parse(data.choices[0].message.content);
      } else {
        console.log('OpenAI API error, using fallback analysis');
        return this.basicAnalysis(article);
      }
    } catch (error) {
      console.error('Error with OpenAI analysis:', error);
      return this.basicAnalysis(article);
    }
  }

  /**
   * Basic analysis fallback when AI is unavailable
   */
  private basicAnalysis(article: any): any {
    const text = (article.title + ' ' + (article.description || article.summary || '')).toLowerCase();
    
    return {
      sentiment: this.detectSentiment(text),
      bias_rating: this.detectBias(article.source),
      credibility_score: this.getSourceCredibility(article.source),
      key_themes: this.extractThemes(text),
      politicians_mentioned: this.extractPoliticians(text),
      political_impact: 'Requires detailed analysis',
      fact_check_needed: this.needsFactCheck(text),
      emotional_tone: this.detectTone(text),
      propaganda_techniques: this.detectPropaganda(text)
    };
  }

  private detectSentiment(text: string): string {
    const positiveWords = ['approve', 'support', 'success', 'win', 'improve', 'benefit', 'progress', 'achieve'];
    const negativeWords = ['oppose', 'fail', 'crisis', 'scandal', 'corrupt', 'decline', 'problem', 'concern'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private detectBias(source: string): string {
    const leftSources = ['toronto star', 'globe and mail', 'cbc'];
    const rightSources = ['national post', 'sun news'];
    
    const lowerSource = source.toLowerCase();
    if (leftSources.some(s => lowerSource.includes(s))) return 'left';
    if (rightSources.some(s => lowerSource.includes(s))) return 'right';
    return 'center';
  }

  private getSourceCredibility(source: string): number {
    const credibilityMap: { [key: string]: number } = {
      'cbc': 85, 'ctv': 80, 'globe and mail': 85, 'national post': 75,
      'toronto star': 75, 'global news': 70, 'canadian press': 90,
      'hill times': 85, 'ipolitics': 80, 'le devoir': 80
    };
    
    const lowerSource = source.toLowerCase();
    for (const [sourceName, score] of Object.entries(credibilityMap)) {
      if (lowerSource.includes(sourceName)) return score;
    }
    return 65;
  }

  private extractThemes(text: string): string[] {
    const themes: string[] = [];
    const politicalTerms = {
      'healthcare': 'Healthcare', 'economy': 'Economy', 'education': 'Education',
      'environment': 'Environment', 'defense': 'Defense', 'immigration': 'Immigration',
      'tax': 'Taxation', 'budget': 'Budget', 'election': 'Elections',
      'parliament': 'Parliament', 'senate': 'Senate', 'cabinet': 'Cabinet',
      'provincial': 'Provincial Politics', 'municipal': 'Municipal Politics'
    };

    for (const [term, theme] of Object.entries(politicalTerms)) {
      if (text.includes(term)) themes.push(theme);
    }

    return themes.length > 0 ? themes : ['General Politics'];
  }

  private extractPoliticians(text: string): string[] {
    const politicians = [
      'trudeau', 'singh', 'poilievre', 'blanchet', 'may',
      'ford', 'legault', 'moe', 'kenney', 'horgan', 'furey',
      'higgs', 'houston', 'king', 'stefanson'
    ];

    return politicians.filter(politician => text.includes(politician))
      .map(p => p.charAt(0).toUpperCase() + p.slice(1));
  }

  private needsFactCheck(text: string): boolean {
    const factCheckKeywords = ['claims', 'alleges', 'reports suggest', 'sources say', 'according to'];
    return factCheckKeywords.some(keyword => text.includes(keyword));
  }

  private detectTone(text: string): string {
    const inflammatoryWords = ['slam', 'blast', 'attack', 'fury', 'outrage', 'scandal'];
    const measuredWords = ['discuss', 'consider', 'review', 'analyze', 'examine'];
    
    if (inflammatoryWords.some(word => text.includes(word))) return 'inflammatory';
    if (measuredWords.some(word => text.includes(word))) return 'measured';
    return 'neutral';
  }

  private detectPropaganda(text: string): string[] {
    const techniques: string[] = [];
    
    if (text.includes('expert') || text.includes('studies show')) {
      techniques.push('Appeal to Authority');
    }
    if (text.includes('everyone') || text.includes('nobody')) {
      techniques.push('Bandwagon');
    }
    if (text.includes('crisis') || text.includes('disaster')) {
      techniques.push('Fear Appeal');
    }
    if (text.includes('always') || text.includes('never')) {
      techniques.push('Black and White Fallacy');
    }
    
    return techniques;
  }

  /**
   * Store analyzed article in database
   */
  async storeAnalyzedArticle(article: any, analysis: any): Promise<void> {
    try {
      await db.insert(newsArticles).values({
        title: article.title,
        url: article.url || article.link,
        content: article.description || article.summary || '',
        source: article.source,
        publishedAt: new Date(article.pubDate || article.published || Date.now()),
        sentiment: analysis.sentiment || 'neutral',
        biasRating: analysis.bias_rating || 'center',
        credibilityScore: analysis.credibility_score || 65,
        keyThemes: analysis.key_themes || [],
        politiciansInvolved: analysis.politicians_mentioned || [],
        factCheckNeeded: analysis.fact_check_needed || false,
        emotionalTone: analysis.emotional_tone || 'neutral',
        propagandaTechniques: analysis.propaganda_techniques || []
      }).onConflictDoUpdate({
        target: newsArticles.url,
        set: {
          sentiment: analysis.sentiment || 'neutral',
          biasRating: analysis.bias_rating || 'center',
          credibilityScore: analysis.credibility_score || 65,
          keyThemes: analysis.key_themes || [],
          politiciansInvolved: analysis.politicians_mentioned || [],
          factCheckNeeded: analysis.fact_check_needed || false,
          emotionalTone: analysis.emotional_tone || 'neutral',
          propagandaTechniques: analysis.propaganda_techniques || [],
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error storing analyzed article:', error);
    }
  }
}

export const openaiNewsAnalyzer = new OpenAINewsAnalyzer();