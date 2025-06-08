import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, or, ilike, desc } from "drizzle-orm";
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
      const verificationId = `VR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const blockHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;

      const vote = await storage.createVote({
        billId: voteData.billId,
        voteValue: voteData.voteValue,
        reasoning: voteData.reasoning,
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

  // Petitions endpoints
  app.get("/api/petitions", async (req, res) => {
    try {
      const petitions = await storage.getAllPetitions();
      res.json(petitions);
    } catch (error) {
      console.error("Error fetching petitions:", error);
      res.status(500).json({ message: "Failed to fetch petitions" });
    }
  });

  app.post("/api/petitions/:id/sign", isAuthenticated, async (req: any, res) => {
    try {
      const petitionId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user already signed
      const existingSignature = await storage.getPetitionSignature(petitionId, userId);
      if (existingSignature) {
        return res.status(400).json({ message: "You have already signed this petition" });
      }
      
      // Create signature with verification
      const verificationId = `petition_${petitionId}_${userId}_${Date.now()}`;
      const signature = await storage.signPetition(petitionId, userId, verificationId);
      
      // Check if petition reached target and notify
      await storage.checkPetitionTarget(petitionId);
      
      res.json({ message: "Petition signed successfully", signature });
    } catch (error) {
      console.error("Error signing petition:", error);
      res.status(500).json({ message: "Failed to sign petition" });
    }
  });

  // Enhanced voting endpoint with petition threshold checking
  app.post("/api/votes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const voteData = insertVoteSchema.parse(req.body);
      
      // Check if user already voted on this bill
      const existingVote = await storage.getVoteByUserAndBill(userId, voteData.billId);
      if (existingVote) {
        return res.status(400).json({ message: "You have already voted on this bill" });
      }
      
      // Create verification ID and block hash for vote integrity
      const verificationId = `vote_${userId}_${voteData.billId}_${Date.now()}`;
      const blockHash = `block_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const vote = await storage.createVote({
        ...voteData,
        userId,
        verificationId,
        blockHash,
      });
      
      // Check if votes against this bill have reached petition threshold (500 "no" votes)
      await checkVotePetitionThreshold(voteData.billId);
      
      res.json(vote);
    } catch (error) {
      console.error("Error creating vote:", error);
      res.status(500).json({ message: "Failed to create vote" });
    }
  });

  // AI Chat routes
  app.post('/api/ai/chat', isAuthenticated, async (req, res) => {
    try {
      const { query, region, conversationHistory } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }

      const { civicAI } = await import('./civicAI');
      const response = await civicAI.processQuery({
        query,
        region,
        conversationHistory
      });

      res.json(response);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ 
        message: "AI analysis failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Function to check vote thresholds and auto-create petitions
  async function checkVotePetitionThreshold(billId: number) {
    try {
      const bill = await storage.getBill(billId);
      if (!bill) return;
      
      const voteStats = await storage.getBillVoteStats(billId);
      const PETITION_THRESHOLD = 500; // Canadian e-petition minimum
      
      // Check if "no" votes meet petition threshold
      if (voteStats.no >= PETITION_THRESHOLD) {
        // Check if auto-petition already exists for this bill
        const existingPetition = await storage.getAutoPetitionForBill(billId);
        if (existingPetition) return;
        
        // Create automatic petition
        const petitionTitle = `Petition Against Bill ${bill.billNumber}: ${bill.title}`;
        const petitionDescription = `This petition was automatically created when ${PETITION_THRESHOLD} citizens voted against Bill ${bill.billNumber}. 
        
Bill Summary: ${bill.description || 'No description available'}

We, the undersigned citizens, respectfully petition Parliament to reconsider this legislation based on the overwhelming citizen opposition demonstrated through the democratic voting process.

The legislation in question affects ${bill.category || 'various aspects of Canadian society'} and has received significant citizen opposition. We request that MPs carefully review the concerns raised by their constituents.`;

        // Use first opposing voter as creator (system user)
        const systemUserId = "system_auto_petition";
        
        const autoPetition = await storage.createPetition({
          title: petitionTitle,
          description: petitionDescription,
          relatedBillId: billId,
          creatorId: systemUserId,
          targetSignatures: PETITION_THRESHOLD,
          currentSignatures: 0,
          status: "active",
          autoCreated: true,
          voteThresholdMet: new Date(),
          deadlineDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days deadline
        });
        
        // Create notification for all users who voted "no"
        await storage.notifyVotersOfAutoPetition(billId, autoPetition.id);
        
        console.log(`Auto-petition created for Bill ${bill.billNumber} after ${voteStats.no} opposing votes`);
      }
    } catch (error) {
      console.error("Error checking vote petition threshold:", error);
    }
  }

  // Elections and candidates routes
  app.get('/api/elections', async (req, res) => {
    try {
      const elections = await db.select().from(schema.elections).orderBy(schema.elections.electionDate);
      res.json(elections);
    } catch (error) {
      console.error("Error fetching elections:", error);
      res.status(500).json({ message: "Failed to fetch elections" });
    }
  });

  app.get('/api/candidates', async (req, res) => {
    try {
      const { search, electionType } = req.query;
      let query = db.select({
        id: schema.candidates.id,
        electionId: schema.candidates.electionId,
        name: schema.candidates.name,
        party: schema.candidates.party,
        constituency: schema.candidates.constituency,
        biography: schema.candidates.biography,
        website: schema.candidates.website,
        email: schema.candidates.email,
        phoneNumber: schema.candidates.phoneNumber,
        campaignWebsite: schema.candidates.campaignWebsite,
        socialMediaTwitter: schema.candidates.socialMediaTwitter,
        socialMediaFacebook: schema.candidates.socialMediaFacebook,
        socialMediaInstagram: schema.candidates.socialMediaInstagram,
        occupation: schema.candidates.occupation,
        education: schema.candidates.education,
        previousExperience: schema.candidates.previousExperience,
        keyPlatformPoints: schema.candidates.keyPlatformPoints,
        campaignPromises: schema.candidates.campaignPromises,
        votesReceived: schema.candidates.votesReceived,
        votePercentage: schema.candidates.votePercentage,
        isIncumbent: schema.candidates.isIncumbent,
        isElected: schema.candidates.isElected,
        endorsements: schema.candidates.endorsements,
        financialDisclosure: schema.candidates.financialDisclosure,
        createdAt: schema.candidates.createdAt,
        election: {
          electionName: schema.elections.electionName,
          electionType: schema.elections.electionType,
          electionDate: schema.elections.electionDate,
        }
      }).from(schema.candidates).innerJoin(schema.elections, eq(schema.candidates.electionId, schema.elections.id));

      if (search) {
        query = query.where(
          or(
            ilike(schema.candidates.name, `%${search}%`),
            ilike(schema.candidates.party, `%${search}%`),
            ilike(schema.candidates.constituency, `%${search}%`)
          )
        );
      }

      if (electionType && electionType !== 'all') {
        query = query.where(eq(schema.elections.electionType, electionType as string));
      }

      const candidates = await query.orderBy(schema.candidates.name);
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.get('/api/electoral-districts', async (req, res) => {
    try {
      const districts = await db.select().from(schema.electoralDistricts).orderBy(schema.electoralDistricts.province, schema.electoralDistricts.districtName);
      res.json(districts);
    } catch (error) {
      console.error("Error fetching electoral districts:", error);
      res.status(500).json({ message: "Failed to fetch electoral districts" });
    }
  });

  app.get('/api/candidate-policies', async (req, res) => {
    try {
      const { candidateId } = req.query;
      let query = db.select().from(schema.candidatePolicies);
      
      if (candidateId) {
        query = query.where(eq(schema.candidatePolicies.candidateId, parseInt(candidateId as string)));
      }
      
      const policies = await query.orderBy(schema.candidatePolicies.policyArea, schema.candidatePolicies.priority);
      res.json(policies);
    } catch (error) {
      console.error("Error fetching candidate policies:", error);
      res.status(500).json({ message: "Failed to fetch candidate policies" });
    }
  });

  // Discussions routes
  app.get('/api/discussions', async (req, res) => {
    try {
      const discussions = await db.select({
        id: schema.discussions.id,
        userId: schema.discussions.userId,
        title: schema.discussions.title,
        content: schema.discussions.content,
        category: schema.discussions.category,
        isVerificationRequired: schema.discussions.isVerificationRequired,
        likeCount: schema.discussions.likeCount,
        replyCount: schema.discussions.replyCount,
        isPinned: schema.discussions.isPinned,
        isLocked: schema.discussions.isLocked,
        createdAt: schema.discussions.createdAt,
        user: {
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
        }
      }).from(schema.discussions).innerJoin(schema.users, eq(schema.discussions.userId, schema.users.id)).orderBy(desc(schema.discussions.createdAt));
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Failed to fetch discussions" });
    }
  });

  app.post('/api/discussions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { title, content, category, isVerificationRequired } = req.body;
      
      const [discussion] = await db.insert(schema.discussions).values({
        userId,
        title,
        content,
        category,
        isVerificationRequired: isVerificationRequired || false,
      }).returning();

      res.json(discussion);
    } catch (error) {
      console.error("Error creating discussion:", error);
      res.status(500).json({ message: "Failed to create discussion" });
    }
  });

  // Legal system routes
  app.get('/api/legal/updates', async (req, res) => {
    try {
      const updates = await db.select().from(schema.lawUpdates).orderBy(desc(schema.lawUpdates.effectiveDate));
      res.json(updates);
    } catch (error) {
      console.error("Error fetching law updates:", error);
      res.status(500).json({ message: "Failed to fetch law updates" });
    }
  });

  app.get('/api/legal/criminal-code', async (req, res) => {
    try {
      const sections = await db.select().from(schema.criminalCodeSections).orderBy(schema.criminalCodeSections.sectionNumber);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching criminal code sections:", error);
      res.status(500).json({ message: "Failed to fetch criminal code sections" });
    }
  });

  // Government services routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await db.select().from(schema.governmentServices).orderBy(schema.governmentServices.serviceName);
      res.json(services);
    } catch (error) {
      console.error("Error fetching government services:", error);
      res.status(500).json({ message: "Failed to fetch government services" });
    }
  });

  // News analysis and propaganda detection endpoints
  app.get('/api/news/articles', async (req, res) => {
    try {
      const articles = await db.select()
        .from(schema.newsArticles)
        .orderBy(desc(schema.newsArticles.publishedAt))
        .limit(50);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching news articles:", error);
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  app.get('/api/news/sources', async (req, res) => {
    try {
      const sources = await db.select()
        .from(schema.newsSourceCredibility)
        .orderBy(desc(schema.newsSourceCredibility.overallCredibility));
      res.json(sources);
    } catch (error) {
      console.error("Error fetching news sources:", error);
      res.status(500).json({ message: "Failed to fetch news sources" });
    }
  });

  app.get('/api/politicians/truthfulness', async (req, res) => {
    try {
      const truthfulness = await db.select()
        .from(schema.politicianTruthTracking)
        .leftJoin(schema.politicians, eq(schema.politicianTruthTracking.politicianId, schema.politicians.id))
        .orderBy(desc(schema.politicianTruthTracking.overallTruthScore));
      res.json(truthfulness);
    } catch (error) {
      console.error("Error fetching politician truthfulness:", error);
      res.status(500).json({ message: "Failed to fetch politician truthfulness" });
    }
  });

  app.get('/api/news/propaganda/:articleId', async (req, res) => {
    try {
      const articleId = parseInt(req.params.articleId);
      const propaganda = await db.select()
        .from(schema.propagandaDetection)
        .where(eq(schema.propagandaDetection.articleId, articleId));
      res.json(propaganda);
    } catch (error) {
      console.error("Error fetching propaganda analysis:", error);
      res.status(500).json({ message: "Failed to fetch propaganda analysis" });
    }
  });

  app.post('/api/news/analyze', isAuthenticated, async (req, res) => {
    try {
      const { runNewsAnalysis } = await import('./newsAnalyzer');
      await runNewsAnalysis();
      res.json({ message: "News analysis completed successfully" });
    } catch (error) {
      console.error("Error running news analysis:", error);
      res.status(500).json({ message: "Failed to run news analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
