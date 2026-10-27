import { profileRepository } from '../../src/infrastructure/supabase/profileRepository';
import { supabase } from '../../src/config/supabase';
jest.mock('../../src/config/supabase', () => ({
  supabase: { from: jest.fn() },
}));
describe('profile mutation acknowledgement', () => {
  function result(data: unknown, error: unknown = null) {
    const maybeSingle = jest.fn().mockResolvedValue({ data, error });
    (supabase.from as jest.Mock).mockReturnValue({
      update: () => ({ eq: () => ({ select: () => ({ maybeSingle }) }) }),
    });
  }
  it('does not report a successful update when RLS matched no profile', async () => {
    result(null);
    await expect(profileRepository.updateName('user', 'Name')).rejects.toThrow(
      'Profil tidak ditemukan',
    );
  });
  it('accepts a mutation only after the database returns its row', async () => {
    result({ id: 'user' });
    await expect(
      profileRepository.updateName('user', 'Name'),
    ).resolves.toBeUndefined();
  });
  it('propagates a database failure to the application', async () => {
    result(null, { message: 'Network unavailable' });
    await expect(profileRepository.updateName('user', 'Name')).rejects.toThrow(
      'Network unavailable',
    );
  });
});
