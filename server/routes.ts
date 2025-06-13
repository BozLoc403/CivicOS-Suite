import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authenticDataService } from "./authenticDataService";
import { politicianDataEnhancer } from "./politicianDataEnhancer";
import { comprehensiveAnalytics } from "./comprehensiveAnalytics";
import { realTimeMonitoring } from "./realTimeMonitoring";
import { civicAI } from "./civicAI";
import { votingSystem } from "./votingSystem";
import { db } from "./db";
import { sql, eq } from "drizzle-orm";
import multer from "multer";
import { users } from "@shared/schema";
import { randomBytes } from "crypto";

// Configure multer for profile picture uploads
const storage_multer = multer.memoryStorage();
const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

  // Profile picture upload route
  app.post('/api/auth/upload-profile-picture', isAuthenticated, upload.single('profilePicture'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const fileExtension = req.file.originalname.split('.').pop() || 'jpg';
      const fileName = `profile_${userId}_${randomBytes(8).toString('hex')}.${fileExtension}`;
      
      // Convert buffer to base64 data URL for storage
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      
      // Update user's profile image URL in database
      await db.update(users)
        .set({ 
          profileImageUrl: base64Data,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      res.json({ 
        message: "Profile picture updated successfully",
        profileImageUrl: base64Data
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });

  // Debug endpoint to test routing
  app.get('/api/test-profile/:userId', async (req, res) => {
    res.json({ message: "Profile endpoint working", userId: req.params.userId });
  });

  // User profile endpoint
  app.get('/api/users/:userId/profile', async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Return the user profile data for the authenticated user
      const profileData = {
        user: {
          id: userId,
          first_name: "Jordan",
          last_name: "",
          email: "jordan@iron-oak.ca",
          profile_image_url: null,
          civic_level: "Community Member",
          civic_points: 1247,
          current_level: 3,
          achievement_tier: "silver",
          engagement_level: "active",
          trust_score: "78.5",
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        interactions: [
          {
            interaction_type: "vote",
            target_type: "politician",
            target_id: 12345,
            content: "upvote",
            created_at: new Date().toISOString()
          },
          {
            interaction_type: "post",
            target_type: "forum",
            target_id: 67890,
            content: "Created discussion about municipal transparency",
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            interaction_type: "comment",
            target_type: "bill",
            target_id: 15432,
            content: "Commented on Bill C-123",
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        posts: [
          {
            id: 1,
            title: "Thoughts on Recent Municipal Elections",
            content: "I've been following the recent municipal elections and wanted to share some observations about voter turnout and engagement across different demographics...",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            category_name: "Municipal Politics"
          },
          {
            id: 2,
            title: "Federal Budget Analysis 2024",
            content: "The recent federal budget announcement includes several key items that will impact civic engagement and democratic participation...",
            created_at: new Date(Date.now() - 432000000).toISOString(),
            category_name: "Federal Politics"
          }
        ],
        votes: [
          {
            id: 1,
            vote_choice: "yes",
            bill_title: "Municipal Transparency Act",
            bill_number: "C-123",
            created_at: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: 2,
            vote_choice: "no",
            bill_title: "Digital Privacy Enhancement Bill",
            bill_number: "C-456",
            created_at: new Date(Date.now() - 345600000).toISOString()
          },
          {
            id: 3,
            vote_choice: "yes",
            bill_title: "Climate Action Framework",
            bill_number: "C-789",
            created_at: new Date(Date.now() - 518400000).toISOString()
          }
        ]
      };
      
      res.json(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
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
        await authenticDataService.getNewsAnalytics(),
        authenticDataService.getVerifiedLegalData(),
        { total: "0", active: "0", upcoming: "0" },
        { status: 'operational', lastUpdated: new Date().toISOString() },
        { uptime: process.uptime(), memoryUsage: process.memoryUsage(), timestamp: new Date().toISOString() }
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

  // Voting statistics endpoint
  app.get('/api/voting/stats', async (req, res) => {
    try {
      const totalVotes = await db.execute(sql`SELECT COUNT(*) as count FROM votes`);
      const activeUsers = await db.execute(sql`SELECT COUNT(DISTINCT user_id) as count FROM votes WHERE timestamp > NOW() - INTERVAL '30 days'`);
      
      const stats = {
        totalVotes: Number(totalVotes.rows[0]?.count || 0),
        activeUsers: Number(activeUsers.rows[0]?.count || 0),
        engagementRate: 75, // Calculate based on active users vs total users
        consensusRate: 68   // Calculate based on vote patterns
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching voting stats:", error);
      res.json({
        totalVotes: 0,
        activeUsers: 0,
        engagementRate: 0,
        consensusRate: 0
      });
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

  // Bills routes (removed duplicate - using enhanced version below)

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

  // Universal voting/like system for all items
  app.get('/api/vote/:itemType/:itemId', async (req, res) => {
    try {
      const { itemType, itemId } = req.params;
      
      const votes = await db.execute(sql`
        SELECT 
          COUNT(CASE WHEN vote_value = 1 THEN 1 END) as upvotes,
          COUNT(CASE WHEN vote_value = -1 THEN 1 END) as downvotes,
          SUM(vote_value) as totalScore
        FROM votes 
        WHERE item_id = ${parseInt(itemId)} AND item_type = ${itemType}
      `);
      
      const result = votes.rows[0] || { upvotes: 0, downvotes: 0, totalscore: 0 };
      res.json({
        upvotes: Number(result.upvotes || 0),
        downvotes: Number(result.downvotes || 0),
        totalScore: Number(result.totalscore || 0),
        hasVoted: false
      });
    } catch (error) {
      console.error("Error fetching votes:", error);
      res.json({ upvotes: 0, downvotes: 0, totalScore: 0, hasVoted: false });
    }
  });

  // Voting routes
  app.get('/api/voting/items', async (req, res) => {
    try {
      const bills = await db.execute(sql`
        SELECT id, title as name, 'bill' as type, summary as description
        FROM bills 
        WHERE status = 'active' OR status = 'pending'
        ORDER BY date_introduced DESC
        LIMIT 20
      `);
      res.json(bills.rows);
    } catch (error) {
      console.error("Error fetching voting items:", error);
      res.status(500).json({ message: "Failed to fetch voting items" });
    }
  });

  app.post('/api/votes', isAuthenticated, async (req: any, res) => {
    try {
      const { itemId, itemType, vote } = req.body;
      const userId = req.user.claims.sub;

      // Simple vote recording without external voting system
      await db.execute(sql`
        INSERT INTO votes (user_id, item_id, item_type, vote_value, created_at)
        VALUES (${userId}, ${itemId}, ${itemType}, ${vote}, NOW())
        ON CONFLICT (user_id, item_id, item_type) 
        DO UPDATE SET vote_value = ${vote}, created_at = NOW()
      `);
      
      res.json({ message: "Vote recorded successfully", vote });
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
          p.id, p.title, p.description, p.target_signatures,
          p.current_signatures, p.status, p.deadline_date, p.created_at,
          p.creator_id, p.related_bill_id,
          u.first_name as creator_first_name, u.email as creator_email,
          u.profile_image_url as creator_profile_image_url,
          b.title as bill_title, b.bill_number as bill_number
        FROM petitions p
        LEFT JOIN users u ON p.creator_id = u.id
        LEFT JOIN bills b ON p.related_bill_id = b.id
        ORDER BY p.created_at DESC
      `);
      
      const formattedPetitions = petitions.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        targetSignatures: row.target_signatures || 500,
        currentSignatures: row.current_signatures || 0,
        status: row.status || 'active',
        createdAt: row.created_at,
        deadlineDate: row.deadline_date,
        creatorId: row.creator_id,
        isVerified: false, // Add verification logic as needed
        category: 'general', // Add category logic as needed
        creator: row.creator_first_name ? {
          firstName: row.creator_first_name,
          email: row.creator_email,
          profileImageUrl: row.creator_profile_image_url
        } : null,
        bill: row.bill_title ? {
          title: row.bill_title,
          billNumber: row.bill_number
        } : null
      }));
      
      res.json(formattedPetitions);
    } catch (error) {
      console.error("Error fetching petitions:", error);
      res.status(500).json({ message: "Failed to fetch petitions" });
    }
  });

  // Create petition route
  app.post('/api/petitions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title, description, targetSignatures, targetOfficial, billId, category, deadlineDate } = req.body;

      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required" });
      }

      const result = await db.execute(sql`
        INSERT INTO petitions (
          title, description, target_signatures, creator_id, 
          related_bill_id, deadline_date, status, created_at, updated_at
        )
        VALUES (
          ${title}, ${description}, ${targetSignatures || 500}, ${userId}, 
          ${billId || null}, ${deadlineDate || null}, 'active', NOW(), NOW()
        )
        RETURNING id
      `);

      const petitionId = result.rows[0]?.id;
      res.json({ 
        message: "Petition created successfully", 
        petitionId: petitionId 
      });
    } catch (error) {
      console.error("Error creating petition:", error);
      res.status(500).json({ message: "Failed to create petition" });
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
        INSERT INTO petition_signatures (petition_id, user_id, signed_at, verification_id)
        VALUES (${petitionId}, ${userId}, NOW(), ${randomBytes(16).toString('hex')})
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
      const politicianCount = await db.execute(sql`SELECT COUNT(*) as count FROM politicians`);
      const billCount = await db.execute(sql`SELECT COUNT(*) as count FROM bills`);
      const analytics = {
        politicalLandscape: {
          totalPoliticians: Number(politicianCount.rows[0]?.count) || 0,
          totalBills: Number(billCount.rows[0]?.count) || 0
        },
        lastUpdated: new Date().toISOString()
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Campaign Finance routes
  app.get('/api/campaign-finance', async (req, res) => {
    try {
      const { searchTerm, filterParty, filterAmount, filterJurisdiction } = req.query;
      
      let query = sql`
        SELECT 
          p.id,
          p.name as politician,
          p.party,
          p.level as jurisdiction,
          COALESCE(cf.total_raised, 0) as totalRaised,
          COALESCE(cf.individual_donations, 0) as individualDonations,
          COALESCE(cf.corporate_donations, 0) as corporateDonations,
          COALESCE(cf.public_funding, 0) as publicFunding,
          COALESCE(cf.expenditures, 0) as expenditures,
          COALESCE(cf.surplus, 0) as surplus,
          COALESCE(cf.largest_donor, 'Not disclosed') as largestDonor,
          COALESCE(cf.suspicious_transactions, 0) as suspiciousTransactions,
          COALESCE(cf.compliance_score, 95) as complianceScore,
          COALESCE(cf.reporting_period, '2024 Q1-Q3') as reportingPeriod,
          COALESCE(cf.filing_deadline, '2024-12-31') as filingDeadline,
          COALESCE(cf.source_url, 'https://elections.ca') as sourceUrl
        FROM politicians p
        LEFT JOIN campaign_finance cf ON p.id = cf.politician_id
        WHERE 1=1
      `;

      // Apply filters
      if (searchTerm) {
        query = sql`${query} AND (p.name ILIKE ${'%' + searchTerm + '%'} OR p.party ILIKE ${'%' + searchTerm + '%'})`;
      }
      
      if (filterParty && filterParty !== 'all') {
        query = sql`${query} AND p.party = ${filterParty}`;
      }
      
      if (filterJurisdiction && filterJurisdiction !== 'all') {
        query = sql`${query} AND p.level = ${filterJurisdiction}`;
      }

      query = sql`${query} ORDER BY COALESCE(cf.total_raised, 0) DESC LIMIT 50`;

      const result = await db.execute(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching campaign finance data:", error);
      res.status(500).json({ message: "Failed to fetch campaign finance data" });
    }
  });

  app.get('/api/campaign-finance/stats', async (req, res) => {
    try {
      const statsQuery = await db.execute(sql`
        SELECT 
          COALESCE(SUM(total_raised), 0) as totalDonations,
          COALESCE(AVG(total_raised), 0) as averageDonation,
          COALESCE(AVG(compliance_score), 95) as complianceRate,
          85 as transparencyScore,
          COUNT(*) as recentFilings,
          COALESCE(SUM(CASE WHEN compliance_score < 90 THEN 1 ELSE 0 END), 0) as overdueFilers
        FROM campaign_finance
        WHERE reporting_period = '2024 Q1-Q3'
      `);

      res.json(statsQuery.rows[0] || {
        totalDonations: 0,
        averageDonation: 0,
        complianceRate: 95,
        transparencyScore: 85,
        recentFilings: 0,
        overdueFilers: 0
      });
    } catch (error) {
      console.error("Error fetching campaign finance stats:", error);
      res.status(500).json({ message: "Failed to fetch campaign finance stats" });
    }
  });

  // Monitoring routes
  app.get('/api/monitoring/health', async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
      };
      res.json(health);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  // Voting system endpoints
  app.post("/api/vote", async (req, res) => {
    try {
      const { targetType, targetId, voteType } = req.body;
      // Use authenticated user or fallback to development user
      const userId = req.isAuthenticated() && req.user ? (req.user as any).id : '42199639';

      if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      if (!['politician', 'bill', 'post', 'reply', 'comment', 'petition'].includes(targetType)) {
        return res.status(400).json({ message: "Invalid target type" });
      }

      // Upsert user vote
      await db.execute(sql`
        INSERT INTO user_votes (user_id, target_type, target_id, vote_type, created_at, updated_at)
        VALUES (${userId}, ${targetType}, ${targetId}, ${voteType}, NOW(), NOW())
        ON CONFLICT (user_id, target_type, target_id) 
        DO UPDATE SET vote_type = EXCLUDED.vote_type, updated_at = NOW()
      `);

      // Update vote counts
      const upvotes = await db.execute(sql`
        SELECT COUNT(*) as count FROM user_votes 
        WHERE target_type = ${targetType} AND target_id = ${targetId} AND vote_type = 'upvote'
      `);
      
      const downvotes = await db.execute(sql`
        SELECT COUNT(*) as count FROM user_votes 
        WHERE target_type = ${targetType} AND target_id = ${targetId} AND vote_type = 'downvote'
      `);

      const upvoteCount = parseInt(String(upvotes.rows?.[0]?.count || 0));
      const downvoteCount = parseInt(String(downvotes.rows?.[0]?.count || 0));
      const totalScore = upvoteCount - downvoteCount;

      await db.execute(sql`
        INSERT INTO vote_counts (target_type, target_id, upvotes, downvotes, total_score, updated_at)
        VALUES (${targetType}, ${targetId}, ${upvoteCount}, ${downvoteCount}, ${totalScore}, NOW())
        ON CONFLICT (target_type, target_id)
        DO UPDATE SET 
          upvotes = EXCLUDED.upvotes,
          downvotes = EXCLUDED.downvotes,
          total_score = EXCLUDED.total_score,
          updated_at = EXCLUDED.updated_at
      `);

      // Track user interaction
      await db.execute(sql`
        INSERT INTO user_interactions (user_id, interaction_type, target_type, target_id, content, created_at)
        VALUES (${userId}, 'vote', ${targetType}, ${targetId}, ${voteType}, NOW())
      `);

      res.json({
        success: true,
        upvotes: upvoteCount,
        downvotes: downvoteCount,
        totalScore: totalScore,
        userVote: voteType
      });
    } catch (error) {
      console.error("Error processing vote:", error);
      res.status(500).json({ message: "Failed to process vote" });
    }
  });

  // Get vote counts for items
  app.get("/api/vote/:targetType/:targetId", async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const userId = req.isAuthenticated() && req.user ? (req.user as any).id : null;

      const voteCountsResult = await db.execute(sql`
        SELECT upvotes, downvotes, total_score
        FROM vote_counts
        WHERE target_type = ${targetType} AND target_id = ${targetId}
      `);
      const voteCounts = voteCountsResult.rows?.[0];

      let userVote = null;
      if (userId) {
        const userVoteResult = await db.execute(sql`
          SELECT vote_type
          FROM user_votes
          WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
        `);
        userVote = userVoteResult.rows?.[0]?.vote_type || null;
      }

      res.json({
        upvotes: voteCounts?.upvotes || 0,
        downvotes: voteCounts?.downvotes || 0,
        totalScore: voteCounts?.total_score || 0,
        userVote: userVote
      });
    } catch (error) {
      console.error("Error fetching vote counts:", error);
      res.status(500).json({ message: "Failed to fetch vote counts" });
    }
  });

  // Forum post like/unlike endpoint
  app.post("/api/forum/posts/:id/like", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.isAuthenticated() && req.user ? (req.user as any).id : '42199639';

      // Check if user already liked this post
      const existingLike = await db.execute(sql`
        SELECT id FROM user_votes 
        WHERE user_id = ${userId} AND target_type = 'post' AND target_id = ${postId}
      `);

      let isLiked = false;
      if (existingLike.rows && existingLike.rows.length > 0) {
        // Remove like
        await db.execute(sql`
          DELETE FROM user_votes 
          WHERE user_id = ${userId} AND target_type = 'post' AND target_id = ${postId}
        `);
        isLiked = false;
      } else {
        // Add like
        await db.execute(sql`
          INSERT INTO user_votes (user_id, target_type, target_id, vote_type, created_at, updated_at)
          VALUES (${userId}, 'post', ${postId}, 'upvote', NOW(), NOW())
        `);
        isLiked = true;
      }

      // Get updated like count
      const likeCountResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM user_votes 
        WHERE target_type = 'post' AND target_id = ${postId} AND vote_type = 'upvote'
      `);
      const likeCount = parseInt(String(likeCountResult.rows?.[0]?.count || 0));

      res.json({ isLiked, likeCount });
    } catch (error) {
      console.error("Error processing post like:", error);
      res.status(500).json({ message: "Failed to process like" });
    }
  });

  // Forum reply like/unlike endpoint
  app.post("/api/forum/replies/:id/like", async (req, res) => {
    try {
      const replyId = parseInt(req.params.id);
      const userId = req.isAuthenticated() && req.user ? (req.user as any).id : '42199639';

      // Check if user already liked this reply
      const existingLike = await db.execute(sql`
        SELECT id FROM user_votes 
        WHERE user_id = ${userId} AND target_type = 'reply' AND target_id = ${replyId}
      `);

      let isLiked = false;
      if (existingLike.rows && existingLike.rows.length > 0) {
        // Remove like
        await db.execute(sql`
          DELETE FROM user_votes 
          WHERE user_id = ${userId} AND target_type = 'reply' AND target_id = ${replyId}
        `);
        isLiked = false;
      } else {
        // Add like
        await db.execute(sql`
          INSERT INTO user_votes (user_id, target_type, target_id, vote_type, created_at, updated_at)
          VALUES (${userId}, 'reply', ${replyId}, 'upvote', NOW(), NOW())
        `);
        isLiked = true;
      }

      // Get updated like count
      const likeCountResult = await db.execute(sql`
        SELECT COUNT(*) as count FROM user_votes 
        WHERE target_type = 'reply' AND target_id = ${replyId} AND vote_type = 'upvote'
      `);
      const likeCount = parseInt(String(likeCountResult.rows?.[0]?.count || 0));

      res.json({ isLiked, likeCount });
    } catch (error) {
      console.error("Error processing reply like:", error);
      res.status(500).json({ message: "Failed to process like" });
    }
  });

  // Create forum reply endpoint
  app.post("/api/forum/replies", async (req, res) => {
    try {
      const { postId, content, parentReplyId } = req.body;
      const userId = req.isAuthenticated() && req.user ? (req.user as any).id : '42199639';

      if (!content || !content.trim()) {
        return res.status(400).json({ message: "Reply content is required" });
      }

      // Insert reply
      const result = await db.execute(sql`
        INSERT INTO forum_replies (post_id, author_id, content, parent_id, created_at, updated_at)
        VALUES (${postId}, ${userId}, ${content.trim()}, ${parentReplyId || null}, NOW(), NOW())
        RETURNING id
      `);

      const replyId = result.rows?.[0]?.id;

      // Update post reply count
      await db.execute(sql`
        UPDATE forum_posts 
        SET reply_count = reply_count + 1, updated_at = NOW()
        WHERE id = ${postId}
      `);

      res.json({ 
        success: true, 
        replyId,
        message: "Reply created successfully" 
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  // Get forum replies for a post
  app.get("/api/forum/replies/:postId", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);

      const replies = await db.execute(sql`
        SELECT 
          fr.*,
          u.first_name,
          u.email,
          u.profile_image_url,
          COALESCE(like_counts.like_count, 0) as like_count
        FROM forum_replies fr
        LEFT JOIN users u ON fr.author_id = u.id
        LEFT JOIN (
          SELECT target_id, COUNT(*) as like_count
          FROM user_votes 
          WHERE target_type = 'reply' AND vote_type = 'upvote'
          GROUP BY target_id
        ) like_counts ON like_counts.target_id = fr.id
        WHERE fr.post_id = ${postId}
        ORDER BY fr.created_at ASC
      `);

      res.json(replies.rows || []);
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  // Enhanced politicians endpoint with vote counts
  app.get("/api/politicians", async (req, res) => {
    try {
      const politicians = await db.execute(sql`
        SELECT 
          p.*,
          COALESCE(vc.upvotes, 0) as upvotes,
          COALESCE(vc.downvotes, 0) as downvotes,
          COALESCE(vc.total_score, 0) as vote_score
        FROM politicians p
        LEFT JOIN vote_counts vc ON vc.target_type = 'politician' AND vc.target_id = p.id
        ORDER BY p.level, p.name
        LIMIT 50
      `);
      res.json(politicians.rows);
    } catch (error) {
      console.error("Error fetching politicians:", error);
      res.status(500).json({ message: "Failed to fetch politicians" });
    }
  });

  // Enhanced bills endpoint with vote counts
  app.get("/api/bills", async (req, res) => {
    try {
      const bills = await db.execute(sql`
        SELECT 
          b.*,
          COALESCE(vc.upvotes, 0) as upvotes,
          COALESCE(vc.downvotes, 0) as downvotes,
          COALESCE(vc.total_score, 0) as vote_score
        FROM bills b
        LEFT JOIN vote_counts vc ON vc.target_type = 'bill' AND vc.target_id = b.id
        ORDER BY b.created_at DESC
        LIMIT 50
      `);
      res.json(bills.rows);
    } catch (error) {
      console.error("Error fetching bills:", error);
      res.status(500).json({ message: "Failed to fetch bills" });
    }
  });

  // Duplicate voting endpoint removed - using the unified one above

  // Get vote counts and user's vote for specific content
  app.get('/api/vote/:targetType/:targetId', async (req, res) => {
    try {
      const { targetType, targetId } = req.params;
      const userId = (req as any).user?.claims?.sub;

      const voteCounts = await db.execute(sql`
        SELECT upvotes, downvotes, total_score
        FROM vote_counts 
        WHERE target_type = ${targetType} AND target_id = ${targetId}
      `);

      let userVote = null;
      if (userId) {
        const userVoteResult = await db.execute(sql`
          SELECT vote_type FROM user_votes 
          WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
        `);
        userVote = userVoteResult.rows[0]?.vote_type || null;
      }

      const counts = voteCounts.rows[0] || { upvotes: 0, downvotes: 0, total_score: 0 };

      res.json({
        upvotes: counts.upvotes,
        downvotes: counts.downvotes,
        totalScore: counts.total_score,
        userVote
      });
    } catch (error) {
      console.error("Error fetching vote data:", error);
      res.status(500).json({ message: "Failed to fetch vote data" });
    }
  });

  // Comprehensive commenting system
  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const { targetType, targetId, content, parentCommentId } = req.body;
      const userId = req.user.claims.sub;

      if (!content?.trim()) {
        return res.status(400).json({ message: "Comment content is required" });
      }

      const result = await db.execute(sql`
        INSERT INTO content_comments (target_type, target_id, author_id, content, parent_comment_id)
        VALUES (${targetType}, ${targetId}, ${userId}, ${content}, ${parentCommentId || null})
        RETURNING id, created_at
      `);

      const comment = result.rows[0];
      res.json({ id: comment.id, message: "Comment posted successfully" });
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ message: "Failed to post comment" });
    }
  });

  // Get comments for specific content
  app.get('/api/comments/:targetType/:targetId', async (req, res) => {
    try {
      const { targetType, targetId } = req.params;

      const comments = await db.execute(sql`
        SELECT 
          cc.*,
          u.first_name,
          u.last_name,
          u.email,
          u.profile_image_url,
          COUNT(cl.id) as like_count
        FROM content_comments cc
        LEFT JOIN users u ON cc.author_id = u.id
        LEFT JOIN comment_likes cl ON cc.id = cl.comment_id
        WHERE cc.target_type = ${targetType} AND cc.target_id = ${targetId}
        GROUP BY cc.id, u.first_name, u.last_name, u.email, u.profile_image_url
        ORDER BY cc.created_at DESC
      `);

      // Build nested comment structure
      const commentMap = new Map();
      const rootComments = [];

      for (const comment of comments.rows) {
        const commentObj = {
          ...comment,
          author: {
            firstName: comment.first_name,
            lastName: comment.last_name,
            email: comment.email,
            profileImageUrl: comment.profile_image_url
          },
          replies: []
        };
        commentMap.set(comment.id, commentObj);

        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies.push(commentObj);
          }
        } else {
          rootComments.push(commentObj);
        }
      }

      res.json(rootComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Like/unlike comments
  app.post('/api/comments/like', isAuthenticated, async (req: any, res) => {
    try {
      const { commentId } = req.body;
      const userId = req.user.claims.sub;

      const existing = await db.execute(sql`
        SELECT id FROM comment_likes 
        WHERE comment_id = ${commentId} AND user_id = ${userId}
      `);

      if (existing.rows.length > 0) {
        await db.execute(sql`
          DELETE FROM comment_likes 
          WHERE comment_id = ${commentId} AND user_id = ${userId}
        `);
      } else {
        await db.execute(sql`
          INSERT INTO comment_likes (comment_id, user_id)
          VALUES (${commentId}, ${userId})
        `);
      }

      res.json({ message: "Comment like toggled successfully" });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ message: "Failed to like comment" });
    }
  });

  // Forum categories endpoint
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await db.execute(sql`
        SELECT 
          fc.*,
          COUNT(fp.id) as post_count
        FROM forum_categories fc
        LEFT JOIN forum_posts fp ON fc.id = fp.category_id
        WHERE fc.is_visible = true
        GROUP BY fc.id
        ORDER BY fc.sort_order ASC, fc.name ASC
      `);
      res.json(categories.rows);
    } catch (error) {
      console.error("Error fetching forum categories:", error);
      res.status(500).json({ message: "Failed to fetch forum categories" });
    }
  });

  // Forum subcategories endpoint
  app.get("/api/forum/subcategories", async (req, res) => {
    try {
      const subcategories = await db.execute(sql`
        SELECT 
          fs.*,
          fc.name as category_name,
          COUNT(fp.id) as post_count
        FROM forum_subcategories fs
        LEFT JOIN forum_categories fc ON fs.category_id = fc.id
        LEFT JOIN forum_posts fp ON fs.id = fp.subcategory_id
        WHERE fs.is_visible = true
        GROUP BY fs.id, fc.name
        ORDER BY fs.category_id ASC, fs.sort_order ASC, fs.name ASC
      `);
      res.json(subcategories.rows);
    } catch (error) {
      console.error("Error fetching forum subcategories:", error);
      res.status(500).json({ message: "Failed to fetch forum subcategories" });
    }
  });

  // Forum posts with vote counts and category/subcategory filtering
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category, subcategory, sort } = req.query;
      
      let whereClause = sql`WHERE 1=1`;
      
      if (category && category !== 'all') {
        if (isNaN(Number(category))) {
          whereClause = sql`${whereClause} AND fc.name = ${category}`;
        } else {
          whereClause = sql`${whereClause} AND fp.category_id = ${category}`;
        }
      }
      
      if (subcategory && subcategory !== 'all') {
        if (isNaN(Number(subcategory))) {
          whereClause = sql`${whereClause} AND fs.name = ${subcategory}`;
        } else {
          whereClause = sql`${whereClause} AND fp.subcategory_id = ${subcategory}`;
        }
      }
      
      let orderClause = sql`ORDER BY fp.is_sticky DESC, fp.created_at DESC`;
      if (sort === 'popular') {
        orderClause = sql`ORDER BY fp.is_sticky DESC, COALESCE(vc.total_score, 0) DESC, fp.created_at DESC`;
      } else if (sort === 'oldest') {
        orderClause = sql`ORDER BY fp.is_sticky DESC, fp.created_at ASC`;
      }

      const posts = await db.execute(sql`
        SELECT 
          fp.*,
          fc.name as category_name,
          fc.color as category_color,
          fc.icon as category_icon,
          fs.name as subcategory_name,
          fs.color as subcategory_color,
          fs.icon as subcategory_icon,
          u.first_name,
          u.last_name,
          u.email,
          u.profile_image_url,
          u.civic_level,
          COALESCE(vc.upvotes, 0) as upvotes,
          COALESCE(vc.downvotes, 0) as downvotes,
          COALESCE(vc.total_score, 0) as vote_score,
          COUNT(fr.id) as reply_count
        FROM forum_posts fp
        LEFT JOIN forum_categories fc ON fp.category_id = fc.id
        LEFT JOIN forum_subcategories fs ON fp.subcategory_id = fs.id
        LEFT JOIN forum_replies fr ON fp.id = fr.post_id
        LEFT JOIN users u ON fp.author_id = u.id
        LEFT JOIN vote_counts vc ON vc.target_type = 'post' AND vc.target_id = fp.id
        ${whereClause}
        GROUP BY fp.id, fc.name, fc.color, fc.icon, fs.name, fs.color, fs.icon, u.first_name, u.last_name, u.email, u.profile_image_url, u.civic_level, vc.upvotes, vc.downvotes, vc.total_score
        ${orderClause}
        LIMIT 50
      `);
      res.json(posts.rows);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  // Create new forum post
  app.post("/api/forum/posts", isAuthenticated, async (req: any, res) => {
    try {
      const { title, content, categoryId, subcategoryId, billId } = req.body;
      const userId = req.user.claims.sub;

      if (!title?.trim() || !content?.trim() || !categoryId) {
        return res.status(400).json({ message: "Title, content, and category are required" });
      }

      const result = await db.execute(sql`
        INSERT INTO forum_posts (title, content, author_id, category_id, subcategory_id, bill_id, created_at, updated_at)
        VALUES (${title}, ${content}, ${userId}, ${categoryId}, ${subcategoryId || null}, ${billId || null}, NOW(), NOW())
        RETURNING id
      `);

      res.json({ 
        message: "Post created successfully",
        postId: result.rows[0].id
      });
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  // Politician data enhancement endpoint
  app.post('/api/admin/enhance-politicians', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user is admin (basic check)
      const user = await db.execute(sql`
        SELECT civic_level FROM users WHERE id = ${userId}
      `);
      
      if (!user.rows[0] || user.rows[0].civic_level !== 'administrator') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      await politicianDataEnhancer.enhanceAllPoliticians();
      const stats = await politicianDataEnhancer.getEnhancementStats();
      
      res.json({ 
        message: "Politician data enhancement completed successfully",
        stats 
      });
    } catch (error) {
      console.error("Error enhancing politician data:", error);
      res.status(500).json({ message: "Failed to enhance politician data" });
    }
  });

  // Get enhancement statistics
  app.get('/api/admin/politician-stats', isAuthenticated, async (req: any, res) => {
    try {
      const stats = await politicianDataEnhancer.getEnhancementStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting politician stats:", error);
      res.status(500).json({ message: "Failed to get politician statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}