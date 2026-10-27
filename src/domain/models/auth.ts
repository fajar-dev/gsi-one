export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: AuthRole;
  ticket_number?: string;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
}

export type AuthRole = 'admin' | 'marketing' | 'engineer' | 'client';

export type CreateUserRole = AuthRole;

export function normalizeAuthRole(role: unknown): AuthRole {
  return role === 'admin' ||
    role === 'marketing' ||
    role === 'engineer' ||
    role === 'client'
    ? role
    : 'client';
}
