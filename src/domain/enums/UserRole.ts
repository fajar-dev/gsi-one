export enum UserRoleEnum {
  ADMIN = 'admin',
  MARKETING = 'marketing',
  ENGINEER = 'engineer',
  CLIENT = 'client',
}

// Aturan izin UI dipusatkan di sini. Sebagian LEBIH KETAT daripada RLS: mis.
// projects_update_policy mengizinkan semua is_staff(), sedangkan canEditProjectRole
// hanya admin. Selaraskan kedua lapisan dulu sebelum mengubah salah satunya.
export function isInternalRole(role?: string): boolean {
  return (
    role === UserRoleEnum.ADMIN ||
    role === UserRoleEnum.ENGINEER ||
    role === UserRoleEnum.MARKETING
  );
}

export function canEditProjectRole(role?: string): boolean {
  return role === UserRoleEnum.ADMIN;
}

export function canCreateProjectRole(role?: string): boolean {
  return role === UserRoleEnum.ADMIN;
}

export function canManageStagesRole(role?: string): boolean {
  return role === UserRoleEnum.ADMIN || role === UserRoleEnum.ENGINEER;
}

export function canViewSurveysRole(role?: string): boolean {
  return role === UserRoleEnum.ADMIN || role === UserRoleEnum.MARKETING;
}

export function canManageSurveyBookingsRole(role?: string): boolean {
  return role === UserRoleEnum.ADMIN;
}

export function canManageUsersRole(role?: string): boolean {
  return role === UserRoleEnum.ADMIN;
}
