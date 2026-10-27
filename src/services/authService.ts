import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { generateClientTicketNumber } from '../utils/ticketHelpers';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name?: string;
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

export type StaffRole = CreateUserRole;

interface AdminCreateUserResponse {
  success?: boolean;
  message?: string;
  user?: AuthUser;
}

export function normalizeAuthRole(role: unknown): AuthRole {
  return role === 'admin' || role === 'marketing' || role === 'engineer' || role === 'client'
    ? role
    : 'client';
}

export function getPasswordResetRedirect(): string {
  const origin = (globalThis as unknown as { location?: { origin: string } }).location?.origin;
  return origin && ['http://localhost:8080', 'http://127.0.0.1:8080', 'https://grahasurvei.com'].includes(origin)
    ? `${origin}/reset-password` : 'gsione://reset-password';
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResult> => {
    let emailToAuth = credentials.email.trim();

    if (!emailToAuth.includes('@')) {
      const inputTicket = emailToAuth.toUpperCase();
      let resolvedEmail: string | null = null;

      try {
        const { data: rpcEmail, error: rpcErr } = await supabase
          .rpc('get_email_by_ticket_number', { p_ticket: inputTicket });
        if (!rpcErr && typeof rpcEmail === 'string' && rpcEmail) {
          resolvedEmail = rpcEmail;
        }
      } catch {
      }

      if (!resolvedEmail) {
        try {
          const { data: ticketUser } = await supabase
            .from('users')
            .select('email')
            .ilike('ticket_number', inputTicket)
            .maybeSingle();

          if (ticketUser && ticketUser.email) {
            resolvedEmail = ticketUser.email;
          }
        } catch {
        }
      }

      if (!resolvedEmail) {
        throw new Error(`Nomor Tiket Klien (${inputTicket}) tidak ditemukan`);
      }

      emailToAuth = resolvedEmail;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailToAuth,
      password: credentials.password,
    });

    if (authError) {
      throw new Error('Nomor Tiket / Email atau kata sandi salah');
    }

    if (!authData.session || !authData.user) {
      throw new Error('Sesi gagal diinisialisasi');
    }

    const meta = authData.user.user_metadata || {};
    let fullName = meta.full_name || meta.name || '';
    let role = meta.role;
    let ticketNumber = meta.ticket_number;

    try {
      const { data: profile } = await supabase
        .from('users')
        .select('name, role, ticket_number')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profile) {
        fullName = profile.name || fullName;
        role = profile.role || role;
        ticketNumber = profile.ticket_number || ticketNumber;
      }
    } catch (err) {
      if (__DEV__) { console.warn('Gagal memuat profil pengguna dari DB:', err); }
    }

    const authUser: AuthUser = {
      id: authData.user.id,
      email: authData.user.email || emailToAuth,
      full_name: fullName || 'User GSI',
      role: normalizeAuthRole(role),
      ticket_number: ticketNumber,
    };

    return {
      user: authUser,
      token: authData.session.access_token,
    };
  },

  register: async (_credentials: RegisterCredentials): Promise<void> => {
    throw new Error('Pendaftaran mandiri dinonaktifkan. Seluruh akun (Client & Staf) wajib didaftarkan oleh Administrator.');
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('auth_user').catch(() => {});

    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      if (__DEV__) { console.warn('Supabase signOut error:', err); }
    }
  },

  sendPasswordResetEmail: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getPasswordResetRedirect(),
    });
    if (error) {
      throw new Error(error.message || 'Gagal mengirim email reset password');
    }
  },

  adminCreateUser: async (
    name: string,
    email: string,
    password: string,
    role: CreateUserRole
  ): Promise<AuthUser | undefined> => {
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Nama dan email harus valid.');
    if (password.length < 8) throw new Error('Password minimal 8 karakter.');
    const generatedTicket = role === 'client' ? generateClientTicketNumber() : undefined;

    let createdUser: AuthUser | undefined;

    try {
      const { data: edgeData, error: edgeErr } = await supabase.functions.invoke<AdminCreateUserResponse>(
        'admin-create-user',
        {
          body: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
            ticket_number: generatedTicket,
          },
        }
      );

      if (!edgeErr && edgeData?.success && edgeData.user) {
        createdUser = edgeData.user;
      } else if (edgeErr) {
        let edgeMessage = edgeErr.message || '';
        try {
          if (typeof edgeErr === 'object' && edgeErr !== null && 'context' in edgeErr) {
            const ctx = (edgeErr as { context?: { json?: () => Promise<unknown> } }).context;
            if (ctx && typeof ctx.json === 'function') {
              const parsed = await ctx.json() as AdminCreateUserResponse;
              if (parsed && parsed.message) edgeMessage = parsed.message;
            }
          }
        } catch {
        }
        if (edgeMessage && !edgeMessage.includes('FunctionsFetchError')) {
          throw new Error(edgeMessage);
        }
      }
    } catch (edgeException: unknown) {
      if (edgeException instanceof Error && !edgeException.message.includes('FunctionsFetchError') && !edgeException.message.includes('Failed to fetch')) {
        throw edgeException;
      }
    }

    // Pembuatan akun hanya melalui Edge Function yang memverifikasi role admin.
    if (!createdUser) {
      throw new Error('Gagal mendaftarkan pengguna baru: layanan admin tidak merespons.');
    }


    return createdUser;
  },
};

