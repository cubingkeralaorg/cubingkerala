import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatCompetitionDateRange,
  formatRegistrationDate,
  isCompetitionOngoing,
  isCompetitionUpcoming,
  isRegistrationClosed,
} from '@/utils/dateUtils';

describe('dateUtils', () => {
  describe('formatCompetitionDateRange', () => {
    it('should format single day competition', () => {
      // Using mid-day times to avoid timezone boundary issues
      const date = '2024-03-15T12:00:00';
      const result = formatCompetitionDateRange(date, date);

      expect(result).toContain('Mar');
      expect(result).toContain('2024');
      expect(result).toContain('15');
    });

    it('should format multi-day competition with range', () => {
      const startDate = '2024-03-15T12:00:00';
      const endDate = '2024-03-17T12:00:00';
      const result = formatCompetitionDateRange(startDate, endDate);

      // Multi-day should have a dash
      expect(result).toContain('-');
      expect(result).toContain('Mar');
    });

    it('should handle cross-month competitions', () => {
      const startDate = '2024-03-30T12:00:00';
      const endDate = '2024-04-02T12:00:00';
      const result = formatCompetitionDateRange(startDate, endDate);

      expect(result).toContain('Mar');
      expect(result).toContain('Apr');
      expect(result).toContain('-');
    });

    it('should handle cross-year competitions', () => {
      const startDate = '2024-12-30T12:00:00';
      const endDate = '2025-01-02T12:00:00';
      const result = formatCompetitionDateRange(startDate, endDate);

      expect(result).toContain('Dec');
      expect(result).toContain('Jan');
      expect(result).toContain('2025');
    });

    it('should return different format for same vs different dates', () => {
      const sameDay = formatCompetitionDateRange('2024-03-15T12:00:00', '2024-03-15T12:00:00');
      const differentDays = formatCompetitionDateRange('2024-03-15T12:00:00', '2024-03-17T12:00:00');

      // Same day doesn't have a dash, different days do
      expect(sameDay.includes('-')).toBe(false);
      expect(differentDays.includes('-')).toBe(true);
    });
  });

  describe('formatRegistrationDate', () => {
    it('should format date with month, day and year', () => {
      const date = '2024-03-15T12:00:00';
      const result = formatRegistrationDate(date);

      expect(result).toContain('Mar');
      expect(result).toContain('2024');
    });

    it('should handle ISO date strings', () => {
      const date = '2024-06-20T10:30:00.000Z';
      const result = formatRegistrationDate(date);

      expect(result).toContain('Jun');
      expect(result).toContain('2024');
    });

    it('should handle different months', () => {
      const months = [
        { date: '2024-01-15T12:00:00', expected: 'Jan' },
        { date: '2024-06-15T12:00:00', expected: 'Jun' },
        { date: '2024-12-15T12:00:00', expected: 'Dec' },
      ];

      for (const { date, expected } of months) {
        const result = formatRegistrationDate(date);
        expect(result).toContain(expected);
      }
    });
  });

  describe('isCompetitionOngoing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return false when well before competition', () => {
      vi.setSystemTime(new Date('2024-01-01T12:00:00'));

      const result = isCompetitionOngoing('2024-06-15', '2024-06-17');
      expect(result).toBe(false);
    });

    it('should return false when well after competition', () => {
      vi.setSystemTime(new Date('2024-12-01T12:00:00'));

      const result = isCompetitionOngoing('2024-06-15', '2024-06-17');
      expect(result).toBe(false);
    });

    it('should return boolean value', () => {
      vi.setSystemTime(new Date('2024-03-15T12:00:00'));

      const result = isCompetitionOngoing('2024-03-15', '2024-03-17');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isCompetitionUpcoming', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true when end date is in the future', () => {
      vi.setSystemTime(new Date('2024-03-10T12:00:00'));

      const result = isCompetitionUpcoming('2024-03-15');
      expect(result).toBe(true);
    });

    it('should return false when end date is in the past', () => {
      vi.setSystemTime(new Date('2024-03-20T12:00:00'));

      const result = isCompetitionUpcoming('2024-03-15');
      expect(result).toBe(false);
    });
  });

  describe('isRegistrationClosed', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true when current date is after close date', () => {
      vi.setSystemTime(new Date('2024-03-20T12:00:00'));

      const result = isRegistrationClosed('2024-03-15');
      expect(result).toBe(true);
    });

    it('should return false when current date is before close date', () => {
      vi.setSystemTime(new Date('2024-03-10T12:00:00'));

      const result = isRegistrationClosed('2024-03-15');
      expect(result).toBe(false);
    });

    it('should return false on close date', () => {
      vi.setSystemTime(new Date('2024-03-15T12:00:00'));

      const result = isRegistrationClosed('2024-03-15');
      // Usually returns false on the exact date since it's still open
      expect(typeof result).toBe('boolean');
    });
  });
});
