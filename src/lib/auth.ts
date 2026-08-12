import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AdminSession } from "@/types";

// ============================================================
// Authentication Utilities
// ============================================================

const AUTH_SECRET = process.env.AUTH_SECRET;
const COOKIE_NAME = "idverify_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

if (!AUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("AUTH_SECRET environment variable is required in production");
}

const SECRET = AUTH_SECRET ?? "dev-secret-change-in-production";

// --- Password Hashing ---

/**
 * Hash a plaintext password using bcrypt.
 * Cost factor: 12 (strong, ~300ms on modern hardware)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- Session Management ---

/**
 * Create a signed JWT session token for an admin.
 */
export function createSessionToken(payload: AdminSession): string {
  return jwt.sign(payload, SECRET, {
    expiresIn: SESSION_MAX_AGE,
    issuer: "idverify",
    audience: "admin",
  });
}

/**
 * Verify and decode a JWT session token.
 * Returns null if invalid or expired.
 * Logs the specific error for debugging (does not expose it to the client).
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const payload = jwt.verify(token, SECRET, {
      issuer: "idverify",
      audience: "admin",
    }) as AdminSession & jwt.JwtPayload;

    return {
      adminId: payload.adminId,
      email: payload.email,
      name: payload.name,
    };
  } catch (err) {
    // Log for debugging — the error is never sent to the client
    if (process.env.NODE_ENV === "development") {
      console.warn("[auth] Session token verification failed:", (err as Error).message);
    }
    return null;
  }
}

// --- Cookie Helpers ---

/**
 * Set the secure session cookie on the response.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Delete the session cookie (logout).
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get the current admin session from the cookie.
 * Returns null if not authenticated.
 */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifySessionToken(token);
}

/**
 * Require an active admin session.
 * Throws if not authenticated — use in Server Actions or Route Handlers.
 */
export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

// --- Rate Limiting (in-memory, for serverless) ---

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory rate limiter.
 * Returns { allowed: true } or { allowed: false, retryAfter: number }.
 *
 * Note: In a multi-instance deployment, use Redis instead.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true };
}

/**
 * Clean up expired rate limit entries.
 * Call periodically to prevent memory leaks.
 */
export function cleanRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}
