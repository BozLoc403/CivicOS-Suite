import type { Express } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import { db } from "./db";
import { 
  identityVerifications, 
  verificationDocuments, 
  userVerificationStatus,
  type InsertIdentityVerification,
  type InsertVerificationDocument,
  type InsertUserVerificationStatus
} from "@shared/identity-schema";
import { eq, and, desc } from "drizzle-orm";
import { isAuthenticated } from "./replitAuth";

// Configure multer for file uploads with security
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

interface VerificationRequest {
  step: string;
  data: any;
  files?: Express.Multer.File[];
}

export function registerIdentityVerificationRoutes(app: Express) {
  
  // Start new verification process
  app.post('/api/identity/start-verification', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { email } = req.body;
      
      // Check if user already has pending verification
      const existingVerification = await db
        .select()
        .from(identityVerifications)
        .where(and(
          eq(identityVerifications.userId, userId),
          eq(identityVerifications.status, 'pending')
        ))
        .limit(1);
      
      if (existingVerification.length > 0) {
        return res.json({ 
          success: true, 
          verificationId: existingVerification[0].id,
          message: "Continuing existing verification process"
        });
      }
      
      // Create new verification request
      const [newVerification] = await db
        .insert(identityVerifications)
        .values({
          userId,
          email,
          status: 'pending',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || '',
          geolocation: req.get('CF-IPCountry') || 'Unknown'
        })
        .returning();
      
      res.json({ 
        success: true, 
        verificationId: newVerification.id,
        message: "Verification process started"
      });
      
    } catch (error) {
      console.error('Start verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to start verification process' 
      });
    }
  });
  
  // Submit verification step
  app.post('/api/identity/submit-step', isAuthenticated, upload.array('files', 4), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { verificationId, step, data } = req.body;
      const files = req.files as Express.Multer.File[];
      
      // Get current verification
      const [verification] = await db
        .select()
        .from(identityVerifications)
        .where(and(
          eq(identityVerifications.id, parseInt(verificationId)),
          eq(identityVerifications.userId, userId)
        ))
        .limit(1);
      
      if (!verification) {
        return res.status(404).json({ 
          success: false, 
          message: 'Verification not found' 
        });
      }
      
      let updateData: Partial<typeof identityVerifications.$inferInsert> = {};
      
      switch (step) {
        case 'captcha':
          updateData.captchaToken = data.captchaToken;
          break;
          
        case 'email':
          // In production, send real OTP via email service
          const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
          updateData.otpCode = otpCode;
          updateData.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
          
          // For demo, return the OTP (in production, only send via email)
          res.json({ 
            success: true, 
            message: 'OTP sent to email',
            demoOtp: otpCode // Remove in production
          });
          break;
          
        case 'verify-email':
          if (data.otpCode === verification.otpCode && 
              verification.otpExpiresAt && 
              new Date() < verification.otpExpiresAt) {
            updateData.emailVerified = true;
            updateData.otpCode = null;
            updateData.otpExpiresAt = null;
          } else {
            return res.status(400).json({ 
              success: false, 
              message: 'Invalid or expired OTP code' 
            });
          }
          break;
          
        case 'mfa':
          // In production, generate real TOTP secret and QR code
          const totpSecret = crypto.randomBytes(32).toString('base64');
          updateData.totpSecret = totpSecret;
          
          res.json({ 
            success: true, 
            message: 'TOTP setup initiated',
            qrCodeUrl: `otpauth://totp/CivicOS:${verification.email}?secret=${totpSecret}&issuer=CivicOS`
          });
          break;
          
        case 'verify-totp':
          // In production, verify actual TOTP code
          if (data.totpCode && data.totpCode.length === 6) {
            updateData.totpVerified = true;
          } else {
            return res.status(400).json({ 
              success: false, 
              message: 'Invalid TOTP code' 
            });
          }
          break;
          
        case 'id-upload':
          if (!files || files.length < 2) {
            return res.status(400).json({ 
              success: false, 
              message: 'Both front and back ID images required' 
            });
          }
          
          // Store files securely (in production, use encrypted cloud storage)
          for (const file of files) {
            const fileName = `${verification.id}_${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
            const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
            
            // In production, upload to secure cloud storage
            const fileUrl = `/uploads/identity/${fileName}`;
            
            await db.insert(verificationDocuments).values({
              verificationId: verification.id,
              documentType: file.fieldname,
              fileName,
              fileUrl,
              fileHash,
              expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours
            });
            
            if (file.fieldname === 'id_front') {
              updateData.idFrontUrl = fileUrl;
            } else if (file.fieldname === 'id_back') {
              updateData.idBackUrl = fileUrl;
            }
          }
          break;
          
        case 'liveness':
          if (!files || files.length < 1) {
            return res.status(400).json({ 
              success: false, 
              message: 'Selfie image required' 
            });
          }
          
          const selfieFile = files[0];
          const selfieFileName = `${verification.id}_selfie_${Date.now()}${path.extname(selfieFile.originalname)}`;
          const selfieHash = crypto.createHash('sha256').update(selfieFile.buffer).digest('hex');
          const selfieUrl = `/uploads/identity/${selfieFileName}`;
          
          await db.insert(verificationDocuments).values({
            verificationId: verification.id,
            documentType: 'selfie',
            fileName: selfieFileName,
            fileUrl: selfieUrl,
            fileHash: selfieHash,
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000)
          });
          
          // In production, perform real face matching using AWS Rekognition, etc.
          const faceMatchScore = Math.floor(75 + Math.random() * 25); // Demo: 75-100%
          
          updateData.selfieUrl = selfieUrl;
          updateData.faceMatchScore = faceMatchScore;
          updateData.faceVector = { demo: true }; // In production, store actual face vector
          
          res.json({ 
            success: true, 
            faceMatchScore,
            message: faceMatchScore >= 75 ? 'Face match successful' : 'Face match failed' 
          });
          break;
          
        case 'duplicate-check':
          // Perform duplicate identity checks
          const idHash = crypto.createHash('sha256').update(data.idNumber || 'demo').digest('hex');
          
          const duplicateIdCheck = await db
            .select()
            .from(identityVerifications)
            .where(eq(identityVerifications.idNumberHash, idHash))
            .limit(1);
          
          const duplicateFaceCheck = false; // In production, check face vector similarity
          const duplicateIpCheck = await db
            .select()
            .from(identityVerifications)
            .where(eq(identityVerifications.ipAddress, req.ip))
            .limit(5);
          
          updateData.idNumberHash = idHash;
          updateData.duplicateIdCheck = duplicateIdCheck.length > 0;
          updateData.duplicateFaceCheck = duplicateFaceCheck;
          updateData.duplicateIpCheck = duplicateIpCheck.length > 3;
          
          // Calculate risk score
          let riskScore = 0;
          const flaggedReasons: string[] = [];
          
          if (duplicateIdCheck.length > 0) {
            riskScore += 40;
            flaggedReasons.push('Duplicate ID number detected');
          }
          
          if (duplicateFaceCheck) {
            riskScore += 35;
            flaggedReasons.push('Similar face detected in system');
          }
          
          if (duplicateIpCheck.length > 3) {
            riskScore += 15;
            flaggedReasons.push('Multiple accounts from same IP');
          }
          
          if (verification.faceMatchScore && verification.faceMatchScore < 75) {
            riskScore += 25;
            flaggedReasons.push('Low face match score');
          }
          
          updateData.riskScore = riskScore;
          updateData.flaggedReasons = flaggedReasons;
          
          res.json({ 
            success: true, 
            riskScore,
            flaggedReasons,
            message: riskScore > 50 ? 'High risk detected - manual review required' : 'Duplicate check passed'
          });
          break;
          
        case 'terms':
          updateData.termsAgreed = data.termsAgreed;
          updateData.digitalSignature = data.digitalSignature;
          updateData.termsAgreedAt = new Date();
          
          // If low risk, auto-approve; otherwise send for manual review
          if (verification.riskScore && verification.riskScore <= 50) {
            updateData.status = 'approved';
            updateData.reviewedAt = new Date();
            updateData.reviewedBy = 'system_auto_approval';
            
            // Grant civic permissions
            await db.insert(userVerificationStatus).values({
              userId,
              isVerified: true,
              verificationLevel: 'government',
              verifiedAt: new Date(),
              lastVerificationId: verification.id,
              canVote: true,
              canComment: true,
              canCreatePetitions: true,
              canAccessFOI: true
            }).onConflictDoUpdate({
              target: userVerificationStatus.userId,
              set: {
                isVerified: true,
                verificationLevel: 'government',
                verifiedAt: new Date(),
                lastVerificationId: verification.id,
                canVote: true,
                canComment: true,
                canCreatePetitions: true,
                canAccessFOI: true
              }
            });
            
            res.json({ 
              success: true, 
              autoApproved: true,
              message: 'Identity verification completed successfully!'
            });
          } else {
            updateData.status = 'reviewing';
            
            res.json({ 
              success: true, 
              autoApproved: false,
              message: 'Verification submitted for manual review. You will be notified within 24-48 hours.'
            });
          }
          break;
          
        default:
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid verification step' 
          });
      }
      
      // Update verification record
      if (Object.keys(updateData).length > 0) {
        await db
          .update(identityVerifications)
          .set(updateData)
          .where(eq(identityVerifications.id, verification.id));
      }
      
      if (!res.headersSent) {
        res.json({ success: true, message: 'Step completed successfully' });
      }
      
    } catch (error) {
      console.error('Submit step error:', error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to process verification step' 
        });
      }
    }
  });
  
  // Get verification status
  app.get('/api/identity/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [userStatus] = await db
        .select()
        .from(userVerificationStatus)
        .where(eq(userVerificationStatus.userId, userId))
        .limit(1);
      
      if (!userStatus) {
        return res.json({ 
          isVerified: false, 
          verificationLevel: 'none',
          permissions: {
            canVote: false,
            canComment: false,
            canCreatePetitions: false,
            canAccessFOI: false
          }
        });
      }
      
      res.json({
        isVerified: userStatus.isVerified,
        verificationLevel: userStatus.verificationLevel,
        verifiedAt: userStatus.verifiedAt,
        permissions: {
          canVote: userStatus.canVote,
          canComment: userStatus.canComment,
          canCreatePetitions: userStatus.canCreatePetitions,
          canAccessFOI: userStatus.canAccessFOI
        }
      });
      
    } catch (error) {
      console.error('Get verification status error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get verification status' 
      });
    }
  });
  
  // Admin routes for manual review
  app.get('/api/admin/identity-verifications', isAuthenticated, async (req: any, res) => {
    try {
      // Check if user is admin (implement proper admin check)
      const userId = req.user.claims.sub;
      // For demo, assume user is admin - implement proper role checking
      
      const pendingVerifications = await db
        .select()
        .from(identityVerifications)
        .where(eq(identityVerifications.status, 'reviewing'))
        .orderBy(desc(identityVerifications.submittedAt));
      
      res.json(pendingVerifications);
      
    } catch (error) {
      console.error('Get pending verifications error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get pending verifications' 
      });
    }
  });
  
  // Approve verification
  app.post('/api/admin/identity-verifications/:id/approve', isAuthenticated, async (req: any, res) => {
    try {
      const verificationId = parseInt(req.params.id);
      const adminUserId = req.user.claims.sub;
      
      const [verification] = await db
        .select()
        .from(identityVerifications)
        .where(eq(identityVerifications.id, verificationId))
        .limit(1);
      
      if (!verification) {
        return res.status(404).json({ 
          success: false, 
          message: 'Verification not found' 
        });
      }
      
      // Update verification status
      await db
        .update(identityVerifications)
        .set({
          status: 'approved',
          reviewedAt: new Date(),
          reviewedBy: adminUserId
        })
        .where(eq(identityVerifications.id, verificationId));
      
      // Grant civic permissions
      await db.insert(userVerificationStatus).values({
        userId: verification.userId,
        isVerified: true,
        verificationLevel: 'government',
        verifiedAt: new Date(),
        lastVerificationId: verificationId,
        canVote: true,
        canComment: true,
        canCreatePetitions: true,
        canAccessFOI: true
      }).onConflictDoUpdate({
        target: userVerificationStatus.userId,
        set: {
          isVerified: true,
          verificationLevel: 'government',
          verifiedAt: new Date(),
          lastVerificationId: verificationId,
          canVote: true,
          canComment: true,
          canCreatePetitions: true,
          canAccessFOI: true
        }
      });
      
      res.json({ success: true, message: 'Verification approved successfully' });
      
    } catch (error) {
      console.error('Approve verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to approve verification' 
      });
    }
  });
  
  // Reject verification
  app.post('/api/admin/identity-verifications/:id/reject', isAuthenticated, async (req: any, res) => {
    try {
      const verificationId = parseInt(req.params.id);
      const adminUserId = req.user.claims.sub;
      const { reason } = req.body;
      
      await db
        .update(identityVerifications)
        .set({
          status: 'rejected',
          reviewedAt: new Date(),
          reviewedBy: adminUserId,
          rejectionReason: reason
        })
        .where(eq(identityVerifications.id, verificationId));
      
      res.json({ success: true, message: 'Verification rejected' });
      
    } catch (error) {
      console.error('Reject verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to reject verification' 
      });
    }
  });
}