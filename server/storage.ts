import {
  users,
  bills,
  votes,
  politicians,
  politicianStatements,
  notifications,
  type User,
  type UpsertUser,
  type Bill,
  type InsertBill,
  type Vote,
  type InsertVote,
  type Politician,
  type InsertPolitician,
  type PoliticianStatement,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserVerification(id: string, isVerified: boolean): Promise<void>;
  
  // Bill operations
  getAllBills(): Promise<Bill[]>;
  getActiveBills(): Promise<Bill[]>;
  getBill(id: number): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBillSummary(id: number, summary: string): Promise<void>;
  
  // Vote operations
  createVote(vote: InsertVote & { verificationId: string; blockHash: string }): Promise<Vote>;
  getUserVotes(userId: string): Promise<(Vote & { bill: Bill })[]>;
  getVoteByUserAndBill(userId: string, billId: number): Promise<Vote | undefined>;
  getBillVoteStats(billId: number): Promise<{ yes: number; no: number; abstain: number; total: number }>;
  
  // Politician operations
  getAllPoliticians(): Promise<Politician[]>;
  getPolitician(id: number): Promise<Politician | undefined>;
  createPolitician(politician: InsertPolitician): Promise<Politician>;
  updatePoliticianTrustScore(id: number, score: string): Promise<void>;
  
  // Statement operations
  createPoliticianStatement(statement: Omit<PoliticianStatement, "id" | "dateCreated">): Promise<PoliticianStatement>;
  getPoliticianStatements(politicianId: number): Promise<PoliticianStatement[]>;
  
  // Notification operations
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<void>;
  
  // Analytics
  getUserStats(userId: string): Promise<{ voteCount: number; trustScore: string; civicLevel: string }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserVerification(id: string, isVerified: boolean): Promise<void> {
    await db
      .update(users)
      .set({ isVerified, civicLevel: isVerified ? "Verified" : "Registered", updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  // Bill operations
  async getAllBills(): Promise<Bill[]> {
    return await db.select().from(bills).orderBy(desc(bills.createdAt));
  }

  async getActiveBills(): Promise<Bill[]> {
    return await db
      .select()
      .from(bills)
      .where(eq(bills.status, "Active"))
      .orderBy(desc(bills.votingDeadline));
  }

  async getBill(id: number): Promise<Bill | undefined> {
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill;
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const [newBill] = await db.insert(bills).values(bill).returning();
    return newBill;
  }

  async updateBillSummary(id: number, summary: string): Promise<void> {
    await db
      .update(bills)
      .set({ aiSummary: summary, updatedAt: new Date() })
      .where(eq(bills.id, id));
  }

  // Vote operations
  async createVote(voteData: InsertVote & { verificationId: string; blockHash: string }): Promise<Vote> {
    const [vote] = await db.insert(votes).values(voteData).returning();
    return vote;
  }

  async getUserVotes(userId: string): Promise<(Vote & { bill: Bill })[]> {
    return await db
      .select({
        id: votes.id,
        userId: votes.userId,
        billId: votes.billId,
        voteValue: votes.voteValue,
        reasoning: votes.reasoning,
        verificationId: votes.verificationId,
        blockHash: votes.blockHash,
        timestamp: votes.timestamp,
        isVerified: votes.isVerified,
        bill: bills,
      })
      .from(votes)
      .innerJoin(bills, eq(votes.billId, bills.id))
      .where(eq(votes.userId, userId))
      .orderBy(desc(votes.timestamp));
  }

  async getVoteByUserAndBill(userId: string, billId: number): Promise<Vote | undefined> {
    const [vote] = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, userId), eq(votes.billId, billId)));
    return vote;
  }

  async getBillVoteStats(billId: number): Promise<{ yes: number; no: number; abstain: number; total: number }> {
    const result = await db
      .select({
        voteValue: votes.voteValue,
        count: count(),
      })
      .from(votes)
      .where(eq(votes.billId, billId))
      .groupBy(votes.voteValue);

    const stats = { yes: 0, no: 0, abstain: 0, total: 0 };
    
    result.forEach(({ voteValue, count: voteCount }) => {
      stats[voteValue as keyof typeof stats] = voteCount;
      stats.total += voteCount;
    });

    return stats;
  }

  // Politician operations
  async getAllPoliticians(): Promise<Politician[]> {
    return await db.select().from(politicians).orderBy(desc(politicians.trustScore));
  }

  async getPolitician(id: number): Promise<Politician | undefined> {
    const [politician] = await db.select().from(politicians).where(eq(politicians.id, id));
    return politician;
  }

  async createPolitician(politician: InsertPolitician): Promise<Politician> {
    const [newPolitician] = await db.insert(politicians).values(politician).returning();
    return newPolitician;
  }

  async updatePoliticianTrustScore(id: number, score: string): Promise<void> {
    await db
      .update(politicians)
      .set({ trustScore: score, updatedAt: new Date() })
      .where(eq(politicians.id, id));
  }

  // Statement operations
  async createPoliticianStatement(statement: Omit<PoliticianStatement, "id" | "dateCreated">): Promise<PoliticianStatement> {
    const [newStatement] = await db.insert(politicianStatements).values(statement).returning();
    return newStatement;
  }

  async getPoliticianStatements(politicianId: number): Promise<PoliticianStatement[]> {
    return await db
      .select()
      .from(politicianStatements)
      .where(eq(politicianStatements.politicianId, politicianId))
      .orderBy(desc(politicianStatements.dateCreated));
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(10);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Analytics
  async getUserStats(userId: string): Promise<{ voteCount: number; trustScore: string; civicLevel: string }> {
    const user = await this.getUser(userId);
    if (!user) {
      return { voteCount: 0, trustScore: "0.00", civicLevel: "Registered" };
    }

    const [{ count: voteCount }] = await db
      .select({ count: count() })
      .from(votes)
      .where(eq(votes.userId, userId));

    return {
      voteCount,
      trustScore: user.trustScore || "100.00",
      civicLevel: user.civicLevel || "Registered",
    };
  }
}

export const storage = new DatabaseStorage();
