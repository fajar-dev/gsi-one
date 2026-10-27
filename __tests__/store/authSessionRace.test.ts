import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useAuthStore,
  invalidateAuthInitialization,
} from '../../src/store/authStore';
import { authService } from '../../src/services/authService';
import type { LoginResult } from '../../src/domain/models/auth';
import { deferred } from '../../test/helpers/deferred';
jest.mock('../../src/services/authService', () => ({
  authService: { login: jest.fn(), logout: jest.fn() },
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
    error: null,
    isInitialized: true,
  });
  jest.mocked(authService.logout).mockResolvedValue();
});
it('does not resurrect a login completed after logout', async () => {
  const pending = deferred<LoginResult>();
  jest.mocked(authService.login).mockReturnValue(pending.promise);
  const login = useAuthStore.getState().login('old@example.com', 'secret');
  await useAuthStore.getState().logout();
  pending.resolve(result('old'));
  await login;
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
  await useAuthStore.getState().login('new@example.com', 'secret');
  pending.resolve();
  await logout;
  expect(useAuthStore.getState().user?.id).toBe('new');
});
