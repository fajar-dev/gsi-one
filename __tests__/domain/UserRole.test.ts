import { UserRoleEnum, isInternalRole, canEditProjectRole } from '../../src/domain/enums/UserRole';

describe('UserRole Enum & Helpers', () => {
  describe('UserRoleEnum values', () => {
    it('should have correct role string values', () => {
      expect(UserRoleEnum.ADMIN).toBe('admin');
      expect(UserRoleEnum.MARKETING).toBe('marketing');
      expect(UserRoleEnum.ENGINEER).toBe('engineer');
      expect(UserRoleEnum.CLIENT).toBe('client');
    });
  });

  describe('isInternalRole', () => {
    it('should return true for admin, marketing, and engineer roles', () => {
      expect(isInternalRole(UserRoleEnum.ADMIN)).toBe(true);
      expect(isInternalRole(UserRoleEnum.MARKETING)).toBe(true);
      expect(isInternalRole(UserRoleEnum.ENGINEER)).toBe(true);
      expect(isInternalRole('admin')).toBe(true);
      expect(isInternalRole('marketing')).toBe(true);
      expect(isInternalRole('engineer')).toBe(true);
    });

    it('should return false for client role or undefined/null', () => {
      expect(isInternalRole(UserRoleEnum.CLIENT)).toBe(false);
      expect(isInternalRole('client')).toBe(false);
      expect(isInternalRole(undefined)).toBe(false);
      expect(isInternalRole('')).toBe(false);
    });
  });

  describe('canEditProjectRole', () => {
    it('should return true only for admin role', () => {
      expect(canEditProjectRole(UserRoleEnum.ADMIN)).toBe(true);
      expect(canEditProjectRole('admin')).toBe(true);
    });

    it('should return false for engineer, marketing, client roles, or undefined', () => {
      expect(canEditProjectRole(UserRoleEnum.ENGINEER)).toBe(false);
      expect(canEditProjectRole(UserRoleEnum.MARKETING)).toBe(false);
      expect(canEditProjectRole(UserRoleEnum.CLIENT)).toBe(false);
      expect(canEditProjectRole('engineer')).toBe(false);
      expect(canEditProjectRole('marketing')).toBe(false);
      expect(canEditProjectRole('client')).toBe(false);
      expect(canEditProjectRole(undefined)).toBe(false);
    });
  });
});
