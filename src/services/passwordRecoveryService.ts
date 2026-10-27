import { parseUrl, parseUrlParams } from '../utils/url';
import { authService } from './authService';

export function isRecoveryUrl(value: string): boolean {
  try {
    const url = parseUrl(value);
    return (
      (url.protocol === 'gsione:' && url.hostname === 'reset-password') ||
      (url.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(url.hostname) &&
        url.pathname === '/reset-password') ||
      (url.protocol === 'https:' &&
        url.hostname === 'grahasurvei.com' &&
        url.pathname === '/reset-password')
    );
  } catch {
    return false;
  }
}

export async function acceptRecoveryLink(value: string): Promise<boolean> {
  if (!isRecoveryUrl(value)) return false;
  const url = parseUrl(value);
  const params = parseUrlParams(
    url.hash ? url.hash.slice(1) : url.search.slice(1),
  );
  if (params.get('error'))
    throw new Error(
      'Tautan reset sudah kedaluwarsa atau tidak valid. Minta tautan baru.',
    );
  const code = params.get('code');
  const access = params.get('access_token');
  const refresh = params.get('refresh_token');
  if (code) {
    await authService.exchangeRecoveryCode(code);
  } else if (access && refresh && params.get('type') === 'recovery') {
    await authService.setRecoverySession(access, refresh);
  } else {
    throw new Error('Tautan reset tidak lengkap. Silakan minta tautan baru.');
  }
  return true;
}
