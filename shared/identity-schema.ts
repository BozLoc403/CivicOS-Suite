import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Identity verification requests table
export const identityVerifications = pgTable("identity_verifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  email: varchar("email").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, reviewing, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
  
  // CAPTCHA and email verification
  captchaToken: varchar("captcha_token"),
  emailVerified: boolean("email_verified").default(false),
  otpCode: varchar("otp_code"),
  otpExpiresAt: timestamp("otp_expires_at"),
  
  // MFA/TOTP
  totpSecret: varchar("totp_secret"),
  totpVerified: boolean("totp_verified").default(false),
  
  // Document uploads
  idFrontUrl: varchar("id_front_url"),
  idBackUrl: varchar("id_back_url"),
  selfieUrl: varchar("selfie_url"),
  livenessVideoUrl: varchar("liveness_video_url"),
  
  // Face matching and verification
  faceMatchScore: integer("face_match_score"), // 0-100
  faceVector: jsonb("face_vector"), // Encrypted face recognition vector
  
  // Risk assessment
  riskScore: integer("risk_score").default(0), // 0-100
  flaggedReasons: jsonb("flagged_reasons").$type<string[]>().default([]),
  
  // Duplicate detection
  idNumberHash: varchar("id_number_hash"), // SHA-256 hash of ID number
  duplicateIdCheck: boolean("duplicate_id_check").default(false),
  duplicateFaceCheck: boolean("duplicate_face_check").default(false),
  duplicateIpCheck: boolean("duplicate_ip_check").default(false),
  
  // Metadata
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  geolocation: varchar("geolocation"),
  deviceFingerprint: varchar("device_fingerprint"),
  
  // Terms and signatures
  termsAgreed: boolean("terms_agreed").default(false),
  digitalSignature: varchar("digital_signature"),
  termsAgreedAt: timestamp("terms_agreed_at"),
  
  // Admin notes
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
});

// Document storage table for secure file tracking
export const verificationDocuments = pgTable("verification_documents", {
  id: serial("id").primaryKey(),
  verificationId: integer("verification_id").notNull(),
  documentType: varchar("document_type").notNull(), // id_front, id_back, selfie, liveness_video
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileHash: varchar("file_hash").notNull(), // For integrity verification
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Auto-purge after 72 hours
  purged: boolean("purged").default(false),
});

// User verification status tracking
export const userVerificationStatus = pgTable("user_verification_status", {
  userId: varchar("user_id").primaryKey(),
  isVerified: boolean("is_verified").default(false),
  verificationLevel: varchar("verification_level").default("none"), // none, basic, enhanced, government
  verifiedAt: timestamp("verified_at"),
  lastVerificationId: integer("last_verification_id"),
  
  // Civic permissions
  canVote: boolean("can_vote").default(false),
  canComment: boolean("can_comment").default(false),
  canCreatePetitions: boolean("can_create_petitions").default(false),
  canAccessFOI: boolean("can_access_foi").default(false),
  
  // Security tracking
  failedAttempts: integer("failed_attempts").default(0),
  lastFailedAt: timestamp("last_failed_at"),
  blockedUntil: timestamp("blocked_until"),
});

// Insert schemas for validation
export const insertIdentityVerificationSchema = createInsertSchema(identityVerifications).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertVerificationDocumentSchema = createInsertSchema(verificationDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertUserVerificationStatusSchema = createInsertSchema(userVerificationStatus);

// Types
export type IdentityVerification = typeof identityVerifications.$inferSelect;
export type InsertIdentityVerification = z.infer<typeof insertIdentityVerificationSchema>;

export type VerificationDocument = typeof verificationDocuments.$inferSelect;
export type InsertVerificationDocument = z.infer<typeof insertVerificationDocumentSchema>;

export type UserVerificationStatus = typeof userVerificationStatus.$inferSelect;
export type InsertUserVerificationStatus = z.infer<typeof insertUserVerificationStatusSchema>;

// Verification step enum
export const verificationSteps = [
  "captcha",
  "email",
  "mfa", 
  "id_upload",
  "liveness",
  "duplicate_check",
  "terms"
] as const;

export type VerificationStep = typeof verificationSteps[number];