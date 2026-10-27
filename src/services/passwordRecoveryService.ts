import { parseUrl, parseUrlParams } from '../utils/url';
import { supabase } from '../config/supabase';

export function isRecoveryUrl(value: string): boolean {
  try {
    const url = parseUrl(value);
    return (url.protocol === 'gsione:' && url.hostname === 'reset-password') ||
      (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname === '/reset-password') ||
      (url.protocol === 'https:' && url.hostname === 'grahasurvei.com' && url.pathname === '/reset-password');
  } catch { return false; }
}

export async function acceptRecoveryLink(value: string): Promise<boolean> {
  if (!isRecoveryUrl(value)) return false;
  const url = parseUrl(value);
  const params = parseUrlParams(url.hash ? url.hash.slice(1) : url.search.slice(1));
  if (params.get('error')) throw new Error('Tautan reset sudah kedaluwarsa atau tidak valid. Minta tautan baru.');
  const code = params.get('code');
  const access = params.get('access_token');
  const refresh = params.get('refresh_token');
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw new Error('Tautan reset tidak valid atau telah digunakan.');
  } else if (access && refresh && params.get('type') === 'recovery') {
    const { error } = await supabase.auth.setSession({ access_token: access, refresh_token: refresh });
    if (error) throw new Error('Tautan reset tidak valid atau sudah kedaluwarsa.');
  } else {
    throw new Error('Tautan reset tidak lengkap. Silakan minta tautan baru.');
  }
  return true;
}
