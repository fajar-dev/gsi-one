import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { AppNotification } from '../domain/models/notification';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  ownerId: string | null;
  requestId: number;
  error: string | null;
  resetForSession: () => void;

  fetchNotifications: (
    userId?: string | null,
    role?: string | null,
  ) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (
    userId?: string | null,
    role?: string | null,
  ) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

type NotificationUpdate = (
  notifications: AppNotification[],
) => AppNotification[];

export const useNotificationStore = create<NotificationState>((set, get) => {
  const queues = new Map<string | null, Promise<void>>();
  let sessionRevision = 0;
  const applyList = (notifications: AppNotification[]) =>
    set({
      notifications,
      unreadCount: notifications.filter(item => !item.is_read).length,
    });

  // Serialize optimistic writes per account so one failed write cannot roll back another.
  const mutate = (
    update: NotificationUpdate,
    persist: () => Promise<void>,
  ): Promise<void> => {
    const ownerId = get().ownerId;
    const revision = sessionRevision;
    const ownsSession = () =>
      revision === sessionRevision && get().ownerId === ownerId;
    const operation = (queues.get(ownerId) ?? Promise.resolve()).then(
      async () => {
        if (!ownsSession()) return;
        const requestId = get().requestId;
        const previous = get().notifications;
        applyList(update(previous));
        set({ error: null });
        try {
          await persist();
          if (!ownsSession()) return;
          applyList(update(get().notifications));
          // A read started before this write completed may still contain the old value.
          set({ requestId: get().requestId + 1, isLoading: false });
        } catch {
          if (!ownsSession()) return;
          if (get().requestId === requestId) applyList(previous);
          set({
            error: 'Perubahan notifikasi belum tersimpan. Silakan coba lagi.',
          });
        }
      },
    );
    const settled = operation.catch(() => {});
    queues.set(ownerId, settled);
    settled.then(() => {
      if (queues.get(ownerId) === settled) queues.delete(ownerId);
    });
    return operation;
  };

  return {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    ownerId: null,
    requestId: 0,
    error: null,
    resetForSession: () => {
      sessionRevision++;
      set({
        notifications: [],
        unreadCount: 0,
        isLoading: false,
        ownerId: null,
        requestId: get().requestId + 1,
        error: null,
      });
    },
    fetchNotifications: async (userId, role) => {
      if (!userId && !role) return;
      const requestId = get().requestId + 1;
      set({ isLoading: true, ownerId: userId || null, error: null, requestId });
      const ownsRequest = () =>
        get().ownerId === (userId || null) && get().requestId === requestId;
      try {
        const data = await notificationService.getNotifications(userId, role);
        if (!ownsRequest()) return;
        applyList(data);
        set({ isLoading: false });
      } catch (error) {
        if (ownsRequest())
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Gagal memuat notifikasi.',
          });
      }
    },
    markAsRead: notificationId =>
      mutate(
        list =>
          list.map(item =>
            item.id === notificationId ? { ...item, is_read: true } : item,
          ),
        () => notificationService.markAsRead(notificationId),
      ),
    markAllAsRead: (userId, role) =>
      mutate(
        list => list.map(item => ({ ...item, is_read: true })),
        () => notificationService.markAllAsRead(userId, role),
      ),
    deleteNotification: notificationId =>
      mutate(
        list => list.filter(item => item.id !== notificationId),
        () => notificationService.deleteNotification(notificationId),
      ),
  };
});
