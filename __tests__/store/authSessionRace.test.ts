import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useAuthStore,
  invalidateAuthInitialization,
} from '../../src/store/authStore';
import { authService } from '../../src/services/authService';
import type { LoginResult } from '../../src/domain/models/auth';
import { deferred } from '../../test/helpers/deferred';
jest.mock('../../src/services/authService', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    adminCreateUser: jest.fn(),
  },
}));
const result = (id: string): LoginResult => ({
  user: { id, email: `${id}@example.com`, full_name: id, role: 'client' },
  token: id,
});
beforeEach(async () => {
  jest.clearAllMocks();
  jest.mocked(authService.login).mockReset();
  jest.mocked(authService.logout).mockReset();
  invalidateAuthInitialization();
  await AsyncStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
    isLoggingOut: false,
    isSendingPasswordReset: false,
    error: null,
    isInitialized: true,
  });
  jest.mocked(authService.logout).mockResolvedValue();
});
it('does not resurrect a login completed after logout', async () => {
  const pending = deferred<LoginResult>();
  jest.mocked(authService.login).mockReturnValue(pending.promise);
  const login = useAuthStore.getState().login('old@example.com', 'secret');
  const logout = useAuthStore.getState().logout();
  expect(useAuthStore.getState().user).toBeNull();
  pending.resolve(result('old'));
  await Promise.all([login, logout]);
  expect(useAuthStore.getState().user).toBeNull();
  expect(await AsyncStorage.getItem('auth_user')).toBeNull();
});
it('does not let an old login failure clear a newer account', async () => {
  const pending = deferred<LoginResult>();
  jest
    .mocked(authService.login)
    .mockReturnValueOnce(pending.promise)
    .mockResolvedValueOnce(result('new'));
  const old = useAuthStore.getState().login('old@example.com', 'secret');
  await useAuthStore.getState().login('new@example.com', 'secret');
  pending.reject(new Error('Old request failed'));
  await old;
  expect(useAuthStore.getState().user?.id).toBe('new');
  expect(useAuthStore.getState().error).toBeNull();
});
it('does not clear a new login when a previous logout finishes', async () => {
  const pending = deferred<void>(),
    started = deferred<void>();
  jest.mocked(authService.logout).mockImplementation(() => {
    started.resolve();
    return pending.promise;
  });
  const logout = useAuthStore.getState().logout();
  await started.promise;
  jest.mocked(authService.login).mockResolvedValue(result('new'));
  const login = useAuthStore.getState().login('new@example.com', 'secret');
  expect(authService.login).not.toHaveBeenCalled();
  pending.resolve();
  await Promise.all([logout, login]);
  expect(useAuthStore.getState().user?.id).toBe('new');
});

it('does not display a login spinner while logout is waiting for the network', async () => {
  const pending = deferred<void>();
  jest.mocked(authService.logout).mockReturnValue(pending.promise);
  const logout = useAuthStore.getState().logout();
  expect(useAuthStore.getState()).toMatchObject({
    user: null,
    isLoading: false,
    isLoggingOut: true,
  });
  pending.resolve();
  await logout;
  expect(useAuthStore.getState().isLoggingOut).toBe(false);
});
it('does not let session initialization supersede an active credential login', async () => {
  const pending = deferred<LoginResult>();
  jest.mocked(authService.login).mockReturnValue(pending.promise);
  const login = useAuthStore.getState().login('new@example.com', 'secret');
  await useAuthStore.getState().initialize();
  pending.resolve(result('new'));
  await login;
  expect(useAuthStore.getState()).toMatchObject({
    user: { id: 'new' },
    isLoading: false,
  });
});

it('keeps registration independent of login loading and rejects a result after logout', async () => {
  const pending = deferred<LoginResult['user']>();
  const admin = { ...result('admin').user, role: 'admin' as const };
  useAuthStore.setState({ user: admin, token: 'admin-token' });
  jest.mocked(authService.adminCreateUser).mockReturnValue(pending.promise);
  const creating = useAuthStore
    .getState()
    .adminCreateUser('Client', 'client@example.com', 'password', 'client');
  expect(useAuthStore.getState()).toMatchObject({
    user: admin,
    isLoading: false,
  });
  await useAuthStore.getState().logout();
  pending.resolve(result('created').user);
  await expect(creating).rejects.toThrow('Sesi telah berubah');
  expect(useAuthStore.getState().error).toBeNull();
});
it('keeps a late password reset failure from changing a newer session or request', async () => {
  const old = deferred<void>();
  const newer = deferred<void>();
  jest
    .mocked(authService.sendPasswordResetEmail)
    .mockReturnValueOnce(old.promise)
    .mockReturnValueOnce(newer.promise);
  const first = useAuthStore.getState().sendPasswordReset('old@example.com');
  expect(useAuthStore.getState()).toMatchObject({
    isLoading: false,
    isSendingPasswordReset: true,
  });
  await useAuthStore.getState().logout();
  const second = useAuthStore.getState().sendPasswordReset('new@example.com');
  old.reject(new Error('Old failure'));
  await expect(first).rejects.toThrow('Old failure');
  expect(useAuthStore.getState()).toMatchObject({
    error: null,
    isSendingPasswordReset: true,
  });
  newer.resolve();
  await second;
  expect(useAuthStore.getState().isSendingPasswordReset).toBe(false);
});
