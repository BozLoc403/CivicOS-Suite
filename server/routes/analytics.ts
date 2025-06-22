import { Router } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

// Get comprehensive platform analytics
router.get("/stats", async (req, res) => {
  try {
    // User statistics
    const userStats = await db.execute(sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '1 day' THEN 1 END) as daily_signups,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as weekly_signups,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as monthly_signups,
        COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_users,
        AVG(trust_score) as avg_trust_score
      FROM users
    `);

    // Session statistics
    const sessionStats = await db.execute(sql`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT sid) as unique_sessions,
        COUNT(CASE WHEN expire >= NOW() THEN 1 END) as active_sessions
      FROM sessions
    `);

    // User activity over time (last 30 days)
    const dailyActivity = await db.execute(sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Verification level breakdown
    const verificationBreakdown = await db.execute(sql`
      SELECT 
        verification_level,
        COUNT(*) as count
      FROM users 
      GROUP BY verification_level
    `);

    // Trust score distribution
    const trustScoreDistribution = await db.execute(sql`
      SELECT 
        CASE 
          WHEN trust_score >= 90 THEN 'Excellent (90-100)'
          WHEN trust_score >= 70 THEN 'Good (70-89)'
          WHEN trust_score >= 50 THEN 'Average (50-69)'
          WHEN trust_score >= 30 THEN 'Low (30-49)'
          ELSE 'Very Low (0-29)'
        END as trust_range,
        COUNT(*) as count
      FROM users 
      GROUP BY trust_range
      ORDER BY MIN(trust_score) DESC
    `);

    res.json({
      userStats: userStats.rows[0],
      sessionStats: sessionStats.rows[0],
      dailyActivity: dailyActivity.rows,
      verificationBreakdown: verificationBreakdown.rows,
      trustScoreDistribution: trustScoreDistribution.rows,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

// Get detailed user activity
router.get("/users", async (req, res) => {
  try {
    const users = await db.execute(sql`
      SELECT 
        id,
        email,
        first_name,
        created_at,
        is_verified,
        trust_score,
        verification_level,
        civic_engagement_score
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 100
    `);

    res.json(users.rows);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Get engagement metrics
router.get("/engagement", async (req, res) => {
  try {
    // Voting activity
    const votingStats = await db.execute(sql`
      SELECT 
        COUNT(*) as total_votes,
        COUNT(DISTINCT user_id) as unique_voters,
        COUNT(CASE WHEN vote_type = 'upvote' THEN 1 END) as upvotes,
        COUNT(CASE WHEN vote_type = 'downvote' THEN 1 END) as downvotes
      FROM user_votes
    `);

    // Petition signatures
    const petitionStats = await db.execute(sql`
      SELECT 
        COUNT(*) as total_signatures,
        COUNT(DISTINCT user_id) as unique_signers
      FROM petition_signatures
    `);

    // Most active users
    const activeUsers = await db.execute(sql`
      SELECT 
        u.email,
        u.trust_score,
        COUNT(uv.id) as vote_count
      FROM users u
      LEFT JOIN user_votes uv ON u.id = uv.user_id
      GROUP BY u.id, u.email, u.trust_score
      ORDER BY vote_count DESC
      LIMIT 10
    `);

    res.json({
      votingStats: votingStats.rows[0],
      petitionStats: petitionStats.rows[0],
      activeUsers: activeUsers.rows
    });
  } catch (error) {
    console.error("Error fetching engagement data:", error);
    res.status(500).json({ message: "Failed to fetch engagement data" });
  }
});

export default router;