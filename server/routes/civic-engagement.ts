import { Router } from 'express';
import { db } from '../db';
import { bills, users, votes } from '../../shared/schema';
import { eq, desc, count, and, gte } from 'drizzle-orm';

const router = Router();

// Get real civic actions based on actual bills and current events
router.get('/civic-actions', async (req, res) => {
  try {
    // Get active bills for real legislative actions
    const activeBills = await db
      .select()
      .from(bills)
      .where(eq(bills.status, 'First Reading'))
      .limit(5);

    const civicActions = activeBills.map((bill, index) => ({
      id: bill.id.toString(),
      title: `Contact MP About ${bill.bill_number}`,
      description: bill.description || `${bill.title} - Make your voice heard on this legislation`,
      points: 150,
      category: 'advocacy',
      difficulty: 'medium',
      timeRequired: '15 min',
      impact: 'federal'
    }));

    // Add general voting action with real vote count
    const totalVotes = await db.select({ count: count() }).from(votes);
    civicActions.push({
      id: 'vote-active',
      title: 'Vote on Active Legislation',
      description: `Join ${totalVotes[0]?.count || 0} citizens who have already voted on current bills`,
      points: 75,
      category: 'voting',
      difficulty: 'easy',
      timeRequired: '10 min',
      impact: 'federal'
    });

    res.json(civicActions);
  } catch (error) {
    console.error('Error fetching civic actions:', error);
    res.status(500).json({ error: 'Failed to fetch civic actions' });
  }
});

// Get real user stats
router.get('/user-stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user's actual vote count
    const userVotes = await db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.userId, userId));

    const voteCount = userVotes[0]?.count || 0;
    const points = voteCount * 25; // 25 points per vote
    const level = Math.floor(points / 200) + 1; // Level up every 200 points

    res.json({
      points,
      level,
      actionsCompleted: voteCount,
      badgesEarned: Math.floor(level / 2)
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get real leaderboard based on actual user activity
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db
      .select({
        userId: votes.userId,
        voteCount: count(votes.id)
      })
      .from(votes)
      .groupBy(votes.userId)
      .orderBy(desc(count(votes.id)))
      .limit(10);

    const leaderboardWithNames = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, entry.userId))
          .limit(1);

        const points = entry.voteCount * 25;
        const level = Math.floor(points / 200) + 1;

        return {
          name: user[0]?.firstName || user[0]?.email?.split('@')[0] || 'Anonymous',
          points,
          level,
          badge: level >= 8 ? 'Democracy Champion' : level >= 5 ? 'Civic Advocate' : 'Active Citizen'
        };
      })
    );

    res.json(leaderboardWithNames);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;