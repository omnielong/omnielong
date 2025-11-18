import { describe, it, expect } from 'vitest';
import {
  hashPIN,
  verifyPIN,
  encrypt,
  decrypt,
  generateRandomPIN,
  isValidPINFormat,
  sanitizeInput,
  isValidLength,
} from './security';

describe('Security Utils', () => {
  describe('PIN Hashing', () => {
    it('should hash a PIN', async () => {
      const pin = '1234';
      const hashed = await hashPIN(pin);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(pin);
      expect(hashed.length).toBeGreaterThan(20); // bcrypt hashes are long
    });

    it('should verify correct PIN', async () => {
      const pin = '1234';
      const hashed = await hashPIN(pin);
      const isValid = await verifyPIN(pin, hashed);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect PIN', async () => {
      const pin = '1234';
      const hashed = await hashPIN(pin);
      const isValid = await verifyPIN('5678', hashed);

      expect(isValid).toBe(false);
    });

    it('should create different hashes for same PIN (salt)', async () => {
      const pin = '1234';
      const hash1 = await hashPIN(pin);
      const hash2 = await hashPIN(pin);

      expect(hash1).not.toBe(hash2);
      // But both should verify correctly
      expect(await verifyPIN(pin, hash1)).toBe(true);
      expect(await verifyPIN(pin, hash2)).toBe(true);
    });
  });

  describe('Encryption/Decryption', () => {
    it('should encrypt and decrypt a string', () => {
      const text = 'my-secret-api-key';
      const encrypted = encrypt(text);
      const decrypted = decrypt(encrypted);

      expect(encrypted).not.toBe(text);
      expect(decrypted).toBe(text);
    });

    it('should produce different ciphertext than plaintext', () => {
      const text = 'api-key-12345';
      const encrypted = encrypt(text);

      expect(encrypted).not.toBe(text);
    });

    it('should handle empty string', () => {
      const encrypted = encrypt('');
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe('');
    });

    it('should encrypt with custom key', () => {
      const text = 'secret';
      const customKey = 'custom-encryption-key-32chars!!';
      const encrypted = encrypt(text, customKey);
      const decrypted = decrypt(encrypted, customKey);

      expect(decrypted).toBe(text);
    });

    it('should fail to decrypt with wrong key', () => {
      const text = 'secret';
      const key1 = 'key1-32characters-long-string!!';
      const key2 = 'key2-32characters-long-string!!';

      const encrypted = encrypt(text, key1);
      const decrypted = decrypt(encrypted, key2);

      expect(decrypted).not.toBe(text);
    });
  });

  describe('PIN Generation and Validation', () => {
    it('should generate random PIN', () => {
      const pin = generateRandomPIN();

      expect(pin).toBeDefined();
      expect(pin.length).toBe(4);
      expect(/^\d{4}$/.test(pin)).toBe(true);
    });

    it('should generate different PINs', () => {
      const pin1 = generateRandomPIN();
      const pin2 = generateRandomPIN();

      // Very unlikely to be the same (1/9000 chance)
      expect(pin1).toBeDefined();
      expect(pin2).toBeDefined();
    });

    it('should validate correct PIN format', () => {
      expect(isValidPINFormat('1234')).toBe(true);
      expect(isValidPINFormat('123456')).toBe(true);
      expect(isValidPINFormat('9999')).toBe(true);
    });

    it('should reject invalid PIN format', () => {
      expect(isValidPINFormat('123')).toBe(false); // Too short
      expect(isValidPINFormat('1234567')).toBe(false); // Too long
      expect(isValidPINFormat('abcd')).toBe(false); // Not numeric
      expect(isValidPINFormat('12a4')).toBe(false); // Contains letter
      expect(isValidPINFormat('')).toBe(false); // Empty
    });
  });

  describe('Input Sanitization', () => {
    it('should remove script tags', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(malicious);

      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).toBe('scriptalert("xss")/script');
    });

    it('should remove javascript: protocol', () => {
      const malicious = 'javascript:alert("xss")';
      const sanitized = sanitizeInput(malicious);

      expect(sanitized).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const malicious = 'onclick=alert("xss")';
      const sanitized = sanitizeInput(malicious);

      expect(sanitized).not.toContain('onclick=');
    });

    it('should trim whitespace', () => {
      const input = '  hello  ';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe('hello');
    });

    it('should handle normal text', () => {
      const input = 'normal text 123';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe(input);
    });
  });

  describe('Input Length Validation', () => {
    it('should accept valid length', () => {
      expect(isValidLength('hello')).toBe(true);
      expect(isValidLength('a'.repeat(1000))).toBe(true);
    });

    it('should reject excessive length', () => {
      expect(isValidLength('a'.repeat(1001))).toBe(false);
    });

    it('should accept custom max length', () => {
      expect(isValidLength('hello', 10)).toBe(true);
      expect(isValidLength('hello world', 10)).toBe(false);
    });
  });
});
