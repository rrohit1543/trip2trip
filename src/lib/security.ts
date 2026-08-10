import { SecurityEvent } from '../types';

// Simple mock password hashing helper
export function hashPassword(plainText: string): string {
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `pwd_hash_${Math.abs(hash)}_${plainText.length}`;
}

// Generate secure 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Input Validators
export function isValidEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input.trim());
}

export function isValidMobile(input: string): boolean {
  const mobileRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
  return mobileRegex.test(input.trim().replace(/\s+/g, ''));
}

// Rate Limiter Store (In-Memory)
const rateLimitTracker: Record<string, { count: number; firstAttempt: number }> = {};

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitTracker[key];

  if (!record) {
    rateLimitTracker[key] = { count: 1, firstAttempt: now };
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (now - record.firstAttempt > windowMs) {
    rateLimitTracker[key] = { count: 1, firstAttempt: now };
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// Create Security Log Entry
export function createSecurityLog(
  eventType: SecurityEvent['eventType'],
  identifier: string,
  details: string
): SecurityEvent {
  return {
    id: `sec_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    eventType,
    identifier,
    details,
  };
}
