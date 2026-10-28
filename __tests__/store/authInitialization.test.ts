import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useAuthStore,
  invalidateAuthInitialization,
} from '../../src/store/authStore';
import { authService } from '../../src/services/authService';

jest.mock('../../src/services/authService', () => ({
  authService: { restoreSession: jest.fn() },
}));
const session = (id: string) => ({
  userId: id,
  token: id,
  profileUnavailable: false,
  user: {
    id,
    email: `${id}@example.com`,
    full_name: id,
    role: 'client' as const,
  },
});
describe('auth initialization race protection', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    invalidateAuthInitialization();
    useAuthStore.setState({ user: null, token: null, isInitialized: false });
  });
  it('ignores an old profile after a newer session has initialized', async () => {
    let resolveOld!: (value: unknown) => void;
    (authService.restoreSession as jest.Mock)
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveOld = resolve;
        }),
      )
      .mockResolvedValueOnce(session('new'));
    const old = useAuthStore.getState().initialize();
    await useAuthStore.getState().initialize();
    resolveOld(session('old'));
    await old;
    expect(useAuthStore.getState().user?.id).toBe('new');
  });
  it('does not restore a profile after signed-out invalidates initialization', async () => {
    let resolveProfile!: (value: unknown) => void;
    (authService.restoreSession as jest.Mock).mockReturnValue(
      new Promise(resolve => {
        resolveProfile = resolve;
      }),
    );
    const pending = useAuthStore.getState().initialize();
    invalidateAuthInitialization();
    useAuthStore.setState({ user: null, token: null });
    resolveProfile(session('old'));
    await pending;
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
  it('uses a cached profile only for the same authenticated user when the profile query fails', async () => {
    await AsyncStorage.setItem(
      'auth_user',
      JSON.stringify(session('known').user),
    );
    (authService.restoreSession as jest.Mock).mockResolvedValue({
      ...session('known'),
      user: null,
      profileUnavailable: true,
    });
    await useAuthStore.getState().initialize();
    expect(useAuthStore.getState().user?.id).toBe('known');
    (authService.restoreSession as jest.Mock).mockResolvedValue({
      ...session('other'),
      user: null,
      profileUnavailable: true,
    });
    await useAuthStore.getState().initialize();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

it('finishes initialization even when clearing an invalid cached session fails', async () => {
  invalidateAuthInitialization();
  useAuthStore.setState({
    user: null,
    token: null,
    isInitialized: false,
    isLoading: false,
    isLoggingOut: false,
  });
  jest
    .mocked(authService.restoreSession)
    .mockRejectedValueOnce(new Error('Session unavailable'));
  jest
    .mocked(AsyncStorage.removeItem)
    .mockRejectedValueOnce(new Error('Storage unavailable'));
  await expect(useAuthStore.getState().initialize()).resolves.toBeUndefined();
  expect(useAuthStore.getState()).toMatchObject({
    user: null,
    isInitialized: true,
  });
});
