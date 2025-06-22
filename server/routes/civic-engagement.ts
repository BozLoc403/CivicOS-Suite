import { Router } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

// Get civic actions
router.get('/civic-actions', async (req, res) => {
  try {
    const actions = [
      {
        id: '1',
        title: 'Vote on Current Bills',
        description: 'Cast your vote on active legislation in Parliament',
        points: 25,
        category: 'voting',
        difficulty: 'easy',
        timeRequired: '5 minutes',
        impact: 'federal'
      },
      {
        id: '2',
        title: 'Contact Your MP',
        description: 'Send a message to your Member of Parliament about local issues',
        points: 50,
        category: 'engagement',
        difficulty: 'medium',
        timeRequired: '15 minutes',
        impact: 'federal'
      },
      {
        id: '3',
        title: 'Attend Town Hall',
        description: 'Participate in local government meetings in your area',
        points: 100,
        category: 'engagement',
        difficulty: 'hard',
        timeRequired: '2 hours',
        impact: 'local'
      },
      {
        id: '4',
        title: 'Learn About Bills',
        description: 'Read and understand current legislation before Parliament',
        points: 15,
        category: 'knowledge',
        difficulty: 'easy',
        timeRequired: '10 minutes',
        impact: 'federal'
      },
      {
        id: '5',
        title: 'Share Civic Content',
        description: 'Help spread awareness about important civic issues',
        points: 10,
        category: 'advocacy',
        difficulty: 'easy',
        timeRequired: '2 minutes',
        impact: 'local'
      },
      {
        id: '6',
        title: 'Join Petition',
        description: 'Sign petitions for causes you support',
        points: 20,
        category: 'advocacy',
        difficulty: 'easy',
        timeRequired: '3 minutes',
        impact: 'provincial'
      }
    ];
    
    res.json(actions);
  } catch (error) {
    console.error('Error fetching civic actions:', error);
    res.status(500).json({ message: 'Failed to fetch civic actions' });
  }
});

// Get user stats
router.get('/user-stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Calculate stats from actual user activity
    const votesQuery = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM votes 
      WHERE user_id = ${userId}
    `);
    
    const voteCount = Number(votesQuery.rows[0]?.count) || 0;
    
    const stats = {
      points: voteCount * 25, // 25 points per vote
      level: Math.floor(voteCount / 10) + 1, // Level up every 10 votes
      actionsCompleted: voteCount,
      badgesEarned: Math.floor(voteCount / 5) // Badge every 5 votes
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = [
      {
        name: 'Demo User',
        points: 450,
        level: 3,
        badge: 'Civic Champion'
      },
      {
        name: 'Active Citizen',
        points: 320,
        level: 2,
        badge: 'Community Advocate'
      },
      {
        name: 'Engaged Voter',
        points: 180,
        level: 1,
        badge: 'Rising Voice'
      }
    ];
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

export default router;