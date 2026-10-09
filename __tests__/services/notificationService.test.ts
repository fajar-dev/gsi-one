import { notificationService } from '../../src/services/notificationService';
import { useNotificationStore } from '../../src/store/notificationStore';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('notificationService & notificationStore - Automated Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notificationService', () => {
    it('should be a no-op stub (RLS blocks direct INSERT from client)', async () => {
      (supabase.from as jest.Mock).mockReturnValue({ insert: jest.fn() });

      await notificationService.createNotification({
        targetRole: 'admin',
        title: 'Book Survey Baru',
        message: 'Client mengajukan survey',
        type: 'book_survey',
        referenceId: '123',
      });

      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should query notifications filtered by user_id or target_role', async () => {
      const mockData = [
        {
          id: 'n-1',
          user_id: 'usr-123',
          target_role: null,
          title: 'Proyek Baru',
          message: 'Anda dimasukkan ke proyek',
          type: 'project_created',
          reference_id: 'p-1',
          is_read: false,
          created_at: '2026-07-29T08:00:00Z',
        },
      ];

      const mockRange = jest.fn().mockResolvedValue({ data: mockData, error: null });
      const mockOrder = jest.fn().mockReturnValue({ range: mockRange });
      const mockOr = jest.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as jest.Mock).mockReturnValue({ select: jest.fn().mockReturnValue({ or: mockOr }) });

      const result = await notificationService.getNotifications('usr-123', 'client');

      expect(supabase.from).toHaveBeenCalledWith('notifications');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Proyek Baru');
    });

    it('should isolate notifications between Client A and Client B during server query', async () => {
      const mockDataClientA = [
        { id: 'n-1', user_id: 'client-A', target_role: null, title: 'Notif Client A', message: 'Secret A', type: 'info', is_read: false, created_at: '2026-07-29T08:00:00Z' },
      ];
      const mockDataClientB = [
        { id: 'n-2', user_id: 'client-B', target_role: null, title: 'Notif Client B', message: 'Secret B', type: 'info', is_read: false, created_at: '2026-07-29T08:00:00Z' },
      ];

      const mockRange = jest
        .fn()
        .mockResolvedValueOnce({ data: mockDataClientA, error: null })
        .mockResolvedValueOnce({ data: mockDataClientB, error: null });
      const mockOrder = jest.fn().mockReturnValue({ range: mockRange });
      const mockOr = jest.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as jest.Mock).mockReturnValue({ select: jest.fn().mockReturnValue({ or: mockOr }) });

      const clientAResults = await notificationService.getNotifications('client-A', 'client');
      expect(clientAResults).toHaveLength(1);
      expect(clientAResults[0].id).toBe('n-1');

      const clientBResults = await notificationService.getNotifications('client-B', 'client');
      expect(clientBResults).toHaveLength(1);
      expect(clientBResults[0].id).toBe('n-2');
    });

    it('should handle supabase query errors gracefully', async () => {
      const mockRange = jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } });
      const mockOrder = jest.fn().mockReturnValue({ range: mockRange });
      const mockOr = jest.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as jest.Mock).mockReturnValue({ select: jest.fn().mockReturnValue({ or: mockOr }) });

      const result = await notificationService.getNotifications('client-A', 'client');
      expect(result).toEqual([]);
    });

    it('should mark a single notification as read', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: [{ id: 'n-1' }], error: null });
      const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

      await notificationService.markAsRead('n-1');

      expect(supabase.from).toHaveBeenCalledWith('notifications');
      expect(mockUpdate).toHaveBeenCalledWith({ is_read: true });
      expect(mockEq).toHaveBeenCalledWith('id', 'n-1');
      expect(mockSelect).toHaveBeenCalledWith('id');
    });

    it('should reject when RLS filters a notification update', async () => {
      const mockSelect = jest.fn().mockResolvedValue({ data: [], error: null });
      const mockEq = jest.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
      (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });

      await expect(notificationService.markAsRead('n-hidden')).rejects.toThrow(
        'Notifikasi tidak ditemukan atau tidak dapat diperbarui.'
      );
    });
  });

  describe('useNotificationStore', () => {
    it('should calculate unreadCount correctly when notifications are fetched', async () => {
      const mockData = [
        { id: '1', title: 'A', message: 'M1', type: 'type1', is_read: false, created_at: '', user_id: 'u1', target_role: null, reference_id: null },
        { id: '2', title: 'B', message: 'M2', type: 'type2', is_read: true, created_at: '', user_id: 'u1', target_role: null, reference_id: null },
        { id: '3', title: 'C', message: 'M3', type: 'type3', is_read: false, created_at: '', user_id: 'u1', target_role: null, reference_id: null },
      ];

      jest.spyOn(notificationService, 'getNotifications').mockResolvedValueOnce(mockData);

      await useNotificationStore.getState().fetchNotifications('u1', 'client');

      const state = useNotificationStore.getState();
      expect(state.notifications).toHaveLength(3);
      expect(state.unreadCount).toBe(2);
    });

    it('should update state and decrement unreadCount when markAsRead is called', async () => {
      useNotificationStore.setState({
        notifications: [
          { id: '1', title: 'A', message: 'M1', type: 'type1', is_read: false, created_at: '', user_id: 'u1', target_role: null, reference_id: null },
          { id: '2', title: 'B', message: 'M2', type: 'type2', is_read: false, created_at: '', user_id: 'u1', target_role: null, reference_id: null },
        ],
        unreadCount: 2,
      });

      jest.spyOn(notificationService, 'markAsRead').mockResolvedValueOnce();

      await useNotificationStore.getState().markAsRead('1');

      const state = useNotificationStore.getState();
      expect(state.notifications[0].is_read).toBe(true);
      expect(state.unreadCount).toBe(1);
    });

    it('should restore local state when marking a notification as read fails', async () => {
      useNotificationStore.setState({
        notifications: [
          { id: '1', title: 'A', message: 'M1', type: 'type1', is_read: false, created_at: '', user_id: 'u1', target_role: null, reference_id: null },
        ],
        unreadCount: 1,
      });
      jest.spyOn(notificationService, 'markAsRead').mockRejectedValueOnce(new Error('RLS denied'));

      await useNotificationStore.getState().markAsRead('1');

      const state = useNotificationStore.getState();
      expect(state.notifications[0].is_read).toBe(false);
      expect(state.unreadCount).toBe(1);
    });
  });
});
