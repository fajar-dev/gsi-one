import { getUserInitials } from '../../src/utils/userHelpers';

describe('userHelpers - getUserInitials', () => {
  it('should return initials of full name', () => {
    expect(getUserInitials('Budi Santoso')).toBe('BS');
  });

  it('should take first 2 initials for long names', () => {
    expect(getUserInitials('Ahmad Budi Santoso')).toBe('AB');
  });

  it('should handle single word name', () => {
    expect(getUserInitials('Admin')).toBe('A');
  });

  it('should return "?" for null or undefined input', () => {
    expect(getUserInitials(null)).toBe('?');
    expect(getUserInitials(undefined)).toBe('?');
    expect(getUserInitials('')).toBe('?');
  });
});
