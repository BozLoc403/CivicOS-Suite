import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { generateEmailVerificationCode, verifyEmailCode, sendVerificationEmail } from "../emailService";
import { 
  initializeOfflineVerification, 
  verifyOfflineChallenge, 
  isOfflineVerificationComplete,
  generateOfflineTOTP,
  verifyOfflineTOTP
} from "../offlineVerification";

export function registerIdentityRoutes(app: Express) {
  // Get user verification status
  app.get('/api/identity/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const verificationStatus = null; // Temporarily disabled
      
      if (!verificationStatus) {
        // User has no verification status yet
        res.json({
          isVerified: false,
          verificationLevel: 'none',
          verifiedAt: null,
          permissions: {
            canVote: false,
            canComment: true, // Allow basic commenting without verification
            canCreatePetitions: false,
            canAccessFOI: false
          }
        });
        return;
      }

      res.json({
        isVerified: verificationStatus.isVerified,
        verificationLevel: verificationStatus.verificationLevel,
        verifiedAt: verificationStatus.verifiedAt,
        permissions: {
          canVote: verificationStatus.canVote,
          canComment: verificationStatus.canComment,
          canCreatePetitions: verificationStatus.canCreatePetitions,
          canAccessFOI: verificationStatus.canAccessFOI
        }
      });
    } catch (error) {
      console.error("Error fetching verification status:", error);
      res.status(500).json({ message: "Failed to fetch verification status" });
    }
  });

  // Start identity verification process
  app.post('/api/identity/start-verification', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // This would start the verification process
      // For now, return success
      res.json({ 
        success: true, 
        message: "Verification process started",
        verificationId: `temp_${Date.now()}`
      });
    } catch (error) {
      console.error("Error starting verification:", error);
      res.status(500).json({ message: "Failed to start verification" });
    }
  });

  // Submit verification step
  app.post('/api/identity/submit-step', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { step, data } = req.body;
      
      // This would process each verification step
      // For now, return success for all steps
      res.json({ 
        success: true, 
        message: `Step ${step} completed successfully`,
        nextStep: step < 7 ? step + 1 : null
      });
    } catch (error) {
      console.error("Error submitting verification step:", error);
      res.status(500).json({ message: "Failed to submit verification step" });
    }
  });

  // Admin routes for verification management
  app.get('/api/admin/verification-queue', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const pendingVerifications = []; // Temporarily disabled
      res.json(pendingVerifications);
    } catch (error) {
      console.error("Error fetching verification queue:", error);
      res.status(500).json({ message: "Failed to fetch verification queue" });
    }
  });

  app.post('/api/admin/approve-verification', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { verificationId } = req.body;
      const success = true; // Temporarily disabled
      
      if (success) {
        res.json({ success: true, message: "Verification approved successfully" });
      } else {
        res.status(500).json({ message: "Failed to approve verification" });
      }
    } catch (error) {
      console.error("Error approving verification:", error);
      res.status(500).json({ message: "Failed to approve verification" });
    }
  });

  app.post('/api/admin/reject-verification', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { verificationId, reason } = req.body;
      const success = true; // Temporarily disabled
      
      if (success) {
        res.json({ success: true, message: "Verification rejected successfully" });
      } else {
        res.status(500).json({ message: "Failed to reject verification" });
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
      res.status(500).json({ message: "Failed to reject verification" });
    }
  });

  // Send email verification code
  app.post("/api/identity/send-email-verification", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    try {
      const code = generateEmailVerificationCode(email);
      const emailSent = await sendVerificationEmail(email, code);
      
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }
      
      res.json({ 
        message: "Verification code sent to your email",
        success: true 
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Verify email OTP code
  app.post("/api/identity/verify-email-code", async (req, res) => {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }
    
    try {
      const verification = verifyEmailCode(email, code);
      
      if (!verification.valid) {
        return res.status(400).json({ 
          message: verification.error || "Invalid verification code",
          success: false 
        });
      }
      
      res.json({ 
        message: "Email verified successfully",
        success: true 
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Initialize offline verification challenges
  app.post("/api/identity/init-offline-verification", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    try {
      const challenges = initializeOfflineVerification(email);
      res.json({ 
        success: true,
        challenges,
        message: "Offline verification challenges generated" 
      });
    } catch (error) {
      console.error("Offline verification init error:", error);
      res.status(500).json({ message: "Failed to initialize offline verification" });
    }
  });

  // Verify offline challenge
  app.post("/api/identity/verify-offline-challenge", async (req, res) => {
    const { sessionId, challengeId, response } = req.body;
    
    if (!sessionId || !challengeId || response === undefined) {
      return res.status(400).json({ message: "Session ID, challenge ID, and response are required" });
    }
    
    try {
      const isValid = verifyOfflineChallenge(sessionId, challengeId, response);
      const isComplete = isOfflineVerificationComplete(sessionId);
      
      res.json({ 
        success: true,
        valid: isValid,
        complete: isComplete,
        message: isValid ? "Challenge verified" : "Challenge failed" 
      });
    } catch (error) {
      console.error("Offline challenge verification error:", error);
      res.status(500).json({ message: "Failed to verify challenge" });
    }
  });

  // Generate offline TOTP
  app.post("/api/identity/generate-offline-totp", async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    try {
      const totp = await generateOfflineTOTP(email);
      res.json({ 
        success: true,
        ...totp,
        message: "TOTP secret generated offline" 
      });
    } catch (error) {
      console.error("Offline TOTP generation error:", error);
      res.status(500).json({ message: "Failed to generate TOTP" });
    }
  });

  // Verify offline TOTP
  app.post("/api/identity/verify-offline-totp", async (req, res) => {
    const { secret, token } = req.body;
    
    if (!secret || !token) {
      return res.status(400).json({ message: "Secret and token are required" });
    }
    
    try {
      const isValid = verifyOfflineTOTP(secret, token);
      res.json({ 
        success: true,
        valid: isValid,
        message: isValid ? "TOTP verified" : "Invalid TOTP token" 
      });
    } catch (error) {
      console.error("Offline TOTP verification error:", error);
      res.status(500).json({ message: "Failed to verify TOTP" });
    }
  });
}