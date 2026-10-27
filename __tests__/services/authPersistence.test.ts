import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStorage, setRememberSession } from '../../src/config/authPersistence';
describe('session persistence preference', () => {
  beforeEach(async () => { await AsyncStorage.clear(); });
  it('persists remembered sessions and deletes credentials on sign out', async () => {
    await setRememberSession(true);
    await authStorage.setItem('session-test', 'token');
    expect(await AsyncStorage.getItem('session-test')).toBe('token');
    await authStorage.removeItem('session-test');
    expect(await authStorage.getItem('session-test')).toBeNull();
  });
  it('keeps a non-remembered session in memory without retaining the old disk token', async () => {
    await AsyncStorage.setItem('ephemeral-test', 'old-token');
    await setRememberSession(false);
    await authStorage.setItem('ephemeral-test', 'new-token');
    expect(await authStorage.getItem('ephemeral-test')).toBe('new-token');
    expect(await AsyncStorage.getItem('ephemeral-test')).toBeNull();
    await authStorage.removeItem('ephemeral-test');
  });
});
