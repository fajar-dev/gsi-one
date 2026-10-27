import { validateNewUser } from '../domain/validation/user';
import { authRepository } from '../infrastructure/supabase/authRepository';
import type { CreateUserRole } from '../domain/models/auth';

export function getPasswordResetRedirect(): string {
  const origin = (globalThis as unknown as { location?: { origin: string } })
    .location?.origin;
  return origin &&
    [
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'https://grahasurvei.com',
    ].includes(origin)
    ? `${origin}/reset-password`
    : 'gsione://reset-password';
}

export const authService = {
  exchangeRecoveryCode: authRepository.exchangeRecoveryCode,
  setRecoverySession: authRepository.setRecoverySession,
  restoreSession: authRepository.restoreSession,
  updateProfileName: authRepository.updateProfileName,
  hasValidSession: authRepository.hasValidSession,
  login: authRepository.login,
  logout: authRepository.logout,
  updatePassword: async (password: string): Promise<void> => {
    if (password.length < 8) throw new Error('Kata sandi minimal 8 karakter.');
    await authRepository.updatePassword(password);
  },
  sendPasswordResetEmail: (email: string) =>
    authRepository.sendPasswordResetEmail(email, getPasswordResetRedirect()),
  adminCreateUser: (
    name: string,
    email: string,
    password: string,
    role: CreateUserRole,
  ) => {
    const error = validateNewUser(name, email, password);
    if (error) return Promise.reject(new Error(error));
    return authRepository.adminCreateUser(name, email, password, role);
  },
};
