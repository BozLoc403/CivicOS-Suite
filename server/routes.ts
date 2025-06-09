import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authenticDataService } from "./authenticDataService";
import { comprehensiveAnalytics } from "./comprehensiveAnalytics";
import { realTimeMonitoring } from "./realTimeMonitoring";
import { civicAI } from "./civicAI";
import { votingSystem } from "./votingSystem";
import { db } from "./db";
import { sql } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard comprehensive data
  app.get('/api/dashboard/comprehensive', async (req, res) => {
    try {
      const [
        politiciansData,
        billsData,
        newsData,
        legalData,
        electionsData,
        analyticsData,
        monitoringData
      ] = await Promise.all([
        authenticDataService.getVerifiedPoliticians(),
        authenticDataService.getAuthenticBills(),
        { total: 0, avgCredibility: 0, avgSentiment: 0, recent: 0 },
        authenticDataService.getVerifiedLegalData(),
        { total: "0", active: "0", upcoming: "0" },
        comprehensiveAnalytics.generateComprehensiveAnalytics(),
        realTimeMonitoring.getSystemHealth()
      ]);

      res.json({
        politicians: politiciansData,
        bills: billsData,
        news: newsData,
        legal: legalData,
        elections: electionsData,
        analytics: analyticsData,
        monitoring: monitoringData,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error fetching comprehensive dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Politicians routes
  app.get('/api/politicians', async (req, res) => {
    try {
      const politicians = await db.execute(sql`
        SELECT 
          id, name, position, party, level, constituency, jurisdiction,
          trust_score as "trustScore", contact, profile_image as "profileImage"
        FROM politicians
        ORDER BY trust_score DESC NULLS LAST
        LIMIT 50
      `);
      res.json(politicians.rows);
    } catch (error) {
      console.error("Error fetching politicians:", error);
      res.status(500).json({ message: "Failed to fetch politicians" });
    }
  });

  app.get('/api/politicians/:id', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const politician = await db.execute(sql`
        SELECT * FROM politicians WHERE id = ${politicianId}
      `);
      
      if (politician.rows.length === 0) {
        return res.status(404).json({ message: "Politician not found" });
      }

      res.json(politician.rows[0]);
    } catch (error) {
      console.error("Error fetching politician:", error);
      res.status(500).json({ message: "Failed to fetch politician" });
    }
  });

  // Bills routes
  app.get('/api/bills', async (req, res) => {
    try {
      const bills = await db.execute(sql`
        SELECT * FROM bills ORDER BY date_introduced DESC
      `);
      res.json(bills.rows);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  // Legal routes
  app.get('/api/legal/acts', async (req, res) => {
    try {
      const acts = await db.execute(sql`
        SELECT * FROM legal_acts ORDER BY date_enacted DESC LIMIT 100
      `);
      res.json(acts.rows);
    } catch (error) {
      console.error("Error fetching legal acts:", error);
      res.status(500).json({ message: "Failed to fetch legal acts" });
    }
  });

  app.get('/api/legal/cases', async (req, res) => {
    try {
      const cases = await db.execute(sql`
        SELECT * FROM legal_cases ORDER BY date_decided DESC LIMIT 100
      `);
      res.json(cases.rows);
    } catch (error) {
      console.error("Error fetching legal cases:", error);
      res.status(500).json({ message: "Failed to fetch legal cases" });
    }
  });

  // Search endpoints
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const [politicians, bills, legalActs, legalCases] = await Promise.all([
        db.execute(sql`
          SELECT 'politician' as type, id, name as title, position as description
          FROM politicians 
          WHERE name ILIKE ${'%' + query + '%'} OR party ILIKE ${'%' + query + '%'}
          LIMIT 10
        `),
        db.execute(sql`
          SELECT 'bill' as type, id, title, summary as description
          FROM bills 
          WHERE title ILIKE ${'%' + query + '%'} OR summary ILIKE ${'%' + query + '%'}
          LIMIT 10
        `),
        db.execute(sql`
          SELECT 'legal_act' as type, id, title, summary as description
          FROM legal_acts 
          WHERE title ILIKE ${'%' + query + '%'} OR summary ILIKE ${'%' + query + '%'}
          LIMIT 10
        `),
        db.execute(sql`
          SELECT 'legal_case' as type, id, case_name as title, summary as description
          FROM legal_cases 
          WHERE case_name ILIKE ${'%' + query + '%'} OR summary ILIKE ${'%' + query + '%'}
          LIMIT 10
        `)
      ]);

      const results = [
        ...politicians.rows,
        ...bills.rows,
        ...legalActs.rows,
        ...legalCases.rows
      ];

      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  // Voting routes
  app.get('/api/voting/items', async (req, res) => {
    try {
      const items = await votingSystem.getActiveVotingItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching voting items:", error);
      res.status(500).json({ message: "Failed to fetch voting items" });
    }
  });

  app.post('/api/votes', isAuthenticated, async (req: any, res) => {
    try {
      const { itemId, itemType, vote } = req.body;
      const userId = req.user.claims.sub;

      const result = await votingSystem.castVote(userId, itemId, itemType, vote);
      res.json(result);
    } catch (error) {
      console.error("Error casting vote:", error);
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  // Petitions routes
  app.get('/api/petitions', async (req, res) => {
    try {
      const petitions = await db.execute(sql`
        SELECT 
          id, petition_number, title, description, target_signatures,
          current_signatures, status, deadline, created_date
        FROM petitions 
        ORDER BY created_date DESC
      `);
      res.json(petitions.rows);
    } catch (error) {
      console.error("Error fetching petitions:", error);
      res.status(500).json({ message: "Failed to fetch petitions" });
    }
  });

  app.post('/api/petitions/:id/sign', isAuthenticated, async (req: any, res) => {
    try {
      const petitionId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if already signed
      const existing = await db.execute(sql`
        SELECT id FROM petition_signatures 
        WHERE petition_id = ${petitionId} AND user_id = ${userId}
      `);

      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "Already signed this petition" });
      }

      // Add signature
      await db.execute(sql`
        INSERT INTO petition_signatures (petition_id, user_id, signed_date)
        VALUES (${petitionId}, ${userId}, NOW())
      `);

      // Update petition count
      await db.execute(sql`
        UPDATE petitions 
        SET current_signatures = current_signatures + 1
        WHERE id = ${petitionId}
      `);

      res.json({ message: "Petition signed successfully" });
    } catch (error) {
      console.error("Error signing petition:", error);
      res.status(500).json({ message: "Failed to sign petition" });
    }
  });

  // AI Chat endpoint
  app.post('/api/civic/chat', async (req, res) => {
    try {
      const { query, region } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      const response = await civicAI.processQuery({
        query,
        region: region || 'canada'
      });

      res.json(response);
    } catch (error) {
      console.error("Error processing civic AI query:", error);
      res.status(500).json({ message: "Failed to process query" });
    }
  });

  // News routes
  app.get('/api/news', async (req, res) => {
    try {
      const news = await db.execute(sql`
        SELECT * FROM news_articles 
        ORDER BY published_at DESC 
        LIMIT 50
      `);
      res.json(news.rows);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/comprehensive', async (req, res) => {
    try {
      const analytics = await comprehensiveAnalytics.generateComprehensiveAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Monitoring routes
  app.get('/api/monitoring/health', async (req, res) => {
    try {
      const health = await realTimeMonitoring.collectMetrics();
      res.json(health);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}