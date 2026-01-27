import { describe, it, expect } from 'vitest';
import {
  convertMillisecondsToTime,
  convertMbldToMinutes,
  formatResult,
  formatEventResult,
} from '@/utils/wcaFormatters';

describe('wcaFormatters', () => {
  describe('convertMillisecondsToTime', () => {
    describe('Basic Conversions', () => {
      it('should convert centiseconds to seconds for times under a minute', () => {
        expect(convertMillisecondsToTime(1234)).toBe('12.34');
        expect(convertMillisecondsToTime(534)).toBe('5.34');
        expect(convertMillisecondsToTime(5999)).toBe('59.99');
      });

      it('should handle times exactly at minute boundary', () => {
        expect(convertMillisecondsToTime(6000)).toBe('1.00.00');
      });

      it('should convert times over a minute correctly', () => {
        expect(convertMillisecondsToTime(7523)).toBe('1.15.23');
        expect(convertMillisecondsToTime(12345)).toBe('2.03.45');
      });

      it('should pad seconds with leading zero when needed', () => {
        expect(convertMillisecondsToTime(6312)).toBe('1.03.12');
        expect(convertMillisecondsToTime(6012)).toBe('1.00.12');
      });
    });

    describe('Edge Cases', () => {
      it('should return empty string for Infinity', () => {
        expect(convertMillisecondsToTime(Infinity)).toBe('');
      });

      it('should return DNF for negative values', () => {
        expect(convertMillisecondsToTime(-1)).toBe('DNF');
        expect(convertMillisecondsToTime(-100)).toBe('DNF');
      });

      it('should handle zero', () => {
        expect(convertMillisecondsToTime(0)).toBe('0.00');
      });

      it('should handle very small times', () => {
        expect(convertMillisecondsToTime(1)).toBe('0.01');
        expect(convertMillisecondsToTime(10)).toBe('0.10');
        expect(convertMillisecondsToTime(100)).toBe('1.00');
      });

      it('should handle very long times', () => {
        const tenMinutes = 60000; // 10 minutes in centiseconds
        const result = convertMillisecondsToTime(tenMinutes);
        expect(result).toContain('10');
      });
    });
  });

  describe('convertMbldToMinutes', () => {
    it('should return empty string for Infinity', () => {
      expect(convertMbldToMinutes(Infinity)).toBe('');
    });

    it('should parse MBLD result correctly', () => {
      // MBLD encoding: 0DDTTTTTMM
      // DD = 99 - (points)
      // TTTTT = time in seconds
      // MM = missed
      // Points = solved - missed
      
      // Example: solved 10/12 in 30:00 (1800 seconds)
      // DD = 99 - 8 = 91 (points = 10 - 2 = 8)
      // TTTTT = 01800
      // MM = 02
      const result = convertMbldToMinutes(91018002);
      expect(result).toContain('/');
    });

    it('should format time as minutes:seconds', () => {
      // A simple test case
      const result = convertMbldToMinutes(91018002);
      expect(result).toMatch(/\d+\/\d+\s\d+\.\d+/);
    });

    it('should handle perfect solve (no missed)', () => {
      // solved 5/5 in 10:00 (600 seconds)
      // DD = 99 - 5 = 94
      // TTTTT = 00600
      // MM = 00
      const result = convertMbldToMinutes(94006000);
      expect(result).toContain('5/5');
    });
  });

  describe('formatResult', () => {
    describe('Standard Events', () => {
      it('should format regular event results', () => {
        const result = { best: 1234 };
        expect(formatResult(result, '333', 'single')).toBe('12.34');
      });

      it('should return empty string for null result', () => {
        expect(formatResult(null, '333', 'single')).toBe('');
        expect(formatResult(undefined, '333', 'single')).toBe('');
      });

      it('should handle results with no best', () => {
        const result = { best: undefined };
        expect(formatResult(result, '333', 'single')).toBe('');
      });
    });

    describe('3x3 Fewest Moves (333fm)', () => {
      it('should return move count as string for single', () => {
        const result = { best: 28 };
        expect(formatResult(result, '333fm', 'single')).toBe('28');
      });

      it('should format average results normally', () => {
        const result = { best: 2800 }; // 28.00 moves average
        expect(formatResult(result, '333fm', 'average')).toBe('28.00');
      });
    });

    describe('Multi-Blind (333mbf)', () => {
      it('should format MBLD results', () => {
        const result = { best: 91018002 };
        const formatted = formatResult(result, '333mbf', 'single');
        expect(formatted).toContain('/');
      });
    });
  });

  describe('formatEventResult', () => {
    describe('Standard Events', () => {
      it('should format regular results', () => {
        expect(formatEventResult(1234, '333')).toBe('12.34');
        expect(formatEventResult(5678, '222')).toBe('56.78');
      });

      it('should return null for undefined best', () => {
        expect(formatEventResult(undefined, '333')).toBeNull();
      });

      it('should return null for zero best', () => {
        expect(formatEventResult(0, '333')).toBeNull();
      });
    });

    describe('Multi-Blind', () => {
      it('should format MBLD results correctly', () => {
        const result = formatEventResult(91018002, '333mbf');
        expect(result).toContain('/');
      });
    });

    describe('Fewest Moves', () => {
      it('should return move count as string', () => {
        expect(formatEventResult(28, '333fm')).toBe('28');
        expect(formatEventResult(31, '333fm')).toBe('31');
      });
    });

    describe('All Event Types', () => {
      it('should handle all standard WCA events', () => {
        const events = ['222', '333', '444', '555', '666', '777', 'sq1', 'skewb', 'pyram', 'minx', 'clock'];
        
        for (const eventId of events) {
          expect(formatEventResult(1234, eventId)).toBe('12.34');
        }
      });
    });
  });
});
