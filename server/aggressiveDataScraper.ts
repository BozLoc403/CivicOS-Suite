import * as cheerio from "cheerio";
import { db } from "./db";
import { politicians, bills, politicianStatements } from "@shared/schema";
import { eq } from "drizzle-orm";

interface ScrapingConfig {
  maxRetries: number;
  delayBetweenRequests: number;
  timeout: number;
  userAgent: string;
}

interface GovernmentSource {
  name: string;
  url: string;
  type: 'federal' | 'provincial' | 'municipal';
  dataTypes: string[];
  scrapeFrequency: number; // hours
}

/**
 * Aggressive data scraper for maximum authentic government data collection
 */
export class AggressiveDataScraper {
  private config: ScrapingConfig = {
    maxRetries: 5,
    delayBetweenRequests: 2000, // 2 seconds
    timeout: 30000, // 30 seconds
    userAgent: 'CivicOS-DataVerification/1.0 (Government Data Verification Service)'
  };

  private governmentSources: GovernmentSource[] = [
    // Federal Sources
    {
      name: 'Parliament of Canada - MP Directory',
      url: 'https://www.ourcommons.ca/members/en',
      type: 'federal',
      dataTypes: ['politicians', 'contact_info', 'committees'],
      scrapeFrequency: 24
    },
    {
      name: 'Senate of Canada',
      url: 'https://sencanada.ca/en/senators/',
      type: 'federal',
      dataTypes: ['politicians', 'committees', 'voting_records'],
      scrapeFrequency: 24
    },
    {
      name: 'LEGISinfo - Bills and Laws',
      url: 'https://www.parl.ca/legisinfo/en/bills',
      type: 'federal',
      dataTypes: ['bills', 'voting_records', 'committee_reports'],
      scrapeFrequency: 6
    },
    {
      name: 'House of Commons Hansard',
      url: 'https://www.ourcommons.ca/DocumentViewer/en/house/latest/hansard',
      type: 'federal',
      dataTypes: ['voting_records', 'speeches', 'statements'],
      scrapeFrequency: 2
    },
    {
      name: 'Ethics Commissioner Filings',
      url: 'https://ciec-ccie.parl.gc.ca/en/Pages/default.aspx',
      type: 'federal',
      dataTypes: ['financial_disclosures', 'conflict_interests'],
      scrapeFrequency: 168 // Weekly
    },
    
    // Provincial Sources
    {
      name: 'Ontario Legislature',
      url: 'https://www.ola.org/en/members/current',
      type: 'provincial',
      dataTypes: ['politicians', 'voting_records'],
      scrapeFrequency: 24
    },
    {
      name: 'Quebec National Assembly',
      url: 'https://www.assnat.qc.ca/en/deputes/index.html',
      type: 'provincial',
      dataTypes: ['politicians', 'voting_records'],
      scrapeFrequency: 24
    },
    {
      name: 'BC Legislature',
      url: 'https://www.leg.bc.ca/learn-about-us/members',
      type: 'provincial',
      dataTypes: ['politicians', 'voting_records'],
      scrapeFrequency: 24
    },
    {
      name: 'Alberta Legislature',
      url: 'https://www.assembly.ab.ca/members/members-of-the-legislative-assembly',
      type: 'provincial',
      dataTypes: ['politicians', 'voting_records'],
      scrapeFrequency: 24
    }
  ];

  /**
   * Perform comprehensive data scraping from all government sources
   */
  async performComprehensiveScraping(): Promise<void> {
    console.log('Starting aggressive data scraping from all government sources...');
    
    for (const source of this.governmentSources) {
      try {
        console.log(`Scraping ${source.name}...`);
        await this.scrapeGovernmentSource(source);
        
        // Delay between sources to avoid overwhelming servers
        await this.delay(this.config.delayBetweenRequests);
      } catch (error) {
        console.error(`Error scraping ${source.name}:`, error);
        continue; // Continue with other sources
      }
    }
    
    console.log('Comprehensive scraping completed');
  }

