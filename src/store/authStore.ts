import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, AuthUser, normalizeAuthRole, CreateUserRole } from '../services/authService';
import { supabase } from '../config/supabase';

import { getErrorMessage } from '../utils/errorHelpers';

const USER_KEY = 'auth_user';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
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
  error: null,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        let user: AuthUser | null = null;
        try {
          const userJson = await AsyncStorage.getItem(USER_KEY);
          const cached = userJson ? sanitizeAuthUser(JSON.parse(userJson)) : null;
          if (cached && cached.id === session.user.id) {
            user = cached;
          }
        } catch {
          user = null;
        }

        if (!user) {
          const meta = session.user.user_metadata || {};
          let fullName = meta.full_name || meta.name || '';
          let role = meta.role;
          let ticketNumber = meta.ticket_number;

          if (!fullName || !role) {
            const { data: profile } = await supabase
              .from('users')
              .select('name, role, ticket_number')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              fullName = profile.name || fullName;
              role = profile.role || role;
              ticketNumber = profile.ticket_number || ticketNumber;
            }
          }

          user = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: fullName || 'User Baru',
            role: normalizeAuthRole(role),
            ticket_number: ticketNumber,
          };
        }

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        set({ user, token: session.access_token, isInitialized: true });
      } else {
        await AsyncStorage.removeItem(USER_KEY);
        set({ user: null, token: null, isInitialized: true });
      }
    } catch {
      await AsyncStorage.removeItem(USER_KEY);
      set({ user: null, token: null, isInitialized: true });
    }
  },

  login: async (email, password) => {
    set({ user: null, token: null, isLoading: true, error: null });
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
    await AsyncStorage.removeItem(USER_KEY).catch(() => {});
    set({ user: null, token: null, isLoading: true, error: null });
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
      const createdUser = await authService.adminCreateUser(name, email, password, role, token);
      set({ isLoading: false });
      return createdUser;
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

