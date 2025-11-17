import bcrypt from 'bcryptjs';

/**
 * Numero di salt rounds per bcrypt (10 è un buon compromesso tra sicurezza e performance)
 */
const SALT_ROUNDS = 10;

/**
 * Chiave di encryption (in produzione dovrebbe venire da variabile d'ambiente)
 * NOTA: Questa è una chiave di esempio. In produzione usare VITE_ENCRYPTION_KEY da .env
 */
const getEncryptionKey = (): string => {
  return import.meta.env.VITE_ENCRYPTION_KEY || 'default-32-char-encryption-key';
};

/**
 * Hash di un PIN usando bcrypt
 * @param pin - PIN in chiaro
 * @returns Promise con PIN hashato
 */
export const hashPIN = async (pin: string): Promise<string> => {
  try {
    const hashedPIN = await bcrypt.hash(pin, SALT_ROUNDS);
    return hashedPIN;
  } catch (error) {
    console.error('Error hashing PIN:', error);
    throw new Error('Failed to hash PIN');
  }
};

/**
 * Verifica un PIN contro il suo hash
 * @param pin - PIN in chiaro da verificare
 * @param hashedPIN - PIN hashato salvato
 * @returns Promise<boolean> - true se il PIN è corretto
 */
export const verifyPIN = async (pin: string, hashedPIN: string): Promise<boolean> => {
  try {
    const isValid = await bcrypt.compare(pin, hashedPIN);
    return isValid;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
};

/**
 * Simple XOR encryption per API keys (basic obfuscation)
 * NOTA: Per encryption più robusta in produzione, usare crypto-js o simili
 * Questa implementazione serve come protezione base contro lettura diretta dal localStorage
 *
 * @param text - Testo da criptare
 * @param key - Chiave di encryption
 * @returns Testo criptato in base64
 */
export const encrypt = (text: string, key?: string): string => {
  const encryptionKey = key || getEncryptionKey();
  const encrypted = text
    .split('')
    .map((char, i) => {
      const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    })
    .join('');

  // Encode to base64 for safe storage
  return btoa(encrypted);
};

/**
 * Decrypt di un testo criptato con XOR
 *
 * @param encryptedText - Testo criptato in base64
 * @param key - Chiave di decryption
 * @returns Testo in chiaro
 */
export const decrypt = (encryptedText: string, key?: string): string => {
  try {
    const encryptionKey = key || getEncryptionKey();
    // Decode from base64
    const encrypted = atob(encryptedText);

    const decrypted = encrypted
      .split('')
      .map((char, i) => {
        const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
        return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
      })
      .join('');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting:', error);
    return '';
  }
};

/**
 * Genera un PIN casuale a 4 cifre
 * @returns PIN a 4 cifre
 */
export const generateRandomPIN = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Valida formato PIN (deve essere 4-6 cifre numeriche)
 * @param pin - PIN da validare
 * @returns boolean
 */
export const isValidPINFormat = (pin: string): boolean => {
  return /^\d{4,6}$/.test(pin);
};

/**
 * Sanitize input per prevenire injection attacks
 * @param input - Input da sanitizzare
 * @returns Input sanitizzato
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

/**
 * Valida lunghezza massima input per prevenire DoS
 * @param input - Input da validare
 * @param maxLength - Lunghezza massima (default: 1000)
 * @returns boolean
 */
export const isValidLength = (input: string, maxLength: number = 1000): boolean => {
  return input.length <= maxLength;
};
