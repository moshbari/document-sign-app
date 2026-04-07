import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-key";

/**
 * Generate a unique token for document signing
 * This token is used in the signing URL and should be unique per signer
 */
export function generateSigningToken(): string {
  return uuidv4();
}

/**
 * Generate a JWT token for password reset or email verification
 */
export function generateJwtToken(
  payload: Record<string, any>,
  expiresIn: string = "24h"
): string {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify a JWT token
 */
export function verifyJwtToken(token: string): Record<string, any> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Generate a secure random token
 */
export function generateRandomToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
