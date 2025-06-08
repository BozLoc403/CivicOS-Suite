import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  electoralDistrict: varchar("electoral_district"),
  phoneNumber: varchar("phone_number"),
  isVerified: boolean("is_verified").default(false),
  civicLevel: varchar("civic_level").default("Registered"),
  trustScore: decimal("trust_score", { precision: 5, scale: 2 }).default("100.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bills/Legislation table
export const bills = pgTable("bills", {
  id: serial("id").primaryKey(),
  billNumber: varchar("bill_number").notNull().unique(),
  title: varchar("title").notNull(),
  description: text("description"),
  fullText: text("full_text"),
  aiSummary: text("ai_summary"),
  category: varchar("category"),
  jurisdiction: varchar("jurisdiction").notNull(), // Federal, Provincial, Municipal
  status: varchar("status").default("Active"), // Active, Passed, Failed, Withdrawn
  votingDeadline: timestamp("voting_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Votes table
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  billId: integer("bill_id").notNull().references(() => bills.id),
  voteValue: varchar("vote_value").notNull(), // "yes", "no", "abstain"
  reasoning: text("reasoning"),
  verificationId: varchar("verification_id").notNull().unique(),
  blockHash: varchar("block_hash").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isVerified: boolean("is_verified").default(true),
});

// Politicians table
export const politicians = pgTable("politicians", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  position: varchar("position").notNull(),
  party: varchar("party"),
  jurisdiction: varchar("jurisdiction").notNull(),
  constituency: varchar("constituency"),
  trustScore: decimal("trust_score", { precision: 5, scale: 2 }).default("50.00"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Politician statements for tracking consistency
export const politicianStatements = pgTable("politician_statements", {
  id: serial("id").primaryKey(),
  politicianId: integer("politician_id").notNull().references(() => politicians.id),
  statement: text("statement").notNull(),
  context: varchar("context"), // debate, press release, etc.
  source: varchar("source"),
  dateCreated: timestamp("date_created").defaultNow(),
  isContradiction: boolean("is_contradiction").default(false),
  contradictionDetails: text("contradiction_details"),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").default("info"), // info, warning, urgent
  isRead: boolean("is_read").default(false),
  relatedBillId: integer("related_bill_id").references(() => bills.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  votes: many(votes),
  notifications: many(notifications),
}));

export const billsRelations = relations(bills, ({ many }) => ({
  votes: many(votes),
  notifications: many(notifications),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  bill: one(bills, {
    fields: [votes.billId],
    references: [bills.id],
  }),
}));

export const politiciansRelations = relations(politicians, ({ many }) => ({
  statements: many(politicianStatements),
}));

export const politicianStatementsRelations = relations(politicianStatements, ({ one }) => ({
  politician: one(politicians, {
    fields: [politicianStatements.politicianId],
    references: [politicians.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  bill: one(bills, {
    fields: [notifications.relatedBillId],
    references: [bills.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  electoralDistrict: true,
  phoneNumber: true,
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  userId: true,
  timestamp: true,
  isVerified: true,
  verificationId: true,
  blockHash: true,
});

export const insertPoliticianSchema = createInsertSchema(politicians).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Politician = typeof politicians.$inferSelect;
export type InsertPolitician = z.infer<typeof insertPoliticianSchema>;
export type PoliticianStatement = typeof politicianStatements.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
