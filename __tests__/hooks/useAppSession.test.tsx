import TestRenderer, { act } from 'react-test-renderer';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSession } from '../../src/hooks/useAppSession';
import {
  useAuthStore,
  invalidateAuthInitialization,
} from '../../src/store/authStore';
import { authService } from '../../src/services/authService';
import { deferred } from '../../test/helpers/deferred';
import type { LoginResult } from '../../src/domain/models/auth';

let mockListener: (event: AuthChangeEvent, session: Session | null) => void;
const mockUnsubscribe = jest.fn();
const mockResetProjects = jest.fn();
const mockResetNotifications = jest.fn();
const mockFetchNotifications = jest.fn();
const mockChannel = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
};
jest.mock('../../src/config/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(listener => {
        mockListener = listener;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      }),
    },
    channel: jest.fn(() => mockChannel),
    removeChannel: jest.fn(),
  },
}));
jest.mock('../../src/store/projectStore', () => ({
  useProjectStore: {
    getState: () => ({ resetForSession: mockResetProjects }),
  },
}));
jest.mock('../../src/store/notificationStore', () => ({
  useNotificationStore: {
    getState: () => ({
      resetForSession: mockResetNotifications,
      fetchNotifications: mockFetchNotifications,
    }),
  },
}));
jest.mock('../../src/services/authService', () => ({
  authService: {
    restoreSession: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}));
jest.mock('../../src/services/passwordRecoveryService', () => ({
  acceptRecoveryLink: jest.fn().mockResolvedValue(false),
}));
jest.mock('../../src/navigation/navigationRef', () => ({
  navigationRef: { isReady: () => false },
}));
const result: LoginResult = {
  user: {
    id: 'one',
    email: 'one@example.com',
    full_name: 'One',
    role: 'client',
  },
  token: 'token',
};
const session = { user: { id: 'one' }, access_token: 'token' } as Session;
function Harness() {
  useAppSession();
  return null;
}
let view: TestRenderer.ReactTestRenderer;
beforeEach(async () => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  invalidateAuthInitialization();
  await AsyncStorage.clear();
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
    isLoggingOut: false,
    isSendingPasswordReset: false,
    isInitialized: false,
    isPasswordRecovery: false,
    error: null,
  });
  jest.mocked(authService.restoreSession).mockResolvedValue(null);
  jest.mocked(authService.logout).mockResolvedValue();
  await act(async () => {
    view = TestRenderer.create(<Harness />);
  });
});
afterEach(() => {
  act(() => view.unmount());
  jest.useRealTimers();
});
it('does not start another restore or strand loading when SDK SIGNED_IN fires during login', async () => {
  const pending = deferred<LoginResult>();
  jest.mocked(authService.login).mockImplementation(() => {
    mockListener('SIGNED_IN', session);
    return pending.promise;
  });
  let login!: Promise<void>;
  act(() => {
    login = useAuthStore.getState().login('one@example.com', 'password');
  });
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
  expect(authService.restoreSession).toHaveBeenCalledTimes(1);
  await act(async () => {
    pending.resolve(result);
    await login;
  });
  expect(useAuthStore.getState()).toMatchObject({
    user: result.user,
    isLoading: false,
  });
});
it('clears login loading and private data when SDK SIGNED_OUT fires during explicit logout', async () => {
  act(() => useAuthStore.setState({ user: result.user, token: result.token }));
  jest.mocked(authService.logout).mockImplementation(async () => {
    mockListener('SIGNED_OUT', null);
  });
  await act(async () => {
    await useAuthStore.getState().logout();
  });
  expect(useAuthStore.getState()).toMatchObject({
    user: null,
    token: null,
    isLoading: false,
    isLoggingOut: false,
  });
  expect(mockResetProjects).toHaveBeenCalled();
  expect(mockResetNotifications).toHaveBeenCalled();
});
it('clears busy state on an external sign-out and invalidates pending restore', async () => {
  act(() =>
    useAuthStore.setState({
      user: result.user,
      token: result.token,
      isLoading: true,
      isSendingPasswordReset: true,
    }),
  );
  await act(async () => {
    mockListener('SIGNED_OUT', null);
  });
  expect(useAuthStore.getState()).toMatchObject({
    user: null,
    isLoading: false,
    isSendingPasswordReset: false,
  });
});
it('does not resubscribe to notifications just because a profile name changes', () => {
  act(() => useAuthStore.setState({ user: result.user }));
  mockFetchNotifications.mockClear();
  act(() =>
    useAuthStore.setState({ user: { ...result.user, full_name: 'Updated' } }),
  );
  expect(mockFetchNotifications).not.toHaveBeenCalled();
});
