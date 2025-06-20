import { db } from "../db";
import { 
  identityVerifications, 
  userVerificationStatus,
  type IdentityVerification,
  type UserVerificationStatus 
} from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";

export class IdentityVerificationStorage {
  /**
   * Get user verification status
   */
  async getUserVerificationStatus(userId: string): Promise<UserVerificationStatus | null> {
    const [status] = await db
      .select()
      .from(userVerificationStatus)
      .where(eq(userVerificationStatus.userId, userId));
    
    return status || null;
  }

  /**
   * Create or update user verification status
   */
  async upsertUserVerificationStatus(data: Partial<UserVerificationStatus> & { userId: string }): Promise<UserVerificationStatus> {
    const [status] = await db
      .insert(userVerificationStatus)
      .values(data)
      .onConflictDoUpdate({
        target: userVerificationStatus.userId,
        set: {
          ...data,
          lastAttemptAt: new Date(),
        },
      })
      .returning();

    return status;
  }

  /**
   * Create new identity verification
   */
  async createIdentityVerification(data: Partial<IdentityVerification> & { userId: string; email: string }): Promise<IdentityVerification> {
    // Set auto-delete time to 72 hours from now
    const autoDeleteAt = new Date();
    autoDeleteAt.setHours(autoDeleteAt.getHours() + 72);

    const [verification] = await db
      .insert(identityVerifications)
      .values({
        ...data,
        autoDeleteAt,
      })
      .returning();

    return verification;
  }

  /**
   * Get identity verification by ID
   */
  async getIdentityVerification(id: number): Promise<IdentityVerification | null> {
    const [verification] = await db
      .select()
      .from(identityVerifications)
      .where(eq(identityVerifications.id, id));

    return verification || null;
  }

  /**
   * Update identity verification
   */
  async updateIdentityVerification(id: number, data: Partial<IdentityVerification>): Promise<IdentityVerification | null> {
    const [verification] = await db
      .update(identityVerifications)
      .set(data)
      .where(eq(identityVerifications.id, id))
      .returning();

    return verification || null;
  }

  /**
   * Get all pending verifications for admin review
   */
  async getPendingVerifications(): Promise<IdentityVerification[]> {
    return await db
      .select()
      .from(identityVerifications)
      .where(eq(identityVerifications.status, "pending"));
  }

  /**
   * Approve verification
   */
  async approveVerification(verificationId: number, reviewedBy: string): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        // Update verification status
        const [verification] = await tx
          .update(identityVerifications)
          .set({
            status: "approved",
            reviewedAt: new Date(),
            reviewedBy,
          })
          .where(eq(identityVerifications.id, verificationId))
          .returning();

        if (!verification) {
          throw new Error("Verification not found");
        }

        // Update user verification status
        await tx
          .insert(userVerificationStatus)
          .values({
            userId: verification.userId,
            isVerified: true,
            verificationLevel: "government",
            verifiedAt: new Date(),
            lastVerificationId: verificationId,
            canVote: true,
            canComment: true,
            canCreatePetitions: true,
            canAccessFOI: true,
            trustScore: 85,
          })
          .onConflictDoUpdate({
            target: userVerificationStatus.userId,
            set: {
              isVerified: true,
              verificationLevel: "government",
              verifiedAt: new Date(),
              lastVerificationId: verificationId,
              canVote: true,
              canComment: true,
              canCreatePetitions: true,
              canAccessFOI: true,
              trustScore: 85,
            },
          });
      });

      return true;
    } catch (error) {
      console.error("Error approving verification:", error);
      return false;
    }
  }

  /**
   * Reject verification
   */
  async rejectVerification(verificationId: number, reviewedBy: string, reason: string): Promise<boolean> {
    try {
      const [verification] = await db
        .update(identityVerifications)
        .set({
          status: "rejected",
          reviewedAt: new Date(),
          reviewedBy,
          flaggedReasons: [reason],
        })
        .where(eq(identityVerifications.id, verificationId))
        .returning();

      return !!verification;
    } catch (error) {
      console.error("Error rejecting verification:", error);
      return false;
    }
  }

  /**
   * Clean up expired verifications (auto-delete after 72 hours)
   */
  async cleanupExpiredVerifications(): Promise<number> {
    const now = new Date();
    
    const deletedVerifications = await db
      .delete(identityVerifications)
      .where(
        and(
          lt(identityVerifications.autoDeleteAt, now),
          eq(identityVerifications.status, "pending")
        )
      )
      .returning();

    return deletedVerifications.length;
  }

  /**
   * Check for duplicate biometric data
   */
  async checkDuplicateBiometric(biometricHash: string, excludeUserId?: string): Promise<boolean> {
    const query = db
      .select()
      .from(identityVerifications)
      .where(eq(identityVerifications.biometricHash, biometricHash));

    if (excludeUserId) {
      query.where(eq(identityVerifications.userId, excludeUserId));
    }

    const duplicates = await query;
    return duplicates.length > 0;
  }
}

export const identityStorage = new IdentityVerificationStorage();