/**
 * Data Encryption Utility
 * Feature: skids-e2e-deployment
 * Validates: Requirements 8.2
 * Property 12: Data Encryption
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;

/**
 * Get encryption key from environment or generate one
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }
  
  // Derive key using scrypt
  const salt = Buffer.from(key.slice(0, SALT_LENGTH));
  return scryptSync(key, salt, KEY_LENGTH);
}

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey();
    const iv = randomBytes(IV_LENGTH);
    
    const cipher = createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV + encrypted data + auth tag
    const combined = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'hex'),
      authTag,
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt sensitive data
 */
export function decrypt(ciphertext: string): string {
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(ciphertext, 'base64');
    
    // Extract IV, encrypted data, and auth tag
    const iv = combined.slice(0, IV_LENGTH);
    const authTag = combined.slice(-TAG_LENGTH);
    const encrypted = combined.slice(IV_LENGTH, -TAG_LENGTH);
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Hash sensitive data (one-way)
 */
export function hash(data: string): string {
  const { createHash } = require('crypto');
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Encrypt object fields
 */
export function encryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const encrypted = { ...obj };
  
  for (const field of fields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field] as string) as any;
    }
  }
  
  return encrypted;
}

/**
 * Decrypt object fields
 */
export function decryptFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const decrypted = { ...obj };
  
  for (const field of fields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        decrypted[field] = decrypt(decrypted[field] as string) as any;
      } catch (error) {
        // If decryption fails, field might not be encrypted
        // Leave as is
      }
    }
  }
  
  return decrypted;
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  
  const visible = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars);
  
  return masked + visible;
}

/**
 * Check if data is encrypted
 */
export function isEncrypted(data: string): boolean {
  try {
    // Try to decode as base64
    const decoded = Buffer.from(data, 'base64');
    
    // Check if it has the expected length (IV + data + tag)
    return decoded.length >= IV_LENGTH + TAG_LENGTH;
  } catch {
    return false;
  }
}

/**
 * Encrypt file buffer
 */
export function encryptFile(buffer: Buffer): Buffer {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final(),
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine IV + encrypted data + auth tag
  return Buffer.concat([iv, encrypted, authTag]);
}

/**
 * Decrypt file buffer
 */
export function decryptFile(buffer: Buffer): Buffer {
  const key = getEncryptionKey();
  
  // Extract IV, encrypted data, and auth tag
  const iv = buffer.slice(0, IV_LENGTH);
  const authTag = buffer.slice(-TAG_LENGTH);
  const encrypted = buffer.slice(IV_LENGTH, -TAG_LENGTH);
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
}
