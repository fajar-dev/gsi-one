import { supabase } from '../../config/supabase';

import type { NotificationRow } from '../../types/database.types';
import type { AppNotification } from '../../domain/models/notification';

export const notificationRepository = {
  getNotifications: async (
    userId?: string | null,
    role?: string | null,
    limit: number = 20,
    offset: number = 0,
  ): Promise<AppNotification[]> => {
    if (!userId && !role) return [];
    let query = supabase.from('notifications').select('*');

    if (userId && role) {
      query = query.or(
        `user_id.eq.${userId},target_role.eq.${role.toLowerCase()}`,
      );
    } else if (userId) {
      query = query.eq('user_id', userId);
    } else if (role) {
      query = query.eq('target_role', role.toLowerCase());
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message || 'Gagal memuat notifikasi.');
    return (data || []).map((item: NotificationRow) => ({
      ...item,
      id: String(item.id),
    }));
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
        throw new Error(
          'Notifikasi tidak ditemukan atau tidak dapat diperbarui.',
        );
      }
    } catch (err) {
      if (__DEV__) {
        console.warn('Error markAsRead:', err);
      }
      throw err;
    }
  },

  markAllAsRead: async (
    userId?: string | null,
    role?: string | null,
  ): Promise<void> => {
    try {
      let query = supabase.from('notifications').update({ is_read: true });

      if (userId && role) {
        query = query.or(
          `user_id.eq.${userId},target_role.eq.${role.toLowerCase()}`,
        );
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else if (role) {
        query = query.eq('target_role', role.toLowerCase());
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
