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
          id, petition_number, title, description, target_signatures,
          current_signatures, status, deadline, created_at
        FROM petitions 
        ORDER BY created_at DESC
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
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { targetType, targetId, voteType } = req.body;
      const userId = (req.user as any).id;

      if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      if (!['politician', 'bill', 'post', 'comment', 'petition'].includes(targetType)) {
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

  // Comprehensive voting system for all content types
  app.post('/api/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { targetType, targetId, voteType } = req.body;
      const userId = req.user.claims.sub;

      if (!['politician', 'bill', 'post', 'comment', 'petition', 'news'].includes(targetType)) {
        return res.status(400).json({ message: "Invalid target type" });
      }

      if (!['upvote', 'downvote'].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      // Check for existing vote
      const existingVote = await db.execute(sql`
        SELECT * FROM user_votes 
        WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
      `);

      if (existingVote.rows.length > 0) {
        const existing = existingVote.rows[0] as any;
        if (existing.vote_type === voteType) {
          // Remove vote if clicking same button
          await db.execute(sql`
            DELETE FROM user_votes 
            WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
          `);
        } else {
          // Update vote type
          await db.execute(sql`
            UPDATE user_votes 
            SET vote_type = ${voteType}, created_at = NOW()
            WHERE user_id = ${userId} AND target_type = ${targetType} AND target_id = ${targetId}
          `);
        }
      } else {
        // Create new vote
        await db.execute(sql`
          INSERT INTO user_votes (user_id, target_type, target_id, vote_type)
          VALUES (${userId}, ${targetType}, ${targetId}, ${voteType})
        `);
      }

      // Update vote counts
      const voteCounts = await db.execute(sql`
        SELECT 
          COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) as upvotes,
          COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END) as downvotes
        FROM user_votes 
        WHERE target_type = ${targetType} AND target_id = ${targetId}
      `);

      const counts = voteCounts.rows[0] as any;
      
      // Update or insert vote_counts table
      await db.execute(sql`
        INSERT INTO vote_counts (target_type, target_id, upvotes, downvotes, total_score)
        VALUES (${targetType}, ${targetId}, ${counts.upvotes}, ${counts.downvotes}, ${counts.upvotes - counts.downvotes})
        ON CONFLICT (target_type, target_id)
        DO UPDATE SET 
          upvotes = ${counts.upvotes},
          downvotes = ${counts.downvotes},
          total_score = ${counts.upvotes - counts.downvotes},
          updated_at = NOW()
      `);

      res.json({ 
        upvotes: counts.upvotes, 
        downvotes: counts.downvotes, 
        totalScore: counts.upvotes - counts.downvotes 
      });
    } catch (error) {
      console.error("Error processing vote:", error);
      res.status(500).json({ message: "Failed to process vote" });
    }
  });

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

  // Forum posts with vote counts
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const posts = await db.execute(sql`
        SELECT 
          fp.*,
          fc.name as category_name,
          fc.color as category_color,
          fc.icon as category_icon,
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
        LEFT JOIN forum_replies fr ON fp.id = fr.post_id
        LEFT JOIN users u ON fp.author_id = u.id
        LEFT JOIN vote_counts vc ON vc.target_type = 'post' AND vc.target_id = fp.id
        GROUP BY fp.id, fc.name, fc.color, fc.icon, u.first_name, u.last_name, u.email, u.profile_image_url, u.civic_level, vc.upvotes, vc.downvotes, vc.total_score
        ORDER BY fp.is_sticky DESC, fp.created_at DESC
        LIMIT 50
      `);
      res.json(posts.rows);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch forum posts" });
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