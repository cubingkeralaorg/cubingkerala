import { describe, it, expect } from 'vitest';
import { extractFirstName } from '@/utils/nameUtils';

describe('nameUtils', () => {
  describe('extractFirstName', () => {
    it('should return full name when no parentheses', () => {
      expect(extractFirstName('John Doe')).toBe('John Doe');
    });

    it('should extract name before parentheses', () => {
      expect(extractFirstName('John Doe (Johnny)')).toBe('John Doe ');
    });

    it('should handle names with nickname in parentheses', () => {
      expect(extractFirstName('Feliks Zemdegs (Faz)')).toBe('Feliks Zemdegs ');
    });

    it('should handle names with country in parentheses', () => {
      expect(extractFirstName('Max Park (USA)')).toBe('Max Park ');
    });

    it('should handle empty string', () => {
      expect(extractFirstName('')).toBe('');
    });

    it('should handle name with only parentheses content', () => {
      expect(extractFirstName('(nickname)')).toBe('');
    });

    it('should handle multiple parentheses (only first split)', () => {
      expect(extractFirstName('Name (First) (Second)')).toBe('Name ');
    });

    it('should handle names with special characters', () => {
      expect(extractFirstName('José García (Pepe)')).toBe('José García ');
    });

    it('should handle single word names', () => {
      expect(extractFirstName('Max')).toBe('Max');
    });

    it('should handle names with nested parentheses', () => {
      // This edge case just tests the basic split behavior
      expect(extractFirstName('Name (outer (inner))')).toBe('Name ');
    });
  });
});
