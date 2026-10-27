import { supabase } from '../config/supabase';

export type NotificationType =
  | 'book_survey'
  | 'project_created'
  | 'project_updated'
  | 'stage_updated'
  | 'file_uploaded'
  | 'engineer_assigned';

export interface AppNotification {
  id: string;
  user_id: string | null;
  target_role: string | null;
  title: string;
  message: string;
  type: NotificationType | string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationInput {
  userId?: string | null;
  targetRole?: string | null;
  title: string;
  message: string;
  type: NotificationType | string;
  referenceId?: string | null;
}

export const notificationService = {
  // SENGAJA no-op. INSERT notifikasi dari klien memang diblokir RLS; notifikasi
  // dibuat oleh trigger database (SECURITY DEFINER), trg_notify_on_new_booking dan trigger notify_project_activity.
  // Jangan "memperbaiki" fungsi ini tanpa lebih dulu menambah policy INSERT.
  createNotification: async (_input: CreateNotificationInput): Promise<void> => {
    if (__DEV__) {
      console.warn('[notificationService] createNotification dipanggil dari client -- diabaikan (RLS memblokir INSERT langsung). Gunakan trigger database.');
    }
  },

  getNotifications: async (
    userId?: string | null,
    role?: string | null,
    limit: number = 20,
    offset: number = 0
  ): Promise<AppNotification[]> => {
    try {
      let query = supabase.from('notifications').select('*');

      if (userId && role) {
        query = query.or(`user_id.eq.${userId},target_role.eq.${role.toLowerCase()}`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (role) {
        query = query.eq('target_role', role.toLowerCase());
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw new Error(error.message || 'Gagal memuat notifikasi.');
      return ((data || []) as AppNotification[]).map(item => ({ ...item, id: String(item.id) }));
    } catch (err) {
      throw err;
    }
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select('id');

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Notifikasi tidak ditemukan atau tidak dapat diperbarui.');
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('Error markAsRead:', err);
      }
      throw err;
    }
  },

  markAllAsRead: async (userId?: string | null, role?: string | null): Promise<void> => {
    try {
      let query = supabase.from('notifications').update({ is_read: true });

      if (userId && role) {
        query = query.or(`user_id.eq.${userId},target_role.eq.${role.toLowerCase()}`);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (role) {
        query = query.eq('target_role', role);
      } else {
        return;
      }

      const { error } = await query;
      if (error) {
        throw error;
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('Error markAllAsRead:', err);
      }
      throw err;
    }
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .select('id');

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Notifikasi tidak ditemukan atau tidak dapat dihapus.');
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('Error deleteNotification:', err);
      }
      throw err;
    }
  },
};
