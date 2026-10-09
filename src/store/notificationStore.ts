import { create } from 'zustand';
import { notificationService, AppNotification } from '../services/notificationService';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: (userId?: string | null, role?: string | null) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId?: string | null, role?: string | null) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addNotificationLocally: (notification: AppNotification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId, role) => {
    if (!userId && !role) return;
    set({ isLoading: true });
    try {
      const data = await notificationService.getNotifications(userId, role);
      const unreadCount = data.filter((n) => !n.is_read).length;
      set({ notifications: data, unreadCount, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId) => {
    const previousList = get().notifications;
    const previousUnread = get().unreadCount;

    const updated = previousList.map((item) =>
      item.id === notificationId ? { ...item, is_read: true } : item
    );
    const unreadCount = updated.filter((n) => !n.is_read).length;
    set({ notifications: updated, unreadCount });

    try {
      await notificationService.markAsRead(notificationId);
    } catch {
      set({ notifications: previousList, unreadCount: previousUnread });
    }
  },

  markAllAsRead: async (userId, role) => {
    const previousList = get().notifications;
    const previousUnread = get().unreadCount;

    const updated = previousList.map((item) => ({ ...item, is_read: true }));
    set({ notifications: updated, unreadCount: 0 });

    try {
      await notificationService.markAllAsRead(userId, role);
    } catch {
      set({ notifications: previousList, unreadCount: previousUnread });
    }
  },

  deleteNotification: async (notificationId) => {
    const previousList = get().notifications;
    const previousUnread = get().unreadCount;

    const updated = previousList.filter((item) => item.id !== notificationId);
    const unreadCount = updated.filter((n) => !n.is_read).length;
    set({ notifications: updated, unreadCount });

    try {
      await notificationService.deleteNotification(notificationId);
    } catch {
      set({ notifications: previousList, unreadCount: previousUnread });
    }
  },

  addNotificationLocally: (notification) => {
    const list = [notification, ...get().notifications];
    const unreadCount = list.filter((n) => !n.is_read).length;
    set({ notifications: list, unreadCount });
  },
}));


export const useNotificationList = () => useNotificationStore(state => state.notifications);

export const useUnreadCount = () => useNotificationStore(state => state.unreadCount);

export const useNotificationLoading = () => useNotificationStore(state => state.isLoading);

export const useNotificationActions = () => useNotificationStore(state => ({
  fetchNotifications: state.fetchNotifications,
  markAsRead: state.markAsRead,
  markAllAsRead: state.markAllAsRead,
  deleteNotification: state.deleteNotification,
  addNotificationLocally: state.addNotificationLocally,
}));
