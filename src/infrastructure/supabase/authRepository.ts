import { profileRepository } from './profileRepository';
import { supabase } from '../../config/supabase';
import { generateClientTicketNumber } from '../../utils/ticketHelpers';

import { normalizeAuthRole } from '../../domain/models/auth';
import type {
  LoginCredentials,
  AuthUser,
  LoginResult,
  CreateUserRole,
} from '../../domain/models/auth';
interface AdminCreateUserResponse {
  success?: boolean;
  message?: string;
  user?: AuthUser;
}

async function getAdminErrorMessage(error: {
  message?: string;
  context?: unknown;
}): Promise<string> {
  const fallback = error.message || 'Layanan admin tidak dapat dihubungi.';
  const context = error.context;
  if (
    !context ||
    typeof context !== 'object' ||
    !('json' in context) ||
    typeof context.json !== 'function'
  )
    return fallback;
  try {
    const body: unknown = await context.json();
    return body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string'
      ? body.message
      : fallback;
  } catch {
    // A non-JSON gateway response still has the SDK's transport error message.
    return fallback;
  }
}

export const authRepository = {
  exchangeRecoveryCode: async (code: string): Promise<void> => {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error)
      throw new Error('Tautan reset tidak valid atau telah digunakan.');
  },
  setRecoverySession: async (
    access: string,
    refresh: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.setSession({
      access_token: access,
      refresh_token: refresh,
    });
    if (error)
      throw new Error('Tautan reset tidak valid atau sudah kedaluwarsa.');
  },
  restoreSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session?.user) return null;
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('name, role, ticket_number')
      .eq('id', session.user.id)
      .maybeSingle();
    return {
      userId: session.user.id,
      token: session.access_token,
      profileUnavailable: !!profileError,
      user: profile
        ? ({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile.name || 'User GSI',
            role: normalizeAuthRole(profile.role),
            ticket_number: profile.ticket_number || undefined,
          } satisfies AuthUser)
        : null,
    };
  },
  updateProfileName: (userId: string, name: string) =>
    profileRepository.updateName(userId, name),
  hasValidSession: async (): Promise<boolean> => {
    const { data, error } = await supabase.auth.getUser();
    return !error && !!data.user;
  },
  updatePassword: async (password: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  },
  login: async (credentials: LoginCredentials): Promise<LoginResult> => {
    let emailToAuth = credentials.email.trim();

    if (!emailToAuth.includes('@')) {
      const inputTicket = emailToAuth.toUpperCase();
      let resolvedEmail: string | null = null;

      try {
        const { data: rpcEmail, error: rpcErr } = await supabase.rpc(
          'get_email_by_ticket_number',
          { p_ticket: inputTicket },
        );
        if (!rpcErr && typeof rpcEmail === 'string' && rpcEmail) {
          resolvedEmail = rpcEmail;
        }
      } catch {}

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
        } catch {}
      }

      if (!resolvedEmail) {
        throw new Error(`Nomor Tiket Klien (${inputTicket}) tidak ditemukan`);
      }

      emailToAuth = resolvedEmail;
    }

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
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
      if (__DEV__) {
        console.warn('Gagal memuat profil pengguna dari DB:', err);
      }
    }

    const authUser: AuthUser = {
      id: authData.user.id,
      email: authData.user.email || emailToAuth,
      full_name:
        typeof fullName === 'string' && fullName ? fullName : 'User GSI',
      role: normalizeAuthRole(role),
      ticket_number:
        typeof ticketNumber === 'string' ? ticketNumber : undefined,
    };

    return {
      user: authUser,
      token: authData.session.access_token,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      if (__DEV__) {
        console.warn('Supabase signOut error:', err);
      }
    }
  },

  sendPasswordResetEmail: async (
    email: string,
    redirectTo: string,
  ): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    if (error) {
      throw new Error(error.message || 'Gagal mengirim email reset password');
    }
  },

  adminCreateUser: async (
    name: string,
    email: string,
    password: string,
    role: CreateUserRole,
  ): Promise<AuthUser> => {
    const { data, error } =
      await supabase.functions.invoke<AdminCreateUserResponse>(
        'admin-create-user',
        {
          body: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
            ticket_number:
              role === 'client' ? generateClientTicketNumber() : undefined,
          },
        },
      );
    if (error) throw new Error(await getAdminErrorMessage(error));
    if (!data?.success || !data.user)
      throw new Error(
        data?.message ||
          'Gagal mendaftarkan pengguna baru: layanan admin tidak merespons.',
      );
    return data.user;
  },
};
