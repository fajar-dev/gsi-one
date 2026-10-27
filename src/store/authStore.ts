import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, AuthUser, normalizeAuthRole, CreateUserRole } from '../services/authService';
import { supabase } from '../config/supabase';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  adminCreateUser: (name: string, email: string, password: string, role: CreateUserRole) => Promise<AuthUser | undefined>;
  clearError: () => void;
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
    ticket_number: typeof obj.ticket_number === 'string' ? obj.ticket_number : undefined,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  isPasswordRecovery: false,
  error: null,

  initialize: async () => {
    const version = ++authVersion;
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('users').select('name, role, ticket_number')
          .eq('id', session.user.id).maybeSingle();
        let user: AuthUser | null = profile ? {
          id: session.user.id,
          email: session.user.email || '',
          full_name: profile.name || 'User GSI',
          role: normalizeAuthRole(profile.role),
          ticket_number: profile.ticket_number || undefined,
        } : null;
        if (!user && profileError) {
          const cachedJson = await AsyncStorage.getItem(USER_KEY);
          const cached = cachedJson ? sanitizeAuthUser(JSON.parse(cachedJson)) : null;
          if (cached?.id === session.user.id) user = cached;
        }
        if (!user) throw new Error('Profil pengguna tidak ditemukan. Silakan login kembali.');

        if (version !== authVersion) return;
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        const isPasswordRecovery = await AsyncStorage.getItem('auth_password_recovery') === 'true';
        if (version !== authVersion) return;
        set({ user, token: session.access_token, isInitialized: true, isPasswordRecovery });
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
    ++authVersion;
    set({ user: null, token: null, isLoading: true, error: null, isPasswordRecovery: false });
    try {
      const result = await authService.login({ email, password });
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(result.user));
      set({ user: result.user, token: result.token, isLoading: false });
    } catch (err: unknown) {
      set({ user: null, token: null, error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    ++authVersion;
    await AsyncStorage.removeItem(USER_KEY).catch(() => {});
    await AsyncStorage.removeItem('auth_password_recovery').catch(() => {});
    set({ user: null, token: null, isLoading: true, error: null, isPasswordRecovery: false });
    try {
      await authService.logout();
    } finally {
      set({ user: null, token: null, isLoading: false });
    }
  },

  register: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register({ email, password, full_name: fullName });
      set({ isLoading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  sendPasswordReset: async (email) => {
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
      const createdUser = await authService.adminCreateUser(name, email, password, role);
      set({ isLoading: false });
      return createdUser;
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

