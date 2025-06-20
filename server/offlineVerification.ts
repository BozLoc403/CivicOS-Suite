import { randomBytes, createHash } from 'crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Offline verification methods that don't require external APIs
 * All verification happens locally without third-party services
 */

// Store offline verification data
const offlineVerifications = new Map<string, {
  challenges: any[];
  completed: Set<string>;
  timestamp: number;
}>();

/**
 * Generate mathematical challenge for offline verification
 */
export function generateMathChallenge(): { question: string; answer: number; id: string } {
  const operations = ['+', '-', '*'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number, answer: number;
  
  switch (op) {
    case '+':
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
      answer = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 100) + 50;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
      break;
    default:
      num1 = 5; num2 = 3; answer = 8;
  }
  
  return {
    question: `${num1} ${op} ${num2} = ?`,
    answer,
    id: randomBytes(8).toString('hex')
  };
}

/**
 * Generate pattern recognition challenge
 */
export function generatePatternChallenge(): { pattern: number[]; nextNumber: number; id: string } {
  const patterns = [
    { sequence: [2, 4, 6, 8], next: 10, type: 'even numbers' },
    { sequence: [1, 3, 5, 7], next: 9, type: 'odd numbers' },
    { sequence: [1, 2, 4, 8], next: 16, type: 'powers of 2' },
    { sequence: [1, 4, 9, 16], next: 25, type: 'perfect squares' },
    { sequence: [3, 6, 9, 12], next: 15, type: 'multiples of 3' },
    { sequence: [5, 10, 15, 20], next: 25, type: 'multiples of 5' }
  ];
  
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  return {
    pattern: pattern.sequence,
    nextNumber: pattern.next,
    id: randomBytes(8).toString('hex')
  };
}

/**
 * Generate offline TOTP secret and QR code (no external API)
 */
export async function generateOfflineTOTP(email: string): Promise<{ secret: string; qrCode: string; backupCodes: string[] }> {
  const secret = speakeasy.generateSecret({
    name: `CivicOS (${email})`,
    issuer: 'CivicOS Digital Democracy'
  });
  
  // Generate QR code locally
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');
  
  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () => 
    randomBytes(4).toString('hex').toUpperCase().match(/.{2}/g)?.join('-') || ''
  );
  
  return {
    secret: secret.base32 || '',
    qrCode: qrCodeUrl,
    backupCodes
  };
}

/**
 * Verify TOTP token offline
 */
export function verifyOfflineTOTP(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps for clock drift
  });
}

/**
 * Generate browser fingerprint challenge (no external API)
 */
export function generateBrowserFingerprint(): { challenge: string; expectedHash: string } {
  const challenge = randomBytes(16).toString('hex');
  const expectedHash = createHash('sha256').update(challenge + 'civicos').digest('hex');
  
  return { challenge, expectedHash };
}

/**
 * Initialize offline verification session
 */
export function initializeOfflineVerification(email: string): {
  mathChallenge: ReturnType<typeof generateMathChallenge>;
  patternChallenge: ReturnType<typeof generatePatternChallenge>;
  browserChallenge: ReturnType<typeof generateBrowserFingerprint>;
  sessionId: string;
} {
  const sessionId = randomBytes(16).toString('hex');
  
  const challenges = {
    mathChallenge: generateMathChallenge(),
    patternChallenge: generatePatternChallenge(),
    browserChallenge: generateBrowserFingerprint(),
    sessionId
  };
  
  offlineVerifications.set(sessionId, {
    challenges: [challenges.mathChallenge, challenges.patternChallenge],
    completed: new Set(),
    timestamp: Date.now()
  });
  
  // Clean up old sessions (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, value] of offlineVerifications.entries()) {
    if (value.timestamp < oneHourAgo) {
      offlineVerifications.delete(key);
    }
  }
  
  return challenges;
}

/**
 * Verify offline challenge response
 */
export function verifyOfflineChallenge(sessionId: string, challengeId: string, response: any): boolean {
  const session = offlineVerifications.get(sessionId);
  if (!session) return false;
  
  const challenge = session.challenges.find(c => c.id === challengeId);
  if (!challenge) return false;
  
  let isValid = false;
  
  if ('answer' in challenge) {
    // Math challenge
    isValid = parseInt(response) === challenge.answer;
  } else if ('nextNumber' in challenge) {
    // Pattern challenge
    isValid = parseInt(response) === challenge.nextNumber;
  }
  
  if (isValid) {
    session.completed.add(challengeId);
  }
  
  return isValid;
}

/**
 * Check if all offline challenges are completed
 */
export function isOfflineVerificationComplete(sessionId: string): boolean {
  const session = offlineVerifications.get(sessionId);
  if (!session) return false;
  
  return session.completed.size >= session.challenges.length;
}

/**
 * Clean up verification session
 */
export function cleanupOfflineVerification(sessionId: string): void {
  offlineVerifications.delete(sessionId);
}