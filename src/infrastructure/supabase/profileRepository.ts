import { supabase } from '../../config/supabase';
export const profileRepository = {
  async updateName(userId: string, name: string): Promise<void> {
    const { data, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', userId)
      .select('id')
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Profil tidak ditemukan atau akses ditolak.');
  },
};
