import { db } from "./db";
import { sql } from "drizzle-orm";
import * as cheerio from "cheerio";

/**
 * Parliament of Canada Open Data Integration
 * Uses official Parliament API endpoints and structured data feeds
 */
export class ParliamentAPIService {
  
  /**
   * Fetch current MPs from Parliament of Canada official source
   */
  async fetchCurrentMPs() {
    try {
      console.log("Fetching current MPs from Parliament of Canada...");
      
      // Parliament's official MP listing
      const response = await fetch('https://www.ourcommons.ca/members/en/search', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Parliament API returned ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const mps = [];
      
      // Parse MP data from official Parliament structure
      $('.ce-mip-mp-tile').each((index, element) => {
        const $mp = $(element);
        
        const name = $mp.find('.ce-mip-mp-name').text().trim();
        const party = $mp.find('.ce-mip-mp-party').text().trim();
        const constituency = $mp.find('.ce-mip-mp-constituency').text().trim();
        const province = $mp.find('.ce-mip-mp-province').text().trim();
        
        if (name && party && constituency) {
          mps.push({
            name,
            party,
            constituency,
            province,
            position: 'Member of Parliament',
            level: 'federal',
            jurisdiction: province || 'Federal',
            source: 'Parliament of Canada Official'
          });
        }
      });
      
      console.log(`Found ${mps.length} MPs from Parliament official source`);
      
      // Store authentic MP data
      for (const mp of mps) {
        await this.storeMPData(mp);
      }
      
      return mps;
    } catch (error) {
      console.error("Error fetching Parliament MPs:", error);
      return [];
    }
  }

  /**
   * Fetch federal bills from LEGISinfo
   */
  async fetchFederalBills() {
    try {
      console.log("Fetching federal bills from LEGISinfo...");
      
      const response = await fetch('https://www.parl.ca/legisinfo/en/bills/current-session', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`LEGISinfo returned ${response.status}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const bills = [];
      
      // Parse bill data from LEGISinfo structure
      $('.bill-item').each((index, element) => {
        const $bill = $(element);
        
        const title = $bill.find('.bill-title').text().trim();
        const number = $bill.find('.bill-number').text().trim();
        const status = $bill.find('.bill-status').text().trim();
        const summary = $bill.find('.bill-summary').text().trim();
        
        if (title && number) {
          bills.push({
            title,
            bill_number: number,
            status: status.toLowerCase(),
            summary,
            jurisdiction: 'federal',
            source: 'LEGISinfo Official'
          });
        }
      });
      
      console.log(`Found ${bills.length} federal bills from LEGISinfo`);
      
      // Store authentic bill data
      for (const bill of bills) {
        await this.storeBillData(bill);
      }
      
      return bills;
    } catch (error) {
      console.error("Error fetching federal bills:", error);
      return [];
    }
  }

  /**
   * Store authentic MP data from Parliament source
   */
  private async storeMPData(mpData: any) {
    try {
      await db.execute(sql`
        INSERT INTO politicians (
          name, position, party, level, constituency, jurisdiction, source
        ) VALUES (
          ${mpData.name}, ${mpData.position}, ${mpData.party}, 
          ${mpData.level}, ${mpData.constituency}, ${mpData.jurisdiction}, ${mpData.source}
        )
        ON CONFLICT (name, constituency) DO UPDATE SET
          party = EXCLUDED.party,
          position = EXCLUDED.position,
          updated_at = NOW()
      `);
    } catch (error) {
      console.error("Error storing MP data:", error);
    }
  }

  /**
   * Store authentic bill data from LEGISinfo
   */
  private async storeBillData(billData: any) {
    try {
      await db.execute(sql`
        INSERT INTO bills (
          title, bill_number, status, description, jurisdiction
        ) VALUES (
          ${billData.title}, ${billData.bill_number}, ${billData.status},
          ${billData.summary}, ${billData.jurisdiction}
        )
        ON CONFLICT (bill_number) DO UPDATE SET
          status = EXCLUDED.status,
          description = EXCLUDED.description,
          updated_at = NOW()
      `);
    } catch (error) {
      console.error("Error storing bill data:", error);
    }
  }

  /**
   * Comprehensive Parliament data sync
   */
  async performParliamentSync() {
    console.log("Starting comprehensive Parliament of Canada data sync...");
    
    const [mps, bills] = await Promise.allSettled([
      this.fetchCurrentMPs(),
      this.fetchFederalBills()
    ]);
    
    console.log("Parliament data sync completed");
    
    return {
      mps: mps.status === 'fulfilled' ? mps.value.length : 0,
      bills: bills.status === 'fulfilled' ? bills.value.length : 0
    };
  }
}

export const parliamentAPI = new ParliamentAPIService();