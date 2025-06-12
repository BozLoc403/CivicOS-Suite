import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Statistics Canada API Integration
 * Official API: https://www.statcan.gc.ca/en/developers
 */
export class StatisticsCanadaAPI {
  private baseURL = 'https://www150.statcan.gc.ca/t1/wds/rest';

  /**
   * Fetch population demographics by electoral district
   */
  async fetchPopulationData() {
    try {
      console.log("Fetching population data from Statistics Canada...");
      
      // Population estimates by electoral district
      const response = await fetch(`${this.baseURL}/getDataFromVectorsAndLatestNPeriods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vectorIds: ['17100005'], // Population estimates
          latestN: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`Statistics Canada API returned ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Retrieved ${data.length || 0} population data points`);
      
      return data;
    } catch (error) {
      console.error("Error fetching Statistics Canada population data:", error);
      return [];
    }
  }

  /**
   * Fetch electoral district demographic data
   */
  async fetchElectoralDemographics() {
    try {
      console.log("Fetching electoral demographics from Statistics Canada...");
      
      const response = await fetch(`${this.baseURL}/getSeriesInfoFromVector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vectorId: '17100005'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Electoral demographics fetched successfully");
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching electoral demographics:", error);
      return null;
    }
  }

  /**
   * Fetch government expenditure data
   */
  async fetchGovernmentSpending() {
    try {
      console.log("Fetching government spending data...");
      
      const response = await fetch(`${this.baseURL}/getDataFromVectorsAndLatestNPeriods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vectorIds: ['10100001'], // Government expenditure
          latestN: 5
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Government spending data fetched successfully");
        return data;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching government spending:", error);
      return [];
    }
  }

  /**
   * Store demographic data for electoral analysis
   */
  private async storeDemographicData(data: any) {
    try {
      for (const item of data) {
        await db.execute(sql`
          INSERT INTO demographics (
            electoral_district, population, data_source, reference_date
          ) VALUES (
            ${item.geoLevel}, ${item.value}, 'Statistics Canada', ${item.refPer}
          )
          ON CONFLICT (electoral_district, reference_date) DO UPDATE SET
            population = EXCLUDED.population,
            updated_at = NOW()
        `);
      }
    } catch (error) {
      console.error("Error storing demographic data:", error);
    }
  }

  /**
   * Comprehensive Statistics Canada data sync
   */
  async performStatCanSync() {
    console.log("Starting Statistics Canada API data sync...");
    
    const [population, demographics, spending] = await Promise.allSettled([
      this.fetchPopulationData(),
      this.fetchElectoralDemographics(),
      this.fetchGovernmentSpending()
    ]);
    
    // Store population data if available
    if (population.status === 'fulfilled' && population.value.length > 0) {
      await this.storeDemographicData(population.value);
    }
    
    console.log("Statistics Canada data sync completed");
    
    return {
      population: population.status === 'fulfilled' ? population.value.length : 0,
      demographics: demographics.status === 'fulfilled' ? 1 : 0,
      spending: spending.status === 'fulfilled' ? spending.value.length : 0
    };
  }
}

export const statisticsCanadaAPI = new StatisticsCanadaAPI();