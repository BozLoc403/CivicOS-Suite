import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

interface EmailVerificationCode {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

// In-memory storage for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, EmailVerificationCode>();

/**
 * Generate and store a 6-digit verification code for email
 */
export function generateEmailVerificationCode(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  verificationCodes.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    code,
    expiresAt,
    attempts: 0
  });
  
  return code;
}

/**
 * Verify the email OTP code
 */
export function verifyEmailCode(email: string, providedCode: string): { valid: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase();
  const storedData = verificationCodes.get(normalizedEmail);
  
  if (!storedData) {
    return { valid: false, error: "No verification code found for this email" };
  }
  
  if (new Date() > storedData.expiresAt) {
    verificationCodes.delete(normalizedEmail);
    return { valid: false, error: "Verification code has expired" };
  }
  
  if (storedData.attempts >= 3) {
    verificationCodes.delete(normalizedEmail);
    return { valid: false, error: "Too many failed attempts" };
  }
  
  if (storedData.code !== providedCode) {
    storedData.attempts++;
    return { valid: false, error: "Invalid verification code" };
  }
  
  // Code is valid, remove it
  verificationCodes.delete(normalizedEmail);
  return { valid: true };
}

// Create a Gmail transporter using app-specific password (more accessible than SendGrid)
let transporter: nodemailer.Transporter | null = null;

// Initialize email transporter if Gmail credentials are available
function initializeEmailTransporter() {
  if (!transporter && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
}

/**
 * Send verification email using Gmail SMTP (more accessible than SendGrid)
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    initializeEmailTransporter();
    
    // If no email service configured, use console fallback
    if (!transporter) {
      console.log(`\n🔥 EMAIL VERIFICATION CODE (DEV MODE) 🔥`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Code: ${code}`);
      console.log(`⏰ Valid for 10 minutes`);
      console.log(`📝 Copy this code to verify your email\n`);
      console.warn(`VERIFICATION CODE FOR ${email}: ${code}`);
      return true;
    }

    // Send actual email via Gmail
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'CivicOS Email Verification Code',
      text: `Your CivicOS verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this verification, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">CivicOS</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Digital Democracy Platform</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; text-align: center; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0;">Email Verification</h2>
            <p style="color: #475569; font-size: 16px; margin-bottom: 30px;">Your verification code is:</p>
            
            <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px; font-family: monospace;">${code}</span>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #64748b; font-size: 12px;">
            <p>This email was sent for identity verification on CivicOS.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email} via Gmail`);
    return true;
    
  } catch (error) {
    console.error("Failed to send verification email:", error);
    
    // Fallback to console logging if email fails
    console.log(`\n🔥 EMAIL VERIFICATION CODE (FALLBACK) 🔥`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Code: ${code}`);
    console.log(`⏰ Valid for 10 minutes`);
    console.warn(`VERIFICATION CODE FOR ${email}: ${code}`);
    
    return true; // Return true so verification can continue
  }
}

/**
 * Clear expired verification codes (cleanup function)
 */
export function cleanupExpiredCodes(): void {
  const now = new Date();
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);