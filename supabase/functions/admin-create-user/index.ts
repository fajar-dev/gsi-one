import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const ALLOWED_ORIGINS = [
  'https://grahasurvei.com',
  'http://localhost:3000',
  'http://10.0.2.2:3000',
];

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req) });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Konfigurasi environment Supabase Cloud belum lengkap.');
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: 'Header otorisasi tidak ditemukan.' }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const { data: { user: callerUser }, error: tokenErr } = await supabaseAdmin.auth.getUser(token);

    if (tokenErr || !callerUser) {
      return new Response(
        JSON.stringify({ success: false, message: 'Token otorisasi tidak valid atau kedaluwarsa.' }),
        { status: 401, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const { data: callerProfile, error: profileErr } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', callerUser.id)
      .maybeSingle();

    if (profileErr || !callerProfile || callerProfile.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, message: 'Akses ditolak: Hanya Admin yang dapat mendaftarkan pengguna baru.' }),
        { status: 403, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, password, role, ticket_number } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, message: 'Nama, email, password, dan role wajib diisi.' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    if (String(password).length < 8) {
      return new Response(
        JSON.stringify({ success: false, message: 'Password harus minimal 8 karakter.' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const validRoles = ['client', 'marketing', 'engineer'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Role tidak valid. Pilih client, marketing, atau engineer.' }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();

    const { data: createdAuth, error: createAuthErr } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: String(password),
      email_confirm: true,
      user_metadata: {
        full_name: cleanName,
        role: role,
        ...(ticket_number ? { ticket_number: String(ticket_number).trim() } : {}),
      },
    });

    if (createAuthErr || !createdAuth.user) {
      return new Response(
        JSON.stringify({ success: false, message: `Gagal membuat akun Auth: ${createAuthErr?.message || 'Unknown error'}` }),
        { status: 400, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
      );
    }

    const newUserId = createdAuth.user.id;

    const { error: upsertErr } = await supabaseAdmin
      .from('users')
      .upsert({
        id: newUserId,
        name: cleanName,
        email: cleanEmail,
        role: role,
        ...(ticket_number ? { ticket_number: String(ticket_number).trim() } : {}),
      }, { onConflict: 'id' });

    if (upsertErr) {
      console.error('[EDGE FUNCTION WARN] Gagal upsert public.users:', upsertErr.message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Pengguna baru (${cleanName}) dengan role [${role}] berhasil didaftarkan.`,
        user: {
          id: newUserId,
          email: cleanEmail,
          full_name: cleanName,
          role: role,
        },
      }),
      { status: 200, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan internal server.';
    return new Response(
      JSON.stringify({ success: false, message: errorMsg }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
