import { db } from "./db";
import { sql } from "drizzle-orm";
import * as schema from "@shared/schema";

interface VoteOption {
  id: string;
  text: string;
  description?: string;
}

interface VotingItem {
  id: number;
  title: string;
  description: string;
  type: 'bill' | 'petition' | 'referendum' | 'poll';
  options: VoteOption[];
  startDate: Date;
  endDate: Date;
  status: 'active' | 'ended' | 'upcoming';
  eligibleVoters: string[]; // User IDs or 'all'
  jurisdiction: 'federal' | 'provincial' | 'municipal';
  requiredQuorum?: number;
}

interface VoteRecord {
  userId: string;
  itemId: number;
  optionId: string;
  timestamp: Date;
  verified: boolean;
}

export class VotingSystem {
  /**
   * Create a new voting item (bill vote, referendum, etc.)
   */
  async createVotingItem(item: Omit<VotingItem, 'id'>): Promise<number> {
    try {
      const [result] = await db.insert(schema.votes).values({
        title: item.title,
        description: item.description,
        type: item.type,
        options: JSON.stringify(item.options),
        startDate: item.startDate,
        endDate: item.endDate,
        status: item.status,
        jurisdiction: item.jurisdiction,
        requiredQuorum: item.requiredQuorum || 0,
        eligibleVoters: JSON.stringify(item.eligibleVoters),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      return result.id;
    } catch (error) {
      console.error("Error creating voting item:", error);
      throw new Error("Failed to create voting item");
    }
  }

  /**
   * Cast a vote for a specific item
   */
  async castVote(userId: string, itemId: number, optionId: string): Promise<boolean> {
    try {
      // Check if user already voted
      const existingVote = await db.execute(sql`
        SELECT id FROM user_votes 
        WHERE user_id = ${userId} AND item_id = ${itemId}
      `);

      if (existingVote.rows.length > 0) {
        throw new Error("User has already voted on this item");
      }

      // Verify voting item is active
      const votingItem = await db.execute(sql`
        SELECT status, end_date, eligible_voters 
        FROM votes 
        WHERE id = ${itemId}
      `);

      if (votingItem.rows.length === 0) {
        throw new Error("Voting item not found");
      }

      const item = votingItem.rows[0];
      if (item.status !== 'active') {
        throw new Error("Voting is not currently active");
      }

      if (new Date() > new Date(item.end_date)) {
        throw new Error("Voting period has ended");
      }

      // Check eligibility
      const eligibleVoters = JSON.parse(item.eligible_voters || '["all"]');
      if (!eligibleVoters.includes('all') && !eligibleVoters.includes(userId)) {
        throw new Error("User is not eligible to vote on this item");
      }

      // Record the vote
      await db.execute(sql`
        INSERT INTO user_votes (user_id, item_id, option_id, timestamp, verified)
        VALUES (${userId}, ${itemId}, ${optionId}, NOW(), true)
      `);

      // Update vote counts
      await this.updateVoteCounts(itemId);
      
      return true;
    } catch (error) {
      console.error("Error casting vote:", error);
      throw error;
    }
  }

  /**
   * Get active voting items for a user
   */
  async getActiveVotingItems(userId?: string): Promise<VotingItem[]> {
    try {
      const items = await db.execute(sql`
        SELECT 
          id, title, description, type, options, 
          start_date, end_date, status, jurisdiction, 
          required_quorum, eligible_voters,
          (SELECT COUNT(*) FROM user_votes WHERE item_id = votes.id) as total_votes
        FROM votes 
        WHERE status = 'active' 
        AND start_date <= NOW() 
        AND end_date > NOW()
        ORDER BY end_date ASC
      `);

      return items.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        type: row.type,
        options: typeof row.options === 'string' ? JSON.parse(row.options) : Array.isArray(row.options) ? row.options : [],
        startDate: new Date(row.start_date),
        endDate: new Date(row.end_date),
        status: row.status,
        jurisdiction: row.jurisdiction,
        requiredQuorum: row.required_quorum,
        eligibleVoters: typeof row.eligible_voters === 'string' ? JSON.parse(row.eligible_voters) : (row.eligible_voters || ['all'])
      }));
    } catch (error) {
      console.error("Error getting active voting items:", error);
      return [];
    }
  }

  /**
   * Get voting results for an item
   */
  async getVotingResults(itemId: number): Promise<any> {
    try {
      const results = await db.execute(sql`
        SELECT 
          option_id,
          COUNT(*) as votes,
          COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
        FROM user_votes 
        WHERE item_id = ${itemId}
        GROUP BY option_id
        ORDER BY votes DESC
      `);

      const totalVotes = await db.execute(sql`
        SELECT COUNT(*) as total FROM user_votes WHERE item_id = ${itemId}
      `);

      const itemDetails = await db.execute(sql`
        SELECT title, options, required_quorum FROM votes WHERE id = ${itemId}
      `);

      const item = itemDetails.rows[0];
      const options = typeof item?.options === 'string' ? JSON.parse(item.options) : Array.isArray(item?.options) ? item.options : [];

      return {
        itemId,
        title: item?.title,
        totalVotes: totalVotes.rows[0]?.total || 0,
        quorumRequired: item?.required_quorum || 0,
        results: results.rows.map(row => ({
          optionId: row.option_id,
          optionText: options.find((opt: any) => opt.id === row.option_id)?.text || 'Unknown',
          votes: Number(row.votes),
          percentage: Number(row.percentage) || 0
        }))
      };
    } catch (error) {
      console.error("Error getting voting results:", error);
      return { itemId, results: [], totalVotes: 0 };
    }
  }

  /**
   * Create a bill vote based on parliamentary bills
   */
  async createBillVote(billId: number, userId: string): Promise<number> {
    try {
      const bill = await db.execute(sql`
        SELECT title, summary FROM bills WHERE id = ${billId}
      `);

      if (bill.rows.length === 0) {
        throw new Error("Bill not found");
      }

      const billData = bill.rows[0];
      
      const votingItem = await this.createVotingItem({
        title: `Vote on: ${billData.title}`,
        description: billData.summary || 'Parliamentary bill requiring public input',
        type: 'bill',
        options: [
          { id: 'support', text: 'Support', description: 'I support this bill' },
          { id: 'oppose', text: 'Oppose', description: 'I oppose this bill' },
          { id: 'abstain', text: 'Abstain', description: 'I choose not to vote' }
        ],
        startDate: new Date(),
        endDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)), // 30 days
        status: 'active',
        jurisdiction: 'federal',
        eligibleVoters: ['all'],
        requiredQuorum: 1000
      });

      return votingItem;
    } catch (error) {
      console.error("Error creating bill vote:", error);
      throw error;
    }
  }

  /**
   * Check if user has voted on an item
   */
  async hasUserVoted(userId: string, itemId: number): Promise<boolean> {
    try {
      const vote = await db.execute(sql`
        SELECT id FROM user_votes 
        WHERE user_id = ${userId} AND item_id = ${itemId}
      `);

      return vote.rows.length > 0;
    } catch (error) {
      console.error("Error checking user vote:", error);
      return false;
    }
  }

  /**
   * Get user's voting history
   */
  async getUserVotingHistory(userId: string): Promise<any[]> {
    try {
      const history = await db.execute(sql`
        SELECT 
          v.id, v.title, v.type, v.jurisdiction,
          uv.option_id, uv.timestamp,
          v.options
        FROM user_votes uv
        JOIN votes v ON uv.item_id = v.id
        WHERE uv.user_id = ${userId}
        ORDER BY uv.timestamp DESC
        LIMIT 50
      `);

      return history.rows.map(row => {
        const options = JSON.parse(row.options || '[]');
        const selectedOption = options.find((opt: any) => opt.id === row.option_id);
        
        return {
          id: row.id,
          title: row.title,
          type: row.type,
          jurisdiction: row.jurisdiction,
          selectedOption: selectedOption?.text || 'Unknown',
          timestamp: row.timestamp
        };
      });
    } catch (error) {
      console.error("Error getting user voting history:", error);
      return [];
    }
  }

  private async updateVoteCounts(itemId: number): Promise<void> {
    try {
      await db.execute(sql`
        UPDATE votes 
        SET total_votes = (
          SELECT COUNT(*) FROM user_votes WHERE item_id = ${itemId}
        ),
        updated_at = NOW()
        WHERE id = ${itemId}
      `);
    } catch (error) {
      console.error("Error updating vote counts:", error);
    }
  }

  /**
   * End voting for an item and calculate final results
   */
  async endVoting(itemId: number): Promise<any> {
    try {
      await db.execute(sql`
        UPDATE votes 
        SET status = 'ended', updated_at = NOW()
        WHERE id = ${itemId}
      `);

      return await this.getVotingResults(itemId);
    } catch (error) {
      console.error("Error ending voting:", error);
      throw error;
    }
  }
}

export const votingSystem = new VotingSystem();