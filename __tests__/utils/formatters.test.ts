import { formatDateDisplay, formatDateDb, formatCurrency } from '../../src/utils/formatters';

describe('formatters utility', () => {
  describe('formatDateDisplay', () => {
    it('should format Date object to Indonesian local date string', () => {
      const date = new Date(2026, 6, 24); 
      const result = formatDateDisplay(date);
      expect(result).toContain('24');
      expect(result).toContain('2026');
    });

    it('should format ISO date string to Indonesian local date string', () => {
      const result = formatDateDisplay('2026-07-24T00:00:00.000Z');
      expect(result).toContain('24');
      expect(result).toContain('2026');
    });

    it('should return fallback when date is null or invalid', () => {
      expect(formatDateDisplay(null)).toBe('-');
      expect(formatDateDisplay(undefined)).toBe('-');
      expect(formatDateDisplay('invalid-date')).toBe('-');
      expect(formatDateDisplay(null, 'N/A')).toBe('N/A');
    });
  });

  describe('formatDateDb', () => {
    it('should format Date to YYYY-MM-DD format', () => {
      const date = new Date('2026-07-24T12:00:00.000Z');
      expect(formatDateDb(date)).toBe('2026-07-24');
    });

    it('should handle null, undefined, or invalid dates safely', () => {
      expect(formatDateDb(null)).toBe('');
      expect(formatDateDb(undefined)).toBe('');
      expect(formatDateDb('invalid-date')).toBe('');
      expect(formatDateDb(null, '1970-01-01')).toBe('1970-01-01');
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers to IDR currency format', () => {
      const formatted = formatCurrency(150000000);
      expect(formatted).toContain('150.000.000');
    });

    it('should return fallback for null or undefined values', () => {
      expect(formatCurrency(null)).toBe('-');
      expect(formatCurrency(undefined)).toBe('-');
      expect(formatCurrency(null, 'Rp 0')).toBe('Rp 0');
    });
  });
});
