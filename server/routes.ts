import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBillSchema, insertVoteSchema, insertPoliticianSchema } from "@shared/schema";
import { summarizeBill, analyzePoliticianStatement } from "./claude";
import crypto from "crypto";

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

  // User profile update
  app.post('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { electoralDistrict, phoneNumber } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.upsertUser({
        ...user,
        electoralDistrict,
        phoneNumber,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Verify user identity (simplified for MVP)
  app.post('/api/user/verify', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.updateUserVerification(userId, true);
      res.json({ message: "User verified successfully" });
    } catch (error) {
      console.error("Error verifying user:", error);
      res.status(500).json({ message: "Failed to verify user" });
    }
  });

  // Get user stats
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Bills routes
  app.get('/api/bills', async (req, res) => {
    try {
      const bills = await storage.getActiveBills();
      res.json(bills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  app.get('/api/bills/:id', async (req, res) => {
    try {
      const billId = parseInt(req.params.id);
      const bill = await storage.getBill(billId);
      
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" });
      }

      const voteStats = await storage.getBillVoteStats(billId);
      res.json({ ...bill, voteStats });
    } catch (error) {
      console.error("Error fetching bill:", error);
      res.status(500).json({ message: "Failed to fetch bill" });
    }
  });

  app.post('/api/bills', isAuthenticated, async (req: any, res) => {
    try {
      const billData = insertBillSchema.parse(req.body);
      const bill = await storage.createBill(billData);

      // Generate AI summary if full text is provided
      if (bill.fullText) {
        try {
          const summary = await summarizeBill(bill.fullText);
          await storage.updateBillSummary(bill.id, summary);
          bill.aiSummary = summary;
        } catch (aiError) {
          console.error("Error generating AI summary:", aiError);
        }
      }

      res.status(201).json(bill);
    } catch (error) {
      console.error("Error creating bill:", error);
      res.status(500).json({ message: "Failed to create bill" });
    }
  });

  // Voting routes
  app.post('/api/votes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const voteData = insertVoteSchema.parse(req.body);

      // Check if user already voted on this bill
      const existingVote = await storage.getVoteByUserAndBill(userId, voteData.billId);
      if (existingVote) {
        return res.status(400).json({ message: "You have already voted on this bill" });
      }

      // Generate verification ID and block hash
      const verificationId = `VR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      const blockHash = `0x${crypto.randomBytes(16).toString('hex')}`;

      const vote = await storage.createVote({
        ...voteData,
        userId,
        verificationId,
        blockHash,
      });

      res.status(201).json(vote);
    } catch (error) {
      console.error("Error creating vote:", error);
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  app.get('/api/votes/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const votes = await storage.getUserVotes(userId);
      res.json(votes);
    } catch (error) {
      console.error("Error fetching user votes:", error);
      res.status(500).json({ message: "Failed to fetch votes" });
    }
  });

  // Politicians routes
  app.get('/api/politicians', async (req, res) => {
    try {
      const politicians = await storage.getAllPoliticians();
      res.json(politicians);
    } catch (error) {
      console.error("Error fetching politicians:", error);
      res.status(500).json({ message: "Failed to fetch politicians" });
    }
  });

  app.get('/api/politicians/:id', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const politician = await storage.getPolitician(politicianId);
      
      if (!politician) {
        return res.status(404).json({ message: "Politician not found" });
      }

      const statements = await storage.getPoliticianStatements(politicianId);
      res.json({ ...politician, statements });
    } catch (error) {
      console.error("Error fetching politician:", error);
      res.status(500).json({ message: "Failed to fetch politician" });
    }
  });

  app.post('/api/politicians/:id/statements', isAuthenticated, async (req: any, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const { statement, context, source } = req.body;

      // Analyze statement for contradictions using AI
      let isContradiction = false;
      let contradictionDetails = null;

      try {
        const existingStatements = await storage.getPoliticianStatements(politicianId);
        const analysis = await analyzePoliticianStatement(statement, existingStatements);
        isContradiction = analysis.isContradiction;
        contradictionDetails = analysis.details;
      } catch (aiError) {
        console.error("Error analyzing statement:", aiError);
      }

      const newStatement = await storage.createPoliticianStatement({
        politicianId,
        statement,
        context,
        source,
        isContradiction,
        contradictionDetails,
      });

      res.status(201).json(newStatement);
    } catch (error) {
      console.error("Error creating statement:", error);
      res.status(500).json({ message: "Failed to create statement" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
