import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthUser,
  normalizeAuthRole,
  CreateUserRole,
} from '../domain/models/auth';
import { authService } from '../services/authService';

import { getErrorMessage } from '../utils/errorHelpers';

const USER_KEY = 'auth_user';
let authVersion = 0;

export function invalidateAuthInitialization(): void {
  ++authVersion;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  isPasswordRecovery: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  completePasswordRecovery: (password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  adminCreateUser: (
    name: string,
    email: string,
    password: string,
    role: CreateUserRole,
  ) => Promise<AuthUser>;
}

function sanitizeAuthUser(rawUser: unknown): AuthUser | null {
  if (!rawUser || typeof rawUser !== 'object') return null;
  const obj = rawUser as Record<string, unknown>;
  if (typeof obj.id !== 'string' || !obj.id) return null;

  return {
    id: obj.id,
    email: typeof obj.email === 'string' ? obj.email : '',
    full_name: typeof obj.full_name === 'string' ? obj.full_name : 'User GSI',
    role: normalizeAuthRole(obj.role),
    ticket_number:
      typeof obj.ticket_number === 'string' ? obj.ticket_number : undefined,
  };
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  isPasswordRecovery: false,
  error: null,

  updateProfileName: async name => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Sesi pengguna tidak ditemukan.');
    const cleanName = name.trim();
    if (!cleanName) throw new Error('Nama lengkap tidak boleh kosong.');
    await authService.updateProfileName(user.id, cleanName);
    if (useAuthStore.getState().user?.id !== user.id)
      throw new Error('Sesi telah berubah.');
    const updatedUser = { ...user, full_name: cleanName };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    if (useAuthStore.getState().user?.id === user.id)
      set({ user: updatedUser });
  },
  completePasswordRecovery: async password => {
    await authService.updatePassword(password);
    await AsyncStorage.removeItem('auth_password_recovery');
    set({ isPasswordRecovery: false });
    await useAuthStore.getState().logout();
  },
  initialize: async () => {
    const version = ++authVersion;
    try {
      const session = await authService.restoreSession();
      if (session) {
        let user: AuthUser | null = session.user;
        if (!user && session.profileUnavailable) {
          const cachedJson = await AsyncStorage.getItem(USER_KEY);
          const cached = cachedJson
            ? sanitizeAuthUser(JSON.parse(cachedJson))
            : null;
          if (cached?.id === session.userId) user = cached;
        }
        if (!user)
          throw new Error(
            'Profil pengguna tidak ditemukan. Silakan login kembali.',
          );

        if (version !== authVersion) return;
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        const isPasswordRecovery =
          (await AsyncStorage.getItem('auth_password_recovery')) === 'true';
        if (version !== authVersion) return;
        set({
          user,
          token: session.token,
          isInitialized: true,
          isPasswordRecovery,
        });
      } else {
        if (version !== authVersion) return;
        await AsyncStorage.removeItem(USER_KEY);
        if (version !== authVersion) return;
        set({ user: null, token: null, isInitialized: true });
      }
    } catch {
      if (version !== authVersion) return;
      await AsyncStorage.removeItem(USER_KEY);
      if (version !== authVersion) return;
      set({ user: null, token: null, isInitialized: true });
    }
  },

  login: async (email, password) => {
    const version = ++authVersion;
    set({
      user: null,
      token: null,
      isLoading: true,
      error: null,
      isPasswordRecovery: false,
    });
    try {
      const result = await authService.login({ email, password });
      if (version !== authVersion) return;
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.user));
      if (version !== authVersion) return;
      set({ user: result.user, token: result.token, isLoading: false });
    } catch (err: unknown) {
      if (version !== authVersion) return;
      set({
        user: null,
        token: null,
        error: getErrorMessage(err),
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    const version = ++authVersion;
    set({
      user: null,
      token: null,
      isLoading: true,
      error: null,
      isPasswordRecovery: false,
    });
    await Promise.all([
      AsyncStorage.removeItem(USER_KEY).catch(() => {}),
      AsyncStorage.removeItem('auth_password_recovery').catch(() => {}),
    ]);
    if (version !== authVersion) return;
    try {
      await authService.logout();
    } finally {
      if (version === authVersion) set({ isLoading: false });
    }
  },

  sendPasswordReset: async email => {
    set({ isLoading: true, error: null });
    try {
      await authService.sendPasswordResetEmail(email);
      set({ isLoading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  adminCreateUser: async (name, email, password, role) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      throw new Error('Sesi admin tidak ditemukan. Silakan login kembali.');
    }
    set({ isLoading: true, error: null });
    try {
      const createdUser = await authService.adminCreateUser(
        name,
        email,
        password,
        role,
      );
      set({ isLoading: false });
      return createdUser;
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },
}));
