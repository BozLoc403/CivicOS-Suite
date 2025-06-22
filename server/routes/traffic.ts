import { Router } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

// Track page views and visitor analytics
router.post("/track", async (req, res) => {
  try {
    const { 
      page, 
      userAgent, 
      referrer, 
      ipAddress, 
      sessionId,
      timestamp 
    } = req.body;

    // Create page views tracking table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255),
        user_agent TEXT,
        referrer TEXT,
        ip_address VARCHAR(45),
        session_id VARCHAR(255),
        timestamp TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert page view
    await db.execute(sql`
      INSERT INTO page_views (page, user_agent, referrer, ip_address, session_id, timestamp)
      VALUES (${page}, ${userAgent}, ${referrer}, ${ipAddress}, ${sessionId}, ${timestamp || new Date().toISOString()})
    `);

    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    res.status(500).json({ error: "Failed to track page view" });
  }
});

// Get traffic analytics
router.get("/analytics", async (req, res) => {
  try {
    // Check if page_views table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'page_views'
      )
    `);

    if (!tableExists.rows[0]?.exists) {
      return res.json({
        totalPageViews: 0,
        uniqueVisitors: 0,
        topPages: [],
        trafficSources: [],
        dailyTraffic: []
      });
    }

    // Total page views
    const totalViews = await db.execute(sql`
      SELECT COUNT(*) as total FROM page_views
    `);

    // Unique visitors (by IP + User Agent combination)
    const uniqueVisitors = await db.execute(sql`
      SELECT COUNT(DISTINCT CONCAT(ip_address, user_agent)) as unique_visitors 
      FROM page_views
    `);

    // Top pages
    const topPages = await db.execute(sql`
      SELECT page, COUNT(*) as views 
      FROM page_views 
      GROUP BY page 
      ORDER BY views DESC 
      LIMIT 10
    `);

    // Traffic sources (referrers)
    const trafficSources = await db.execute(sql`
      SELECT 
        CASE 
          WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
          WHEN referrer LIKE '%google%' THEN 'Google'
          WHEN referrer LIKE '%facebook%' THEN 'Facebook'
          WHEN referrer LIKE '%twitter%' OR referrer LIKE '%x.com%' THEN 'Twitter/X'
          WHEN referrer LIKE '%linkedin%' THEN 'LinkedIn'
          WHEN referrer LIKE '%reddit%' THEN 'Reddit'
          ELSE 'Other'
        END as source,
        COUNT(*) as visits
      FROM page_views 
      GROUP BY source 
      ORDER BY visits DESC
    `);

    // Daily traffic (last 30 days)
    const dailyTraffic = await db.execute(sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views,
        COUNT(DISTINCT CONCAT(ip_address, user_agent)) as unique_visitors
      FROM page_views 
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      totalPageViews: Number(totalViews.rows[0]?.total || 0),
      uniqueVisitors: Number(uniqueVisitors.rows[0]?.unique_visitors || 0),
      topPages: topPages.rows,
      trafficSources: trafficSources.rows,
      dailyTraffic: dailyTraffic.rows
    });
  } catch (error) {
    console.error("Error fetching traffic analytics:", error);
    res.status(500).json({ error: "Failed to fetch traffic analytics" });
  }
});

export default router;