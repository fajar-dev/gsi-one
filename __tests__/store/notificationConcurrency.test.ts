import { useNotificationStore } from '../../src/store/notificationStore';
import { notificationService } from '../../src/services/notificationService';
import type { AppNotification } from '../../src/domain/models/notification';
import { deferred } from '../../test/helpers/deferred';
jest.mock('../../src/services/notificationService', () => ({
  notificationService: { markAsRead: jest.fn(), getNotifications: jest.fn() },
}));
const item = (id: string): AppNotification => ({
  id,
  user_id: 'one',
  target_role: null,
  reference_id: null,
  title: id,
  message: '',
  type: 'info',
  is_read: false,
  created_at: '',
});
beforeEach(() => {
  jest.resetAllMocks();
  useNotificationStore.getState().resetForSession();
  useNotificationStore.setState({
    ownerId: 'one',
    notifications: [item('a'), item('b')],
    unreadCount: 2,
  });
});
it('keeps the second successful write when the first write rolls back', async () => {
  const first = deferred<void>();
  jest
    .mocked(notificationService.markAsRead)
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce();
  const a = useNotificationStore.getState().markAsRead('a');
  const b = useNotificationStore.getState().markAsRead('b');
  await Promise.resolve();
  expect(notificationService.markAsRead).toHaveBeenCalledTimes(1);
  first.reject(new Error('Denied'));
  await Promise.all([a, b]);
  expect(
    useNotificationStore.getState().notifications.map(n => n.is_read),
  ).toEqual([false, true]);
  expect(useNotificationStore.getState().unreadCount).toBe(1);
});
it('ignores a stale read that finishes after a successful write', async () => {
  const read = deferred<AppNotification[]>();
  jest
    .mocked(notificationService.getNotifications)
    .mockReturnValue(read.promise);
  const fetching = useNotificationStore
    .getState()
    .fetchNotifications('one', 'client');
  jest.mocked(notificationService.markAsRead).mockResolvedValue();
  await useNotificationStore.getState().markAsRead('a');
  read.resolve([item('a'), item('b')]);
  await fetching;
  expect(useNotificationStore.getState().notifications[0].is_read).toBe(true);
});
it('discards writes queued before a session reset', async () => {
  const first = deferred<void>();
  jest.mocked(notificationService.markAsRead).mockReturnValue(first.promise);
  const a = useNotificationStore.getState().markAsRead('a'),
    b = useNotificationStore.getState().markAsRead('b');
  await Promise.resolve();
  useNotificationStore.getState().resetForSession();
  first.resolve();
  await Promise.all([a, b]);
  expect(notificationService.markAsRead).toHaveBeenCalledTimes(1);
  expect(useNotificationStore.getState().notifications).toEqual([]);
});
it('does not restore an old list over a fresh server response', async () => {
  const write = deferred<void>();
  jest.mocked(notificationService.markAsRead).mockReturnValue(write.promise);
  const saving = useNotificationStore.getState().markAsRead('a');
  await Promise.resolve();
  jest
    .mocked(notificationService.getNotifications)
    .mockResolvedValue([item('a'), item('b'), item('c')]);
  await useNotificationStore.getState().fetchNotifications('one', 'client');
  write.reject(new Error('Denied'));
  await saving;
  expect(useNotificationStore.getState().notifications.map(n => n.id)).toEqual([
    'a',
    'b',
    'c',
  ]);
});
