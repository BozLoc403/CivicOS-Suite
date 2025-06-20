import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { generateEmailVerificationCode, verifyEmailCode, sendVerificationEmail } from "../emailService";
// Offline verification removed - using only Canadian authentication
import {
  initializeGCKeyAuth,
  initializeBankingAuth,
  verifyGCKeyCallback,
  verifyBankingCallback,
  getAvailableAuthMethods,
  getProvincialAuthMethods
} from "../canadianAuth";

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

  // Offline verification endpoints removed - using only Canadian authentication

  // Get available Canadian authentication methods
  app.get("/api/auth/canadian-methods", async (req, res) => {
    try {
      const authMethods = getAvailableAuthMethods();
      const provincialMethods = getProvincialAuthMethods();
      
      res.json({
        success: true,
        methods: {
          ...authMethods,
          provincial: provincialMethods
        }
      });
    } catch (error) {
      console.error("Error fetching auth methods:", error);
      res.status(500).json({ message: "Failed to fetch authentication methods" });
    }
  });

  // Initialize GCKey authentication
  app.post("/api/auth/gckey/init", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || req.body.userId || 'anonymous';
      const { authUrl, sessionId } = initializeGCKeyAuth(userId);
      
      res.json({
        success: true,
        authUrl,
        sessionId,
        message: "GCKey authentication initialized"
      });
    } catch (error) {
      console.error("GCKey init error:", error);
      res.status(500).json({ message: "Failed to initialize GCKey authentication" });
    }
  });

  // GCKey callback handler
  app.get("/api/auth/gckey/callback", async (req, res) => {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({ message: "Missing authentication code or state" });
    }
    
    try {
      const result = verifyGCKeyCallback(code as string, state as string);
      
      if (result.success) {
        // Store verified GCKey profile in session or database
        res.json({
          success: true,
          userProfile: result.userProfile,
          message: "GCKey authentication successful"
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.error || "GCKey authentication failed"
        });
      }
    } catch (error) {
      console.error("GCKey callback error:", error);
      res.status(500).json({ message: "Failed to process GCKey authentication" });
    }
  });

  // Initialize banking authentication
  app.post("/api/auth/banking/init", async (req: any, res) => {
    const { provider } = req.body;
    
    if (!provider || !['rbc', 'td', 'scotiabank', 'bmo', 'cibc'].includes(provider)) {
      return res.status(400).json({ message: "Valid banking provider required" });
    }
    
    try {
      const userId = req.user?.claims?.sub || req.body.userId || 'anonymous';
      const { authUrl, sessionId } = initializeBankingAuth(userId, provider);
      
      res.json({
        success: true,
        authUrl,
        sessionId,
        provider,
        message: `${provider.toUpperCase()} banking authentication initialized`
      });
    } catch (error) {
      console.error("Banking auth init error:", error);
      res.status(500).json({ message: "Failed to initialize banking authentication" });
    }
  });

  // Banking callback handler
  app.get("/api/auth/banking/callback", async (req, res) => {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({ message: "Missing authentication code or state" });
    }
    
    try {
      const result = verifyBankingCallback(code as string, state as string);
      
      if (result.success) {
        res.json({
          success: true,
          userProfile: result.userProfile,
          message: "Banking authentication successful"
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.error || "Banking authentication failed"
        });
      }
    } catch (error) {
      console.error("Banking callback error:", error);
      res.status(500).json({ message: "Failed to process banking authentication" });
    }
  });
}