  /**
   * Scrape individual government source with retry logic
   */
  private async scrapeGovernmentSource(source: GovernmentSource): Promise<void> {
    let retries = 0;
    
    while (retries < this.config.maxRetries) {
      try {
        const response = await fetch(source.url, {
          headers: {
            'User-Agent': this.config.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-CA,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Cache-Control': 'no-cache'
          },
          signal: AbortSignal.timeout(this.config.timeout)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        await this.processSourceData(source, html);
        return; // Success
        
      } catch (error) {
        retries++;
        console.error(`Attempt ${retries} failed for ${source.name}:`, error);
        
        if (retries < this.config.maxRetries) {
          // Exponential backoff
          const delay = this.config.delayBetweenRequests * Math.pow(2, retries - 1);
          await this.delay(delay);
        }
      }
    }
    
    throw new Error(`Failed to scrape ${source.name} after ${this.config.maxRetries} attempts`);
  }

  /**
   * Process and extract data from government source HTML
   */
  private async processSourceData(source: GovernmentSource, html: string): Promise<void> {
    const $ = cheerio.load(html);
    
    switch (source.type) {
      case 'federal':
        await this.processFederalData(source, $);
        break;
      case 'provincial':
        await this.processProvincialData(source, $);
        break;
      case 'municipal':
        await this.processMunicipalData(source, $);
        break;
    }
  }

  /**
   * Process federal government data
   */
  private async processFederalData(source: GovernmentSource, $: cheerio.CheerioAPI): Promise<void> {
    if (source.dataTypes.includes('politicians')) {
      await this.extractFederalPoliticians($);
    }
    
    if (source.dataTypes.includes('bills')) {
      await this.extractFederalBills($);
    }
    
    if (source.dataTypes.includes('voting_records')) {
      await this.extractVotingRecords($);
    }
    
    if (source.dataTypes.includes('statements')) {
      await this.extractPoliticianStatements($);
    }
  }

  /**
   * Extract federal politicians with comprehensive data
   */
  private async extractFederalPoliticians($: cheerio.CheerioAPI): Promise<void> {
    const politicians: any[] = [];
    
    // Multiple selectors for different page structures
    const selectors = [
      '.mp-card',
      '.member-card',
      '.politician-profile',
      '.member-info',
      'tr[data-member]'
    ];
    
    for (const selector of selectors) {
      $(selector).each((_, element) => {
        const $el = $(element);
        
        const politician = this.extractPoliticianData($el);
        if (politician.name) {
          politicians.push(politician);
        }
      });
      
      if (politicians.length > 0) break; // Found data with this selector
    }
    
    // Store extracted politicians
    for (const pol of politicians) {
      await this.storePolitician(pol);
    }
    
    console.log(`Extracted ${politicians.length} federal politicians`);
  }

  /**
   * Extract comprehensive politician data from element
   */
  private extractPoliticianData($el: cheerio.Cheerio<any>): any {
    const name = this.extractText($el, [
      '.name', '.member-name', '.politician-name', 
      'h3', 'h4', '.title', '.mp-name'
    ]);
    
    const position = this.extractText($el, [
      '.position', '.title', '.role', '.office',
      '.member-title', '.politician-role'
    ]) || 'Member of Parliament';
    
    const party = this.extractText($el, [
      '.party', '.political-party', '.affiliation',
      '.party-name', '.member-party'
    ]);
    
    const constituency = this.extractText($el, [
      '.constituency', '.riding', '.district', 
      '.electoral-district', '.member-constituency'
    ]);
    
    const phone = this.extractText($el, [
      '.phone', '.telephone', '.contact-phone',
      'a[href^="tel:"]'
    ]);
    
    const email = this.extractText($el, [
      '.email', 'a[href^="mailto:"]',
      '.contact-email', '.member-email'
    ]);
    
    const website = this.extractAttribute($el, [
      'a[href*="parl.gc.ca"]',
      '.website a', '.member-link a'
    ], 'href');
    
    return {
      name: this.cleanText(name),
      position: this.cleanText(position),
      party: this.cleanText(party),
      constituency: this.cleanText(constituency),
      jurisdiction: 'Canada',
      contactInfo: {
        phone: this.cleanText(phone),
        email: this.cleanText(email),
        website: this.cleanText(website)
      }
    };
  }

  /**
   * Extract federal bills with comprehensive metadata
   */
  private async extractFederalBills($: cheerio.CheerioAPI): Promise<void> {
    const bills: any[] = [];
    
    const selectors = [
      '.bill-item',
      '.legislation-item', 
      'tr[data-bill]',
      '.bill-row',
      '.legis-item'
    ];
    
    for (const selector of selectors) {
      $(selector).each((_, element) => {
        const $el = $(element);
        
        const bill = this.extractBillData($el);
        if (bill.billNumber) {
          bills.push(bill);
        }
      });
      
      if (bills.length > 0) break;
    }
    
    for (const bill of bills) {
      await this.storeBill(bill);
    }
    
    console.log(`Extracted ${bills.length} federal bills`);
  }

  /**
   * Extract comprehensive bill data
   */
  private extractBillData($el: cheerio.Cheerio<any>): any {
    const billNumber = this.extractText($el, [
      '.bill-number', '.legislation-number',
      '.bill-id', '.legis-number'
    ]);
    
    const title = this.extractText($el, [
      '.bill-title', '.legislation-title',
      'h3', 'h4', '.title', '.bill-name'
    ]);
    
    const status = this.extractText($el, [
      '.status', '.bill-status', '.stage',
      '.current-stage', '.legislation-status'
    ]);
    
    const sponsor = this.extractText($el, [
      '.sponsor', '.bill-sponsor', '.introduced-by',
      '.member-sponsor'
    ]);
    
    const summary = this.extractText($el, [
      '.summary', '.description', '.bill-summary',
      '.legislation-summary', '.abstract'
    ]);
    
    return {
      billNumber: this.cleanText(billNumber),
      title: this.cleanText(title),
      status: this.cleanText(status),
      sponsor: this.cleanText(sponsor),
      summary: this.cleanText(summary),
      category: this.inferBillCategory(title),
      jurisdiction: 'Canada'
    };
  }

  /**
   * Extract voting records from parliamentary documents
   */
  private async extractVotingRecords($: cheerio.CheerioAPI): Promise<void> {
    const votes: any[] = [];
    
    $('.vote-record, .division-result, .voting-result').each((_, element) => {
      const $el = $(element);
      
      const vote = {
        billNumber: this.extractText($el, ['.bill-number', '.legislation']),
        date: this.extractText($el, ['.date', '.vote-date']),
        result: this.extractText($el, ['.result', '.outcome']),
        yesVotes: this.extractText($el, ['.yes-votes', '.ayes']),
        noVotes: this.extractText($el, ['.no-votes', '.nays']),
        abstentions: this.extractText($el, ['.abstentions', '.abstain'])
      };
      
      if (vote.billNumber) {
        votes.push(vote);
      }
    });
    
    console.log(`Extracted ${votes.length} voting records`);
  }

  /**
   * Extract politician statements from Hansard and speeches
   */
  private async extractPoliticianStatements($: cheerio.CheerioAPI): Promise<void> {
    const statements: any[] = [];
    
    $('.speech, .statement, .intervention, .hansard-entry').each((_, element) => {
      const $el = $(element);
      
      const statement = {
        speaker: this.extractText($el, ['.speaker', '.member-name', '.politician']),
        content: this.extractText($el, ['.content', '.text', '.speech-text']),
        date: this.extractText($el, ['.date', '.timestamp']),
        context: this.extractText($el, ['.context', '.subject', '.topic']),
        source: 'House of Commons Hansard'
      };
      
      if (statement.speaker && statement.content) {
        statements.push(statement);
      }
    });
    
    for (const statement of statements) {
      await this.storeStatement(statement);
    }
    
    console.log(`Extracted ${statements.length} politician statements`);
  }

  /**
   * Process provincial government data
   */
  private async processProvincialData(source: GovernmentSource, $: cheerio.CheerioAPI): Promise<void> {
    // Similar processing for provincial data with province-specific selectors
    await this.extractProvincialPoliticians($, source.url);
  }

  /**
   * Extract provincial politicians
   */
  private async extractProvincialPoliticians($: cheerio.CheerioAPI, sourceUrl: string): Promise<void> {
    const province = this.determineProvince(sourceUrl);
    const politicians: any[] = [];
    
    $('.mla-card, .member-card, .politician-profile').each((_, element) => {
      const $el = $(element);
      
      const politician = this.extractPoliticianData($el);
      politician.jurisdiction = province;
      politician.position = politician.position || 'Member of Legislative Assembly';
      
      if (politician.name) {
        politicians.push(politician);
      }
    });
    
    for (const pol of politicians) {
      await this.storePolitician(pol);
    }
    
    console.log(`Extracted ${politicians.length} ${province} politicians`);
  }

  /**
   * Process municipal government data
   */
  private async processMunicipalData(source: GovernmentSource, $: cheerio.CheerioAPI): Promise<void> {
    // Municipal data processing
    await this.extractMunicipalOfficials($, source.url);
  }

  /**
   * Extract municipal officials
   */
  private async extractMunicipalOfficials($: cheerio.CheerioAPI, sourceUrl: string): Promise<void> {
    const city = this.determineCity(sourceUrl);
    const officials: any[] = [];
    
    $('.councillor-card, .official-profile, .council-member').each((_, element) => {
      const $el = $(element);
      
      const official = this.extractPoliticianData($el);
      official.jurisdiction = city;
      official.position = official.position || 'City Councillor';
      
      if (official.name) {
        officials.push(official);
      }
    });
    
    for (const official of officials) {
      await this.storePolitician(official);
    }
    
    console.log(`Extracted ${officials.length} ${city} officials`);
  }

  // Helper methods

  private extractText($el: cheerio.Cheerio<any>, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $el.find(selector).first().text().trim();
      if (text) return text;
    }
    return '';
  }

  private extractAttribute($el: cheerio.Cheerio<any>, selectors: string[], attr: string): string {
    for (const selector of selectors) {
      const value = $el.find(selector).first().attr(attr);
      if (value) return value;
    }
    return '';
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,()]/g, '')
      .trim();
  }

  private inferBillCategory(title: string): string {
    const categories = {
      'Healthcare': ['health', 'medical', 'hospital', 'medicare'],
      'Environment': ['climate', 'environment', 'carbon', 'green', 'emission'],
      'Economy': ['tax', 'budget', 'economic', 'finance', 'trade'],
      'Justice': ['criminal', 'justice', 'court', 'legal', 'crime'],
      'Technology': ['digital', 'internet', 'cyber', 'data', 'privacy'],
      'Defense': ['defense', 'military', 'security', 'armed forces'],
      'Education': ['education', 'school', 'university', 'student'],
      'Immigration': ['immigration', 'refugee', 'citizenship', 'border']
    };
    
    const lowerTitle = title.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return category;
      }
    }
    
    return 'General';
  }

  private determineProvince(url: string): string {
    const provinceMap: { [key: string]: string } = {
      'ola.org': 'Ontario',
      'assnat.qc.ca': 'Quebec',
      'leg.bc.ca': 'British Columbia',
      'assembly.ab.ca': 'Alberta',
      'legassembly.sk.ca': 'Saskatchewan',
      'gov.mb.ca': 'Manitoba',
      'nslegislature.ca': 'Nova Scotia',
      'gnb.ca': 'New Brunswick',
      'assembly.pe.ca': 'Prince Edward Island',
      'assembly.nl.ca': 'Newfoundland and Labrador'
    };
    
    for (const [domain, province] of Object.entries(provinceMap)) {
      if (url.includes(domain)) {
        return province;
      }
    }
    
    return 'Unknown Province';
  }

  private determineCity(url: string): string {
    const cityMap: { [key: string]: string } = {
      'toronto.ca': 'Toronto',
      'vancouver.ca': 'Vancouver',
      'montreal.ca': 'Montreal',
      'calgary.ca': 'Calgary',
      'ottawa.ca': 'Ottawa',
      'edmonton.ca': 'Edmonton'
    };
    
    for (const [domain, city] of Object.entries(cityMap)) {
      if (url.includes(domain)) {
        return city;
      }
    }
    
    return 'Unknown City';
  }

  private async storePolitician(politicianData: any): Promise<void> {
    try {
      const level = this.determineLevel(politicianData.position);
      const contact = politicianData.contactInfo ? {
        phone: politicianData.contactInfo.phone,
        email: politicianData.contactInfo.email,
        website: politicianData.contactInfo.website,
        office: politicianData.contactInfo.office
      } : null;

      await db.insert(politicians).values({
        name: politicianData.name,
        position: politicianData.position,
        party: politicianData.party,
        level: level,
        constituency: politicianData.constituency,
        jurisdiction: politicianData.jurisdiction,
        contact: contact,
        trustScore: '75.00'
      }).onConflictDoUpdate({
        target: [politicians.name],
        set: {
          party: politicianData.party,
          level: level,
          constituency: politicianData.constituency,
          contact: contact,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error storing politician:', error);
    }
  }

  private determineLevel(position: string): string {
    if (position.includes('Member of Parliament') || position.includes('MP') || position.includes('Senator')) {
      return 'Federal';
    } else if (position.includes('Premier') || position.includes('MLA') || position.includes('MPP') || position.includes('MNA')) {
      return 'Provincial';
    } else if (position.includes('Mayor') || position.includes('Councillor') || position.includes('Alderman')) {
      return 'Municipal';
    }
    return 'Federal';
  }

  private async storeBill(billData: any): Promise<void> {
    try {
      const existing = await db
        .select()
        .from(bills)
        .where(eq(bills.billNumber, billData.billNumber))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(bills).values({
          billNumber: billData.billNumber,
          title: billData.title,
          summary: billData.summary,
          status: billData.status,
          category: billData.category,
          votingDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });
      }
    } catch (error) {
      console.error('Error storing bill:', error);
    }
  }

  private async storeStatement(statementData: any): Promise<void> {
    try {
      // Find politician by name
      const politician = await db
        .select()
        .from(politicians)
        .where(eq(politicians.name, statementData.speaker))
        .limit(1);

      if (politician.length > 0) {
        await db.insert(politicianStatements).values({
          politicianId: politician[0].id,
          statement: statementData.content,
          context: statementData.context,
          source: statementData.source
        });
      }
    } catch (error) {
      console.error('Error storing statement:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aggressiveScraper = new AggressiveDataScraper();