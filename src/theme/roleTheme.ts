import { useAuthStore } from '../store/authStore';
import { roleColors } from '../../assets/styles/Colors';

export type AppRole = 'admin' | 'marketing' | 'engineer' | 'client';

export interface RoleTheme {
  role: AppRole;
  gradient: readonly [string, string];
  accent: string;
  accentLight: string;
  isMarketing: boolean;
  isAdmin: boolean;
  isEngineer: boolean;
  isClient: boolean;
  isInternal: boolean;
}

const ROLE_THEMES: Record<AppRole, Omit<RoleTheme, 'role' | 'isMarketing' | 'isAdmin' | 'isEngineer' | 'isClient' | 'isInternal'>> = {
  admin: {
    gradient: [roleColors.admin.gradientStart, roleColors.admin.gradientEnd] as const,
    accent: roleColors.admin.accent,
    accentLight: roleColors.admin.accentLight,
  },
  marketing: {
    gradient: [roleColors.marketing.gradientStart, roleColors.marketing.gradientEnd] as const,
    accent: roleColors.marketing.accent,
    accentLight: roleColors.marketing.accentLight,
  },
  engineer: {
    gradient: [roleColors.engineer.gradientStart, roleColors.engineer.gradientEnd] as const,
    accent: roleColors.engineer.accent,
    accentLight: roleColors.engineer.accentLight,
  },
  client: {
    gradient: [roleColors.client.gradientStart, roleColors.client.gradientEnd] as const,
    accent: roleColors.client.accent,
    accentLight: roleColors.client.accentLight,
  },
};

export function useRoleTheme(): RoleTheme {
  const { user } = useAuthStore();
  const role: AppRole = (user?.role as AppRole) ?? 'client';
  const theme = ROLE_THEMES[role];

  return {
    role,
    ...theme,
    isMarketing: role === 'marketing',
    isAdmin: role === 'admin',
    isEngineer: role === 'engineer',
    isClient: role === 'client',
    isInternal: role === 'admin' || role === 'engineer' || role === 'marketing',
  };
}

export function getRoleTheme(role?: string): Omit<RoleTheme, 'isMarketing' | 'isAdmin' | 'isEngineer' | 'isClient' | 'isInternal'> {
  const safeRole: AppRole = (role as AppRole) ?? 'client';
  return {
    role: safeRole,
    ...ROLE_THEMES[safeRole],
  };
}
