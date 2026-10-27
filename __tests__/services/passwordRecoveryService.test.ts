import { acceptRecoveryLink, isRecoveryUrl } from '../../src/services/passwordRecoveryService';
import { supabase } from '../../src/config/supabase';
jest.mock('../../src/config/supabase', () => ({ supabase: { auth: { setSession: jest.fn(), exchangeCodeForSession: jest.fn() } } }));
describe('password recovery links', () => {
  beforeEach(() => jest.clearAllMocks());
  it('accepts the recovery session only from the registered destination', async () => {
    (supabase.auth.setSession as jest.Mock).mockResolvedValue({ error: null });
    await expect(acceptRecoveryLink('gsione://reset-password#access_token=a&refresh_token=r&type=recovery')).resolves.toBe(true);
    expect(supabase.auth.setSession).toHaveBeenCalledWith({ access_token: 'a', refresh_token: 'r' });
    expect(isRecoveryUrl('https://evil.example/reset-password')).toBe(false);
    await expect(acceptRecoveryLink('https://evil.example/reset-password#access_token=bad')).resolves.toBe(false);
    expect(supabase.auth.setSession).toHaveBeenCalledTimes(1);
  });
  it('rejects malformed, expired and non-recovery token links', async () => {
    await expect(acceptRecoveryLink('gsione://reset-password#access_token=a&refresh_token=r&type=signup')).rejects.toThrow('tidak lengkap');
    await expect(acceptRecoveryLink('gsione://reset-password#error=access_denied')).rejects.toThrow('kedaluwarsa');
    expect(supabase.auth.setSession).not.toHaveBeenCalled();
  });
  it('exchanges a PKCE code and propagates invalid-code failure', async () => {
    (supabase.auth.exchangeCodeForSession as jest.Mock).mockResolvedValue({ error: { message: 'expired' } });
    await expect(acceptRecoveryLink('gsione://reset-password?code=used')).rejects.toThrow('telah digunakan');
  });
});
