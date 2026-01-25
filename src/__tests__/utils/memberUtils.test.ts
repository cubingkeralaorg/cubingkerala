import { describe, it, expect } from 'vitest';
import {
  getTotalMedals,
  capitalizeRole,
  sortMembersByName,
  getRoleBadgeColor,
} from '@/utils/memberUtils';

describe('memberUtils', () => {
  describe('getTotalMedals', () => {
    it('should return 0 when memberDetails is undefined', () => {
      expect(getTotalMedals(undefined)).toBe(0);
    });

    it('should return 0 when memberDetails is null', () => {
      expect(getTotalMedals(null as any)).toBe(0);
    });

    it('should calculate total medals correctly', () => {
      const memberDetails = {
        medals: {
          gold: 5,
          silver: 3,
          bronze: 2,
        },
      } as any;

      expect(getTotalMedals(memberDetails)).toBe(10);
    });

    it('should handle missing medal values', () => {
      const memberDetails = {
        medals: {
          gold: 5,
          // silver and bronze are undefined
        },
      } as any;

      expect(getTotalMedals(memberDetails)).toBe(5);
    });

    it('should handle zero medals', () => {
      const memberDetails = {
        medals: {
          gold: 0,
          silver: 0,
          bronze: 0,
        },
      } as any;

      expect(getTotalMedals(memberDetails)).toBe(0);
    });

    it('should handle only one type of medal', () => {
      expect(
        getTotalMedals({ medals: { gold: 10, silver: 0, bronze: 0 } } as any)
      ).toBe(10);
      expect(
        getTotalMedals({ medals: { gold: 0, silver: 7, bronze: 0 } } as any)
      ).toBe(7);
      expect(
        getTotalMedals({ medals: { gold: 0, silver: 0, bronze: 3 } } as any)
      ).toBe(3);
    });

    it('should handle large medal counts', () => {
      const memberDetails = {
        medals: {
          gold: 100,
          silver: 200,
          bronze: 300,
        },
      } as any;

      expect(getTotalMedals(memberDetails)).toBe(600);
    });
  });

  describe('capitalizeRole', () => {
    it('should capitalize first letter of role', () => {
      expect(capitalizeRole('member')).toBe('Member');
      expect(capitalizeRole('organiser')).toBe('Organiser');
      expect(capitalizeRole('co-founder')).toBe('Co-founder');
    });

    it('should handle already capitalized roles', () => {
      expect(capitalizeRole('Member')).toBe('Member');
    });

    it('should handle single character roles', () => {
      expect(capitalizeRole('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(capitalizeRole('')).toBe('');
    });

    it('should handle mixed case roles', () => {
      expect(capitalizeRole('mEMBER')).toBe('MEMBER');
    });
  });

  describe('sortMembersByName', () => {
    it('should sort members alphabetically by name', () => {
      const members = [
        { name: 'Charlie' },
        { name: 'Alice' },
        { name: 'Bob' },
      ];

      const sorted = sortMembersByName(members);

      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('Bob');
      expect(sorted[2].name).toBe('Charlie');
    });

    it('should not mutate original array', () => {
      const members = [
        { name: 'Charlie' },
        { name: 'Alice' },
      ];
      const originalFirst = members[0].name;

      sortMembersByName(members);

      expect(members[0].name).toBe(originalFirst);
    });

    it('should handle empty array', () => {
      expect(sortMembersByName([])).toEqual([]);
    });

    it('should handle single member', () => {
      const members = [{ name: 'Alice' }];
      const sorted = sortMembersByName(members);

      expect(sorted).toHaveLength(1);
      expect(sorted[0].name).toBe('Alice');
    });

    it('should handle case-insensitive sorting', () => {
      const members = [
        { name: 'bob' },
        { name: 'Alice' },
        { name: 'CHARLIE' },
      ];

      const sorted = sortMembersByName(members);

      // localeCompare is case-insensitive by default
      expect(sorted[0].name).toBe('Alice');
      expect(sorted[1].name).toBe('bob');
      expect(sorted[2].name).toBe('CHARLIE');
    });

    it('should preserve other properties', () => {
      const members = [
        { name: 'Bob', role: 'member', wcaid: '2020BOB01' },
        { name: 'Alice', role: 'organiser', wcaid: '2020ALICE01' },
      ];

      const sorted = sortMembersByName(members);

      expect(sorted[0]).toEqual({
        name: 'Alice',
        role: 'organiser',
        wcaid: '2020ALICE01',
      });
    });

    it('should handle names with special characters', () => {
      const members = [
        { name: 'Zürich' },
        { name: 'Andre' },
        { name: 'André' },
      ];

      const sorted = sortMembersByName(members);
      
      // Just verify it doesn't throw
      expect(sorted).toHaveLength(3);
    });
  });

  describe('getRoleBadgeColor', () => {
    it('should return blue for member role', () => {
      expect(getRoleBadgeColor('member')).toBe('text-blue-300');
    });

    it('should return green for organiser role', () => {
      expect(getRoleBadgeColor('organiser')).toBe('text-green-400');
    });

    it('should return red for co-founder role', () => {
      expect(getRoleBadgeColor('co-founder')).toBe('text-red-500');
    });

    it('should return white for unknown role', () => {
      expect(getRoleBadgeColor('admin')).toBe('text-white');
      expect(getRoleBadgeColor('unknown')).toBe('text-white');
      expect(getRoleBadgeColor('')).toBe('text-white');
    });

    it('should be case sensitive', () => {
      expect(getRoleBadgeColor('Member')).toBe('text-white');
      expect(getRoleBadgeColor('ORGANISER')).toBe('text-white');
    });
  });
});
