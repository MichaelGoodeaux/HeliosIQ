// packages/shared/src/types/security.ts

/**
 * Security-related types
 */
export interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  iterations: number;
}

export interface JWTPayload {
  sub: string;
  role: string;
  permissions: string[];
  exp: number;
  iat: number;
}

export interface SecurityContext {
  userId: string;
  role: string;
  permissions: string[];
  metadata?: Record<string, any>;
}