// packages/shared/src/utils/security.ts

import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { SecurityContext } from '../types/security';
import { logger } from './logger';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Security utility class for encryption, JWT handling, and sanitization
 */
export class SecurityUtils {
  private static encryptionKey: string;

  /**
   * Initialize security utils with encryption key
   */
  static initialize(key: string): void {
    this.encryptionKey = key;
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  static encrypt(text: string): string {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }

      // Generate initialization vector and salt
      const iv = crypto.randomBytes(IV_LENGTH);
      const salt = crypto.randomBytes(SALT_LENGTH);

      // Create key using PBKDF2
      const key = crypto.pbkdf2Sync(
        this.encryptionKey,
        salt,
        100000, // iterations
        32,     // key length
        'sha512'
      );

      // Create cipher
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      
      // Encrypt the text
      const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
      ]);

      // Get authentication tag
      const tag = cipher.getAuthTag();

      // Combine all components
      const result = Buffer.concat([salt, iv, tag, encrypted]);
      
      return result.toString('base64');
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  static decrypt(encryptedText: string): string {
    try {
      if (!this.encryptionKey) {
        throw new Error('Encryption key not initialized');
      }

      // Convert from base64
      const buffer = Buffer.from(encryptedText, 'base64');

      // Extract components
      const salt = buffer.subarray(0, SALT_LENGTH);
      const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const tag = buffer.subarray(
        SALT_LENGTH + IV_LENGTH,
        SALT_LENGTH + IV_LENGTH + TAG_LENGTH
      );
      const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

      // Recreate key using PBKDF2
      const key = crypto.pbkdf2Sync(
        this.encryptionKey,
        salt,
        100000, // iterations
        32,     // key length
        'sha512'
      );

      // Create decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      // Decrypt the text
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Generate JWT token
   */
  static async generateToken(context: SecurityContext): Promise<string> {
    try {
      const secretKey = new TextEncoder().encode(this.encryptionKey);
      
      const jwt = await new SignJWT({
        sub: context.userId,
        role: context.role,
        permissions: context.permissions,
        metadata: context.metadata,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secretKey);

      return jwt;
    } catch (error) {
      logger.error('Token generation failed:', error);
      throw new Error('Failed to generate token');
    }
  }

  /**
   * Verify and decode JWT token
   */
  static async verifyToken(token: string): Promise<SecurityContext> {
    try {
      const secretKey = new TextEncoder().encode(this.encryptionKey);
      const { payload } = await jwtVerify(token, secretKey);
      
      return {
        userId: payload.sub as string,
        role: payload.role as string,
        permissions: payload.permissions as string[],
        metadata: payload.metadata as Record<string, any>,
      };
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw new Error('Invalid token');
    }
  }

  /**
   * Generate secure hash using SHA-512
   */
  static hash(data: string): string {
    return crypto
      .createHash('sha512')
      .update(data)
      .digest('hex');
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/[&'"]/g, '') // Remove potentially dangerous characters
      .trim();
  }

  /**
   * Generate secure random string
   */
  static generateSecureString(length: number = 32): string {
    return crypto
      .randomBytes(length)
      .toString('hex');
  }

  /**
   * Compare strings in constant time
   */
  static secureCompare(a: string, b: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(a),
      Buffer.from(b)
    );
  }

  /**
   * Validate security context
   */
  static validateContext(context: SecurityContext): boolean {
    return !!(
      context.userId &&
      context.role &&
      Array.isArray(context.permissions) &&
      context.permissions.length > 0
    );
  }
}