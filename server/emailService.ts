import { randomBytes } from 'crypto';

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

/**
 * Send verification email (mock implementation for demo)
 * In production, integrate with SendGrid, AWS SES, or similar service
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    // Mock email sending for demo purposes
    console.log(`\n🔥 EMAIL VERIFICATION CODE 🔥`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Code: ${code}`);
    console.log(`⏰ Valid for 10 minutes`);
    console.log(`📝 Copy this code to verify your email\n`);
    
    // Also log to a more visible format
    console.warn(`VERIFICATION CODE FOR ${email}: ${code}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
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