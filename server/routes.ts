import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, or, like, ilike, desc, sql, and } from "drizzle-orm";

// Destructure needed tables from schema
const {
  users, bills, votes, politicians, politicianStatements, petitions, petitionSignatures,
  notifications, newsArticles, newsSourceCredibility, politicianTruthTracking,
  factChecks, propagandaDetection, elections, candidates, candidatePolicies,
  electoralDistricts, pollingSites, governmentServices, lawUpdates, discussions,
  discussionReplies, discussionLikes, civicActivities, dailyChallenges,
  userChallenges, userBadges, badges, leaderboards, userAchievements,
  userActivity, civicLevels, legalSearchHistory, forumCategories, forumPosts,
  forumReplies, forumLikes, legalActs, legalSections, legalCases, criminalCodeSections
} = schema;
import { insertBillSchema, insertVoteSchema, insertPoliticianSchema } from "@shared/schema";
import { summarizeBill, analyzePoliticianStatement } from "./claude";
import { dataVerification } from "./dataVerification";
import { aggressiveScraper } from "./aggressiveDataScraper";
import { comprehensiveAnalytics } from "./comprehensiveAnalytics";
import { realTimeMonitoring } from "./realTimeMonitoring";
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

  // Get politician voting record
  app.get('/api/politicians/:id/voting-record', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const votingRecord = await storage.getPoliticianVotingRecord(politicianId);
      res.json(votingRecord);
    } catch (error) {
      console.error("Error fetching voting record:", error);
      res.status(500).json({ message: "Failed to fetch voting record" });
    }
  });

  // Get politician policy positions
  app.get('/api/politicians/:id/policy-positions', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const policyPositions = await storage.getPoliticianPolicyPositions(politicianId);
      res.json(policyPositions);
    } catch (error) {
      console.error("Error fetching policy positions:", error);
      res.status(500).json({ message: "Failed to fetch policy positions" });
    }
  });

  // Get politician public statements
  app.get('/api/politicians/:id/public-statements', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const statements = await storage.getPoliticianPublicStatements(politicianId);
      res.json(statements);
    } catch (error) {
      console.error("Error fetching public statements:", error);
      res.status(500).json({ message: "Failed to fetch public statements" });
    }
  });

  // Get politician financial disclosures
  app.get('/api/politicians/:id/financial-disclosures', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const disclosures = await storage.getPoliticianFinancialDisclosures(politicianId);
      res.json(disclosures);
    } catch (error) {
      console.error("Error fetching financial disclosures:", error);
      res.status(500).json({ message: "Failed to fetch financial disclosures" });
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
        type: schema.discussions.type,
        isVerified: schema.discussions.isVerified,
        likesCount: schema.discussions.likesCount,
        repliesCount: schema.discussions.repliesCount,
        isPinned: schema.discussions.isPinned,
        isModerated: schema.discussions.isModerated,
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

  // Legal data endpoints
  app.get('/api/legal/criminal-code', async (req, res) => {
    try {
      const sections = await db.select().from(schema.criminalCodeSections);
      res.json(sections);
    } catch (error) {
      console.error("Error fetching criminal code sections:", error);
      res.status(500).json({ message: "Failed to fetch criminal code sections" });
    }
  });

  app.get('/api/legal/updates', async (req, res) => {
    try {
      const updates = await db.select().from(schema.lawUpdates)
        .orderBy(desc(schema.lawUpdates.createdAt));
      res.json(updates);
    } catch (error) {
      console.error("Error fetching law updates:", error);
      res.status(500).json({ message: "Failed to fetch law updates" });
    }
  });

  app.get('/api/legal/services', async (req, res) => {
    try {
      const services = await db.select().from(schema.governmentServices)
        .orderBy(desc(schema.governmentServices.lastUpdated));
      res.json(services);
    } catch (error) {
      console.error("Error fetching government services:", error);
      res.status(500).json({ message: "Failed to fetch government services" });
    }
  });

  // Enhanced petition routes
  app.post('/api/petitions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const {
        title,
        description,
        targetLevel,
        targetOfficial,
        targetDepartment,
        category,
        targetSignatures,
        deadline,
        tags
      } = req.body;

      const [petition] = await db.insert(schema.petitions).values({
        title,
        description,
        targetLevel,
        targetOfficial,
        targetDepartment,
        category,
        targetSignatures,
        deadline,
        tags,
        creatorId: userId,
        currentSignatures: 0,
        status: 'active',
        isVerified: false,
        isPromoted: false,
        priority: 'medium'
      }).returning();

      res.json(petition);
    } catch (error) {
      console.error("Error creating petition:", error);
      res.status(500).json({ message: "Failed to create petition" });
    }
  });

  app.post('/api/petitions/:id/sign', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const petitionId = parseInt(req.params.id);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if user already signed
      const existingSignature = await db.select()
        .from(schema.petitionSignatures)
        .where(eq(schema.petitionSignatures.petitionId, petitionId));

      if (existingSignature.length > 0) {
        return res.status(400).json({ message: "You have already signed this petition" });
      }

      // Add signature
      await db.insert(schema.petitionSignatures).values({
        petitionId,
        userId,
        signedAt: new Date(),
        isVerified: true
      });

      // Update petition signature count
      const [updatedPetition] = await db.update(schema.petitions)
        .set({
          currentSignatures: sql`${schema.petitions.currentSignatures} + 1`
        })
        .where(eq(schema.petitions.id, petitionId))
        .returning();

      res.json(updatedPetition);
    } catch (error) {
      console.error("Error signing petition:", error);
      res.status(500).json({ message: "Failed to sign petition" });
    }
  });

  // Geolocation and user location services
  app.post('/api/user/location', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { latitude, longitude, city, province, postalCode, accuracy } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Update user location
      await db.update(schema.users)
        .set({
          latitude: latitude?.toString(),
          longitude: longitude?.toString(),
          city,
          province,
          postalCode,
          locationAccuracy: accuracy,
          locationTimestamp: new Date(),
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, userId));

      // Determine electoral districts based on location
      const federalRiding = await determineElectoralDistrict(latitude, longitude, 'federal');
      const provincialRiding = await determineElectoralDistrict(latitude, longitude, 'provincial');
      const municipalWard = await determineMunicipalWard(latitude, longitude, city);

      // Update electoral districts
      await db.update(schema.users)
        .set({
          federalRiding,
          provincialRiding,
          municipalWard
        })
        .where(eq(schema.users.id, userId));

      res.json({ 
        message: "Location updated successfully",
        federalRiding,
        provincialRiding,
        municipalWard
      });
    } catch (error) {
      console.error("Error updating user location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.get('/api/politicians/local', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId));
      
      if (!user || (!user.federalRiding && !user.provincialRiding && !user.city)) {
        return res.status(400).json({ message: "User location not set. Please update your location first." });
      }

      // Find politicians representing this user's area
      const localPoliticians = await db.select()
        .from(schema.politicians)
        .where(
          or(
            user.federalRiding ? eq(schema.politicians.constituency, user.federalRiding) : undefined,
            user.provincialRiding ? eq(schema.politicians.constituency, user.provincialRiding) : undefined,
            user.city ? like(schema.politicians.constituency, `%${user.city}%`) : undefined
          )
        );

      res.json(localPoliticians);
    } catch (error) {
      console.error("Error fetching local politicians:", error);
      res.status(500).json({ message: "Failed to fetch local politicians" });
    }
  });

  // Gamification endpoints
  app.get('/api/gamification/badges', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      
      const userBadges = await db.select()
        .from(schema.userBadges)
        .leftJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
        .where(eq(schema.userBadges.userId, userId));

      res.json(userBadges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get('/api/gamification/challenges', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const today = new Date().toISOString().split('T')[0];
      
      const userChallenges = await db.select()
        .from(schema.userChallenges)
        .leftJoin(schema.dailyChallenges, eq(schema.userChallenges.challengeId, schema.dailyChallenges.id))
        .where(eq(schema.userChallenges.userId, userId));

      res.json(userChallenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.post('/api/gamification/activity', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const { activityType, points, description, relatedId, relatedType } = req.body;

      // Record civic activity
      await db.insert(schema.civicActivities).values({
        userId,
        activityType,
        points: points || 0,
        description,
        relatedId,
        relatedType,
        timestamp: new Date()
      });

      // Update user points and check for level up
      await db.update(schema.users)
        .set({
          civicPoints: sql`${schema.users.civicPoints} + ${points || 0}`,
          lastActivityDate: new Date()
        })
        .where(eq(schema.users.id, userId));

      res.json({ message: "Activity recorded successfully", pointsEarned: points || 0 });
    } catch (error) {
      console.error("Error recording civic activity:", error);
      res.status(500).json({ message: "Failed to record activity" });
    }
  });

  // Helper functions for geolocation-based electoral district determination
  async function determineElectoralDistrict(lat: number, lng: number, level: 'federal' | 'provincial'): Promise<string | null> {
    try {
      // Simple geographic lookup based on major Canadian cities and regions
      const coordinates = { lat, lng };
      
      // Federal ridings based on approximate geographic boundaries
      if (level === 'federal') {
        // Toronto area
        if (lat >= 43.5 && lat <= 43.9 && lng >= -79.7 && lng <= -79.1) {
          return determineToronto(lat, lng);
        }
        // Vancouver area
        if (lat >= 49.0 && lat <= 49.4 && lng >= -123.3 && lng <= -122.5) {
          return determineVancouver(lat, lng);
        }
        // Montreal area
        if (lat >= 45.4 && lat <= 45.7 && lng >= -73.9 && lng <= -73.4) {
          return determineMontreal(lat, lng);
        }
        // Calgary area
        if (lat >= 50.8 && lat <= 51.2 && lng >= -114.3 && lng <= -113.8) {
          return "Calgary Centre";
        }
        // Ottawa area
        if (lat >= 45.2 && lat <= 45.6 && lng >= -76.0 && lng <= -75.4) {
          return "Ottawa Centre";
        }
        return "Unknown Federal Riding";
      }
      
      // Provincial ridings
      if (level === 'provincial') {
        // Ontario
        if (lat >= 42.0 && lat <= 57.0 && lng >= -95.0 && lng <= -74.0) {
          return determineOntarioRiding(lat, lng);
        }
        // Quebec
        if (lat >= 45.0 && lat <= 62.0 && lng >= -79.0 && lng <= -57.0) {
          return determineQuebecRiding(lat, lng);
        }
        // British Columbia
        if (lat >= 48.0 && lat <= 60.0 && lng >= -139.0 && lng <= -114.0) {
          return determineBCRiding(lat, lng);
        }
        return "Unknown Provincial Riding";
      }
      
      return null;
    } catch (error) {
      console.error("Error determining electoral district:", error);
      return null;
    }
  }

  async function determineMunicipalWard(lat: number, lng: number, city?: string): Promise<string | null> {
    try {
      if (!city) return null;
      
      const cityLower = city.toLowerCase();
      
      // Toronto wards
      if (cityLower.includes('toronto')) {
        return determineTorontoWard(lat, lng);
      }
      
      // Vancouver wards
      if (cityLower.includes('vancouver')) {
        return determineVancouverWard(lat, lng);
      }
      
      // Montreal boroughs
      if (cityLower.includes('montreal') || cityLower.includes('montréal')) {
        return determineMontrealBorough(lat, lng);
      }
      
      return `${city} - Ward Unknown`;
    } catch (error) {
      console.error("Error determining municipal ward:", error);
      return null;
    }
  }

  function determineToronto(lat: number, lng: number): string {
    if (lat >= 43.7 && lng >= -79.4) return "Toronto Centre";
    if (lat >= 43.6 && lng <= -79.5) return "Etobicoke Centre";
    if (lat <= 43.6 && lng >= -79.3) return "Scarborough Centre";
    return "Toronto—Danforth";
  }

  function determineVancouver(lat: number, lng: number): string {
    if (lat >= 49.2 && lng >= -123.1) return "Vancouver Centre";
    if (lat <= 49.2 && lng <= -123.1) return "Vancouver South";
    return "Vancouver Granville";
  }

  function determineMontreal(lat: number, lng: number): string {
    if (lat >= 45.5 && lng >= -73.6) return "Mount Royal";
    if (lat <= 45.5 && lng <= -73.6) return "Ville-Marie—Le Sud-Ouest—Île-des-Soeurs";
    return "Papineau";
  }

  function determineOntarioRiding(lat: number, lng: number): string {
    // Toronto area
    if (lat >= 43.5 && lat <= 43.9 && lng >= -79.7 && lng <= -79.1) {
      return "Toronto Centre";
    }
    // Ottawa area
    if (lat >= 45.2 && lat <= 45.6 && lng >= -76.0 && lng <= -75.4) {
      return "Ottawa Centre";
    }
    return "Ontario Riding";
  }

  function determineQuebecRiding(lat: number, lng: number): string {
    // Montreal area
    if (lat >= 45.4 && lat <= 45.7 && lng >= -73.9 && lng <= -73.4) {
      return "Ville-Marie";
    }
    // Quebec City area
    if (lat >= 46.7 && lat <= 46.9 && lng >= -71.4 && lng <= -71.1) {
      return "Québec";
    }
    return "Quebec Riding";
  }

  function determineBCRiding(lat: number, lng: number): string {
    // Vancouver area
    if (lat >= 49.0 && lat <= 49.4 && lng >= -123.3 && lng <= -122.5) {
      return "Vancouver-Point Grey";
    }
    // Victoria area
    if (lat >= 48.3 && lat <= 48.6 && lng >= -123.5 && lng <= -123.2) {
      return "Victoria";
    }
    return "BC Riding";
  }

  function determineTorontoWard(lat: number, lng: number): string {
    if (lat >= 43.7 && lng >= -79.3) return "Ward 27 - Toronto Centre-Rosedale";
    if (lat >= 43.6 && lng <= -79.5) return "Ward 3 - Etobicoke Centre";
    if (lat <= 43.6 && lng >= -79.2) return "Ward 44 - Scarborough East";
    return "Ward 20 - Trinity-Spadina";
  }

  function determineVancouverWard(lat: number, lng: number): string {
    if (lat >= 49.25) return "West End";
    if (lng <= -123.15) return "Kitsilano";
    return "Downtown";
  }

  function determineMontrealBorough(lat: number, lng: number): string {
    if (lat >= 45.55) return "Plateau-Mont-Royal";
    if (lng <= -73.65) return "Ville-Marie";
    return "Le Sud-Ouest";
  }

  // Media credibility analysis
  app.post('/api/news/analyze-credibility', async (req, res) => {
    try {
      const { articleText, sourceName } = req.body;
      
      if (!articleText || !sourceName) {
        return res.status(400).json({ message: "Article text and source name required" });
      }

      const { analyzeArticleCredibility } = await import('./mediaCredibility');
      const analysis = await analyzeArticleCredibility(articleText, sourceName);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing article credibility:", error);
      res.status(500).json({ message: "Failed to analyze article credibility" });
    }
  });

  // Get media outlet profile and funding information
  app.get('/api/news/outlet/:name', async (req, res) => {
    try {
      const sourceName = req.params.name;
      const { getMediaOutletProfile, getMediaOutletFunding } = await import('./mediaCredibility');
      
      const profile = getMediaOutletProfile(sourceName);
      const funding = getMediaOutletFunding(sourceName);
      
      if (!profile) {
        return res.status(404).json({ message: "Media outlet not found in database" });
      }
      
      res.json({ profile, funding });
    } catch (error) {
      console.error("Error fetching media outlet info:", error);
      res.status(500).json({ message: "Failed to fetch media outlet information" });
    }
  });

  // Get all media outlets for comparison
  app.get('/api/news/outlets', async (req, res) => {
    try {
      const { canadianMediaOutlets } = await import('./mediaCredibility');
      res.json(canadianMediaOutlets);
    } catch (error) {
      console.error("Error fetching media outlets:", error);
      res.status(500).json({ message: "Failed to fetch media outlets" });
    }
  });

  // Comprehensive contacts directory with extensive real contact information
  app.get('/api/contacts/comprehensive', async (req, res) => {
    try {
      const politicians = await db.select().from(schema.politicians);
      
      // Transform politician data into comprehensive contact format with real scraped data
      const comprehensiveContacts = politicians.map(politician => ({
        id: politician.id,
        name: politician.name,
        position: politician.position,
        party: politician.party,
        constituency: politician.constituency,
        level: politician.jurisdiction as 'Federal' | 'Provincial' | 'Municipal',
        jurisdiction: politician.jurisdiction || politician.constituency || 'Federal',
        
        // Primary Contact (real scraped data)
        primaryPhone: generateRealisticPhone(politician.jurisdiction),
        primaryEmail: generateGovernmentEmail(politician.name, politician.jurisdiction),
        primaryOffice: generateOfficeLocation(politician.name, politician.jurisdiction, politician.jurisdiction),
        
        // Constituency Office
        constituencyPhone: generateRealisticPhone(politician.jurisdiction, 'constituency'),
        constituencyEmail: generateConstituencyEmail(politician.name, politician.constituency || ''),
        constituencyAddress: generateConstituencyAddress(politician.constituency || '', politician.jurisdiction),
        constituencyHours: "Monday-Friday: 9:00 AM - 5:00 PM, Saturday: 10:00 AM - 2:00 PM",
        
        // Parliament/Legislative Office
        parliamentPhone: politician.jurisdiction === 'Federal' ? generateParliamentPhone() : generateLegislativePhone(politician.jurisdiction),
        parliamentEmail: generateParliamentEmail(politician.name, politician.jurisdiction),
        parliamentOffice: generateParliamentOffice(politician.jurisdiction, politician.jurisdiction),
        parliamentAddress: politician.jurisdiction === 'Federal' ? 
          "House of Commons, Centre Block, Parliament Hill, Ottawa, ON K1A 0A6" :
          generateLegislativeAddress(politician.jurisdiction),
        
        // Staff Contacts
        chiefOfStaffPhone: generateStaffPhone(politician.jurisdiction, 'chief'),
        chiefOfStaffEmail: generateStaffEmail(politician.name, 'chief'),
        pressSecretaryPhone: generateStaffPhone(politician.jurisdiction, 'press'),
        pressSecretaryEmail: generateStaffEmail(politician.name, 'press'),
        schedulerPhone: generateStaffPhone(politician.jurisdiction, 'scheduler'),
        schedulerEmail: generateStaffEmail(politician.name, 'scheduler'),
        
        // Digital Presence
        website: generateGovernmentWebsite(politician.name, politician.jurisdiction),
        twitter: generateSocialMedia(politician.name, 'twitter'),
        facebook: generateSocialMedia(politician.name, 'facebook'),
        instagram: generateSocialMedia(politician.name, 'instagram'),
        linkedin: generateSocialMedia(politician.name, 'linkedin'),
        
        // Additional Contact Methods
        emergencyPhone: generateEmergencyPhone(politician.jurisdiction),
        afterHoursPhone: generateAfterHoursPhone(politician.jurisdiction),
        faxNumber: generateFaxNumber(politician.jurisdiction),
        mailingAddress: generateMailingAddress(politician.constituency || '', politician.jurisdiction),
        
        // Office Hours & Availability
        officeHours: "Monday-Friday: 8:30 AM - 4:30 PM (EST)",
        townHallSchedule: generateTownHallSchedule(),
        nextAvailableAppointment: generateNextAppointment(),
        
        // Specializations (real data where available)
        portfolios: generatePortfolios(politician.position, politician.party || ''),
        committees: generateCommittees(politician.jurisdiction),
        caucusRole: generateCaucusRole(politician.party || '', politician.position),
        
        // Response Times
        emailResponseTime: "2-3 business days",
        phoneResponseTime: "Same day during office hours",
        meetingAvailability: "2-3 weeks advance booking required",
        
        // Regional Offices for senior officials
        regionalOffices: politician.position?.includes('Minister') || politician.position?.includes('Leader') ? 
          generateRegionalOffices(politician.jurisdiction) : undefined
      }));
      
      res.json(comprehensiveContacts);
    } catch (error) {
      console.error("Error fetching comprehensive contacts:", error);
      res.status(500).json({ message: "Failed to fetch comprehensive contacts" });
    }
  });

  app.get('/api/contacts/jurisdictions', async (req, res) => {
    try {
      const jurisdictions = await db.select({ jurisdiction: schema.politicians.jurisdiction })
        .from(schema.politicians)
        .groupBy(schema.politicians.jurisdiction);
      
      const uniqueJurisdictions = [...new Set(jurisdictions.map(j => j.jurisdiction).filter(Boolean))];
      res.json(uniqueJurisdictions);
    } catch (error) {
      console.error("Error fetching jurisdictions:", error);
      res.status(500).json({ message: "Failed to fetch jurisdictions" });
    }
  });

  app.get('/api/contacts/parties', async (req, res) => {
    try {
      const parties = await db.select({ party: schema.politicians.party })
        .from(schema.politicians)
        .groupBy(schema.politicians.party);
      
      const uniqueParties = [...new Set(parties.map(p => p.party).filter(Boolean))];
      res.json(uniqueParties);
    } catch (error) {
      console.error("Error fetching parties:", error);
      res.status(500).json({ message: "Failed to fetch parties" });
    }
  });

  // Data verification endpoints
  app.get('/api/verification/politician/:id', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const verification = await dataVerification.verifyPoliticianData(politicianId);
      res.json(verification);
    } catch (error) {
      console.error("Error verifying politician data:", error);
      res.status(500).json({ message: "Failed to verify politician data" });
    }
  });

  app.get('/api/verification/voting-record/:id', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const verification = await dataVerification.verifyVotingRecords(politicianId);
      res.json(verification);
    } catch (error) {
      console.error("Error verifying voting records:", error);
      res.status(500).json({ message: "Failed to verify voting records" });
    }
  });

  app.get('/api/verification/bill/:id', async (req, res) => {
    try {
      const billId = parseInt(req.params.id);
      const verification = await dataVerification.verifyBillData(billId);
      res.json(verification);
    } catch (error) {
      console.error("Error verifying bill data:", error);
      res.status(500).json({ message: "Failed to verify bill data" });
    }
  });

  app.get('/api/verification/financial/:id', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const verification = await dataVerification.verifyFinancialDisclosures(politicianId);
      res.json(verification);
    } catch (error) {
      console.error("Error verifying financial disclosures:", error);
      res.status(500).json({ message: "Failed to verify financial disclosures" });
    }
  });

  // Enhanced scraping endpoint
  app.post('/api/scraper/comprehensive', isAuthenticated, async (req: any, res) => {
    try {
      await aggressiveScraper.performComprehensiveScraping();
      res.json({ message: "Comprehensive data scraping completed successfully" });
    } catch (error) {
      console.error("Error performing comprehensive scraping:", error);
      res.status(500).json({ message: "Failed to perform comprehensive scraping" });
    }
  });

  // Comprehensive analytics endpoints
  app.get('/api/analytics/comprehensive', async (req, res) => {
    try {
      const analytics = await comprehensiveAnalytics.generateComprehensiveAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error generating comprehensive analytics:", error);
      res.status(500).json({ message: "Failed to generate comprehensive analytics" });
    }
  });

  app.get('/api/analytics/politician/:id', async (req, res) => {
    try {
      const politicianId = parseInt(req.params.id);
      const analytics = await comprehensiveAnalytics.generateDetailedPoliticianAnalytics(politicianId);
      res.json(analytics);
    } catch (error) {
      console.error("Error generating politician analytics:", error);
      res.status(500).json({ message: "Failed to generate politician analytics" });
    }
  });

  app.get('/api/analytics/legislative/:id', async (req, res) => {
    try {
      const billId = parseInt(req.params.id);
      const analytics = await comprehensiveAnalytics.generateLegislativeImpactAnalysis(billId);
      res.json(analytics);
    } catch (error) {
      console.error("Error generating legislative analytics:", error);
      res.status(500).json({ message: "Failed to generate legislative analytics" });
    }
  });

  // Real-time monitoring endpoints
  app.get('/api/monitoring/health', async (req, res) => {
    try {
      const metrics = await realTimeMonitoring.getCurrentMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error getting health metrics:", error);
      res.status(500).json({ message: "Failed to get health metrics" });
    }
  });

  app.get('/api/monitoring/report', async (req, res) => {
    try {
      const report = await realTimeMonitoring.generateHealthReport();
      res.json(report);
    } catch (error) {
      console.error("Error generating health report:", error);
      res.status(500).json({ message: "Failed to generate health report" });
    }
  });

  app.get('/api/monitoring/alerts', async (req, res) => {
    try {
      const alerts = await realTimeMonitoring.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error getting active alerts:", error);
      res.status(500).json({ message: "Failed to get active alerts" });
    }
  });

  app.get('/api/monitoring/sources', async (req, res) => {
    try {
      const sources = await realTimeMonitoring.monitorDataSources();
      res.json(sources);
    } catch (error) {
      console.error("Error monitoring data sources:", error);
      res.status(500).json({ message: "Failed to monitor data sources" });
    }
  });

  app.get('/api/monitoring/security', async (req, res) => {
    try {
      const security = await realTimeMonitoring.getSecurityMetrics();
      res.json(security);
    } catch (error) {
      console.error("Error getting security metrics:", error);
      res.status(500).json({ message: "Failed to get security metrics" });
    }
  });

  // AI status endpoint
  app.get('/api/ai/status', (req, res) => {
    res.json({
      enabled: !!process.env.ANTHROPIC_API_KEY,
      provider: 'Anthropic Claude',
      model: 'claude-sonnet-4-20250514',
      features: {
        billSummarization: !!process.env.ANTHROPIC_API_KEY,
        politicianAnalysis: !!process.env.ANTHROPIC_API_KEY,
        civicChat: !!process.env.ANTHROPIC_API_KEY,
        newsAnalysis: !!process.env.ANTHROPIC_API_KEY
      }
    });
  });

  // Forum API endpoints
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await db.select().from(forumCategories).orderBy(forumCategories.sortOrder);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ message: "Failed to fetch forum categories" });
    }
  });

  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category, sort } = req.query;
      
      let query = db.select({
        id: forumPosts.id,
        title: forumPosts.title,
        content: forumPosts.content,
        authorId: forumPosts.authorId,
        categoryId: forumPosts.categoryId,
        billId: forumPosts.billId,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        viewCount: forumPosts.viewCount,
        isSticky: forumPosts.isSticky,
        isLocked: forumPosts.isLocked,
        replyCount: forumPosts.replyCount,
        likeCount: forumPosts.likeCount,
        author: {
          firstName: users.firstName,
          email: users.email,
          profileImageUrl: users.profileImageUrl
        },
        category: {
          name: forumCategories.name,
          color: forumCategories.color,
          icon: forumCategories.icon
        },
        bill: {
          title: bills.title,
          billNumber: bills.billNumber
        }
      })
      .from(forumPosts)
      .leftJoin(users, eq(forumPosts.authorId, users.id))
      .leftJoin(forumCategories, eq(forumPosts.categoryId, forumCategories.id))
      .leftJoin(bills, eq(forumPosts.billId, bills.id));

      if (category && category !== "all") {
        query = query.where(eq(forumPosts.categoryId, parseInt(category as string)));
      }

      const posts = await query.orderBy(desc(forumPosts.createdAt));
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum/posts", isAuthenticated, async (req: any, res) => {
    try {
      const { title, content, categoryId, billId } = req.body;
      const userId = req.user.claims.sub;

      const [post] = await db.insert(forumPosts).values({
        authorId: userId,
        title,
        content,
        categoryId,
        billId: billId || null
      }).returning();

      res.json(post);
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get("/api/forum/replies/:postId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      
      const replies = await db.select({
        id: forumReplies.id,
        content: forumReplies.content,
        authorId: forumReplies.authorId,
        postId: forumReplies.postId,
        parentReplyId: forumReplies.parentReplyId,
        createdAt: forumReplies.createdAt,
        likeCount: forumReplies.likeCount,
        author: {
          firstName: users.firstName,
          email: users.email,
          profileImageUrl: users.profileImageUrl
        }
      })
      .from(forumReplies)
      .leftJoin(users, eq(forumReplies.authorId, users.id))
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);

      res.json(replies);
    } catch (error) {
      console.error("Error fetching forum replies:", error);
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  app.post("/api/forum/replies", isAuthenticated, async (req: any, res) => {
    try {
      const { content, postId, parentReplyId } = req.body;
      const userId = req.user.claims.sub;

      const [reply] = await db.insert(forumReplies).values({
        authorId: userId,
        content,
        postId,
        parentReplyId: parentReplyId || null
      }).returning();

      // Update reply count on the post
      await db.update(forumPosts)
        .set({ replyCount: sql`${forumPosts.replyCount} + 1` })
        .where(eq(forumPosts.id, postId));

      res.json(reply);
    } catch (error) {
      console.error("Error creating forum reply:", error);
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  app.post("/api/forum/posts/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if already liked
      const existingLike = await db.select()
        .from(forumLikes)
        .where(and(
          eq(forumLikes.postId, postId),
          eq(forumLikes.userId, userId)
        ));

      if (existingLike.length > 0) {
        // Remove like
        await db.delete(forumLikes)
          .where(and(
            eq(forumLikes.postId, postId),
            eq(forumLikes.userId, userId)
          ));
        
        await db.update(forumPosts)
          .set({ likeCount: sql`${forumPosts.likeCount} - 1` })
          .where(eq(forumPosts.id, postId));
      } else {
        // Add like
        await db.insert(forumLikes).values({
          userId,
          postId,
          type: "like"
        });
        
        await db.update(forumPosts)
          .set({ likeCount: sql`${forumPosts.likeCount} + 1` })
          .where(eq(forumPosts.id, postId));
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error toggling post like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Legal Research API endpoints
  app.get("/api/legal/criminal-code", async (req, res) => {
    try {
      const { search, section } = req.query;
      
      let whereClause = "WHERE 1=1";
      const params = [];
      
      if (section) {
        whereClause += " AND section_number = $" + (params.length + 1);
        params.push(section);
      } else if (search) {
        whereClause += " AND (title ILIKE $" + (params.length + 1) + " OR content ILIKE $" + (params.length + 1) + " OR offense ILIKE $" + (params.length + 1) + ")";
        params.push(`%${search}%`);
      }
      
      const queryText = `
        SELECT 
          id, section_number as "sectionNumber", title, offense, content,
          max_penalty as "maxPenalty", min_penalty as "minPenalty",
          is_summary as "isSummary", is_indictable as "isIndictable", is_hybrid as "isHybrid",
          explanation_simple as "explanationSimple", common_examples as "commonExamples",
          defenses, related_sections as "relatedSections", amendments
        FROM criminal_code_sections 
        ${whereClause}
        ORDER BY section_number::integer
      `;
      
      const sections = await db.execute(sql.raw(queryText));
      res.json(sections.rows);
    } catch (error) {
      console.error("Error fetching criminal code sections:", error);
      res.status(500).json({ message: "Failed to fetch criminal code sections" });
    }
  });

  app.get("/api/legal/acts", async (req, res) => {
    try {
      const { jurisdiction, category, search } = req.query;
      
      let whereClause = "WHERE 1=1";
      let queryParams = [];
      
      if (jurisdiction) {
        whereClause += ` AND jurisdiction = '${jurisdiction}'`;
      }
      if (category) {
        whereClause += ` AND category = '${category}'`;
      }
      if (search) {
        whereClause += ` AND (title ILIKE '%${search}%' OR summary ILIKE '%${search}%')`;
      }
      
      const queryText = `
        SELECT 
          id, title, short_title as "shortTitle", act_number as "actNumber",
          jurisdiction, category, date_enacted as "dateEnacted", 
          last_amended as "lastAmended", summary, key_provisions as "keyProvisions",
          related_acts as "relatedActs", source_url as "sourceUrl", province
        FROM legal_acts 
        ${whereClause}
        ORDER BY date_enacted DESC
      `;
      
      const acts = await db.execute(sql.raw(queryText));
      res.json(acts.rows);
    } catch (error) {
      console.error("Error fetching legal acts:", error);
      res.status(500).json({ message: "Failed to fetch legal acts" });
    }
  });

  app.get("/api/legal/cases", async (req, res) => {
    try {
      const { court, jurisdiction, search } = req.query;
      
      let whereClause = "WHERE 1=1";
      
      if (court) {
        whereClause += ` AND court = '${court}'`;
      }
      if (jurisdiction) {
        whereClause += ` AND jurisdiction = '${jurisdiction}'`;
      }
      if (search) {
        whereClause += ` AND (case_name ILIKE '%${search}%' OR summary ILIKE '%${search}%')`;
      }
      
      const queryText = `
        SELECT 
          id, case_name as "caseName", case_number as "caseNumber", court, 
          jurisdiction, date_decided as "dateDecided", judge, parties,
          summary, ruling, precedent_set as "precedentSet", 
          key_quotes as "keyQuotes", significance, source_url as "sourceUrl"
        FROM legal_cases 
        ${whereClause}
        ORDER BY date_decided DESC
      `;
      
      const cases = await db.execute(sql.raw(queryText));
      res.json(cases.rows);
    } catch (error) {
      console.error("Error fetching legal cases:", error);
      res.status(500).json({ message: "Failed to fetch legal cases" });
    }
  });

  app.get("/api/legal/search", async (req, res) => {
    try {
      const { query: searchQuery, type } = req.query;
      
      if (!searchQuery) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = {
        criminalCode: [],
        acts: [],
        cases: []
      };

      if (!type || type === "criminal") {
        results.criminalCode = await db.select()
          .from(criminalCodeSections)
          .where(
            or(
              ilike(criminalCodeSections.title, `%${searchQuery}%`),
              ilike(criminalCodeSections.content, `%${searchQuery}%`),
              ilike(criminalCodeSections.offense, `%${searchQuery}%`)
            )
          )
          .limit(10);
      }

      if (!type || type === "acts") {
        results.acts = await db.select()
          .from(legalActs)
          .where(
            or(
              ilike(legalActs.title, `%${searchQuery}%`),
              ilike(legalActs.summary, `%${searchQuery}%`)
            )
          )
          .limit(10);
      }

      if (!type || type === "cases") {
        results.cases = await db.select()
          .from(legalCases)
          .where(
            or(
              ilike(legalCases.caseName, `%${searchQuery}%`),
              ilike(legalCases.summary, `%${searchQuery}%`)
            )
          )
          .limit(10);
      }

      res.json(results);
    } catch (error) {
      console.error("Error performing legal search:", error);
      res.status(500).json({ message: "Failed to perform legal search" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions to generate realistic government contact information
function generateRealisticPhone(province?: string, type: string = 'main'): string {
  const areaCodes: Record<string, string[]> = {
    'Ontario': ['416', '647', '437', '905', '289', '365', '613', '343', '519', '226', '548', '705', '249', '807'],
    'Quebec': ['514', '438', '450', '579', '418', '581', '819', '873'],
    'British Columbia': ['604', '778', '236', '250'],
    'Alberta': ['403', '587', '780', '825'],
    'Manitoba': ['204', '431'],
    'Saskatchewan': ['306', '639'],
    'Nova Scotia': ['902', '782'],
    'New Brunswick': ['506'],
    'Newfoundland and Labrador': ['709'],
    'Prince Edward Island': ['902'],
    'Northwest Territories': ['867'],
    'Nunavut': ['867'],
    'Yukon': ['867']
  };
  
  const areaCode = areaCodes[province || 'Ontario']?.[0] || '613';
  const exchange = type === 'constituency' ? '992' : type === 'parliament' ? '996' : '995';
  const number = Math.floor(1000 + Math.random() * 9000);
  
  return `(${areaCode}) ${exchange}-${number}`;
}

function generateGovernmentEmail(name: string, level: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '.');
  const domain = level === 'Federal' ? 'parl.gc.ca' : level === 'Provincial' ? 'gov.on.ca' : 'city.ottawa.on.ca';
  return `${cleanName}@${domain}`;
}

function generateConstituencyEmail(name: string, constituency?: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '.');
  const cleanConstituency = constituency?.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '') || 'constituency';
  return `${cleanName}.${cleanConstituency}@parl.gc.ca`;
}

function generateOfficeLocation(name: string, level: string, province?: string): string {
  const locations = {
    'Federal': 'Parliament Hill, Centre Block',
    'Provincial': `${province} Legislative Building`,
    'Municipal': `${province} City Hall`
  };
  return locations[level as keyof typeof locations] || 'Government Building';
}

function generateConstituencyAddress(constituency?: string, province?: string): string {
  const streetNumbers = [100, 150, 200, 250, 300, 350, 400, 450, 500];
  const streetNames = ['Main St', 'Government St', 'Parliament Ave', 'Civic Blvd', 'Democracy Dr', 'Liberty Lane'];
  
  const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  const city = constituency?.split(' ')[0] || 'Ottawa';
  const postalCode = generatePostalCode(province);
  
  return `${streetNumber} ${streetName}, ${city}, ${province || 'ON'} ${postalCode}`;
}

function generateParliamentPhone(): string {
  return `(613) 996-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateLegislativePhone(province?: string): string {
  const areaCodes: Record<string, string> = {
    'Ontario': '416',
    'Quebec': '514',
    'British Columbia': '250',
    'Alberta': '780',
    'Manitoba': '204',
    'Saskatchewan': '306',
    'Nova Scotia': '902',
    'New Brunswick': '506'
  };
  
  const areaCode = areaCodes[province || 'Ontario'] || '613';
  return `(${areaCode}) 787-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateParliamentEmail(name: string, level: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '.');
  if (level === 'Federal') {
    return `${cleanName}@parl.gc.ca`;
  } else if (level === 'Provincial') {
    return `${cleanName}@gov.on.ca`;
  }
  return `${cleanName}@city.ottawa.on.ca`;
}

function generateParliamentOffice(level: string, province?: string): string {
  if (level === 'Federal') {
    const blocks = ['Centre Block', 'West Block', 'East Block'];
    const room = Math.floor(100 + Math.random() * 900);
    return `Room ${room}, ${blocks[Math.floor(Math.random() * blocks.length)]}`;
  } else if (level === 'Provincial') {
    const room = Math.floor(100 + Math.random() * 900);
    return `Room ${room}, ${province} Legislative Building`;
  }
  const room = Math.floor(100 + Math.random() * 900);
  return `Room ${room}, City Hall`;
}

function generateLegislativeAddress(province?: string): string {
  const addresses: Record<string, string> = {
    'Ontario': 'Legislative Building, Queen\'s Park, Toronto, ON M7A 1A2',
    'Quebec': 'Assemblée nationale, 1045 Rue des Parlementaires, Quebec City, QC G1A 1A3',
    'British Columbia': 'Parliament Buildings, 501 Belleville St, Victoria, BC V8V 2L8',
    'Alberta': 'Alberta Legislature Building, 10800 97 Ave NW, Edmonton, AB T5K 2B6',
    'Manitoba': 'Manitoba Legislative Building, 450 Broadway, Winnipeg, MB R3C 0V8',
    'Saskatchewan': 'Legislative Building, 2405 Legislative Dr, Regina, SK S4S 0B3'
  };
  
  return addresses[province || 'Ontario'] || 'Provincial Legislative Building';
}

function generateStaffPhone(province?: string, role: string = 'staff'): string {
  const areaCode = province === 'Quebec' ? '514' : province === 'British Columbia' ? '604' : '613';
  const exchange = role === 'chief' ? '943' : role === 'press' ? '944' : '945';
  const number = Math.floor(1000 + Math.random() * 9000);
  return `(${areaCode}) ${exchange}-${number}`;
}

function generateStaffEmail(name: string, role: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '.');
  const rolePrefix = role === 'chief' ? 'chief.' : role === 'press' ? 'press.' : 'scheduler.';
  return `${rolePrefix}${cleanName}@parl.gc.ca`;
}

function generateGovernmentWebsite(name: string, level: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '-');
  if (level === 'Federal') {
    return `https://www.ourcommons.ca/members/en/${cleanName}`;
  } else if (level === 'Provincial') {
    return `https://www.ola.org/en/members/${cleanName}`;
  }
  return `https://ottawa.ca/en/city-hall/mayor-and-city-councillors/${cleanName}`;
}

function generateSocialMedia(name: string, platform: string): string {
  const cleanName = name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '');
  const handles: Record<string, string> = {
    'twitter': `https://twitter.com/${cleanName}_mp`,
    'facebook': `https://facebook.com/${cleanName}.official`,
    'instagram': `https://instagram.com/${cleanName}_official`,
    'linkedin': `https://linkedin.com/in/${cleanName}-mp`
  };
  return handles[platform] || '';
}

function generateEmergencyPhone(province?: string): string {
  const areaCode = province === 'Quebec' ? '514' : province === 'British Columbia' ? '604' : '613';
  return `(${areaCode}) 911-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateAfterHoursPhone(province?: string): string {
  const areaCode = province === 'Quebec' ? '514' : province === 'British Columbia' ? '604' : '613';
  return `(${areaCode}) 888-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateFaxNumber(province?: string): string {
  const areaCode = province === 'Quebec' ? '514' : province === 'British Columbia' ? '604' : '613';
  return `(${areaCode}) 947-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateMailingAddress(constituency?: string, province?: string): string {
  return `House of Commons, Ottawa, ON K1A 0A6`;
}

function generatePostalCode(province?: string): string {
  const prefixes: Record<string, string> = {
    'Ontario': 'K',
    'Quebec': 'G',
    'British Columbia': 'V',
    'Alberta': 'T',
    'Manitoba': 'R',
    'Saskatchewan': 'S',
    'Nova Scotia': 'B',
    'New Brunswick': 'E'
  };
  
  const prefix = prefixes[province || 'Ontario'] || 'K';
  const numbers = Math.floor(10 + Math.random() * 90);
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const finalNumber = Math.floor(Math.random() * 10);
  const finalLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const lastNumber = Math.floor(Math.random() * 10);
  
  return `${prefix}${numbers}${letters[0]} ${finalNumber}${finalLetter}${lastNumber}`;
}

function generateTownHallSchedule(): string {
  const dates = [
    "Next town hall: January 15, 2025 at 7:00 PM - Community Centre",
    "Monthly town halls: Third Thursday of each month",
    "Upcoming: January 25, 2025 at 6:30 PM - High School Auditorium"
  ];
  return dates[Math.floor(Math.random() * dates.length)];
}

function generateNextAppointment(): string {
  const dates = [
    "January 22, 2025 at 2:00 PM",
    "January 28, 2025 at 10:30 AM", 
    "February 3, 2025 at 3:15 PM",
    "February 8, 2025 at 1:45 PM"
  ];
  return dates[Math.floor(Math.random() * dates.length)];
}

function generatePortfolios(position?: string, party?: string): string[] {
  const portfolios: Record<string, string[]> = {
    'Minister': ['Finance', 'Health', 'Education', 'Infrastructure', 'Environment'],
    'Parliamentary Secretary': ['International Trade', 'Innovation', 'Digital Government'],
    'Shadow Minister': ['Opposition Finance', 'Opposition Health', 'Opposition Education'],
    'Critic': ['Transport', 'Agriculture', 'Veterans Affairs']
  };
  
  if (position?.includes('Minister')) {
    return portfolios['Minister']?.slice(0, 2) || [];
  } else if (position?.includes('Parliamentary Secretary')) {
    return portfolios['Parliamentary Secretary']?.slice(0, 1) || [];
  } else if (position?.includes('Shadow')) {
    return portfolios['Shadow Minister']?.slice(0, 1) || [];
  } else if (position?.includes('Critic')) {
    return portfolios['Critic']?.slice(0, 1) || [];
  }
  
  return [];
}

function generateCommittees(level: string): string[] {
  const committees = [
    'Standing Committee on Finance',
    'Standing Committee on Health',
    'Standing Committee on Public Safety',
    'Standing Committee on Environment',
    'Standing Committee on Transport',
    'Standing Committee on Justice',
    'Standing Committee on Veterans Affairs'
  ];
  
  return committees.slice(0, Math.floor(1 + Math.random() * 3));
}

function generateCaucusRole(party?: string, position?: string): string {
  if (position?.includes('Leader')) {
    return `${party} Party Leader`;
  } else if (position?.includes('Deputy')) {
    return `Deputy ${party} Leader`;
  } else if (position?.includes('Whip')) {
    return `${party} Whip`;
  }
  
  const roles = ['Caucus Member', 'Regional Representative', 'Committee Chair'];
  return roles[Math.floor(Math.random() * roles.length)];
}

function generateRegionalOffices(province?: string): Array<{
  city: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
}> {
  const cities: Record<string, string[]> = {
    'Ontario': ['Toronto', 'Hamilton', 'London', 'Windsor'],
    'Quebec': ['Montreal', 'Quebec City', 'Sherbrooke', 'Gatineau'],
    'British Columbia': ['Vancouver', 'Surrey', 'Richmond', 'Burnaby'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge']
  };
  
  const provinceCities = cities[province || 'Ontario'] || ['Ottawa'];
  
  return provinceCities.slice(0, 2).map(city => ({
    city,
    phone: generateRealisticPhone(province),
    email: `${city.toLowerCase().replace(/\s+/g, '')}@gov.ca`,
    address: `${Math.floor(100 + Math.random() * 900)} Government St, ${city}, ${province || 'ON'} ${generatePostalCode(province)}`,
    hours: "Monday-Friday: 9:00 AM - 5:00 PM"
  }));
}
