import { Alert, Platform } from 'react-native';
import { registerAlerts } from '../../src/platform/registerAlerts';
import { useAlertStore } from '../../src/store/alertStore';
jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  Platform: { OS: 'web' },
}));
beforeEach(() => {
  useAlertStore.setState({ queue: [] });
});
it('shows a web confirmation and executes the selected callback exactly once', () => {
  registerAlerts();
  const logout = jest.fn();
  Alert.alert('Keluar?', 'Konfirmasi logout', [
    { text: 'Batal' },
    { text: 'Keluar', onPress: logout },
  ]);
  expect(useAlertStore.getState().queue[0].title).toBe('Keluar?');
  useAlertStore.getState().choose(1);
  useAlertStore.getState().choose(1);
  expect(logout).toHaveBeenCalledTimes(1);
  expect(useAlertStore.getState().queue).toHaveLength(0);
});
it('does not execute the destructive callback after cancel', () => {
  const remove = jest.fn();
  useAlertStore
    .getState()
    .show('Hapus?', '', [
      { text: 'Batal' },
      { text: 'Hapus', onPress: remove },
    ]);
  useAlertStore.getState().choose(0);
  expect(remove).not.toHaveBeenCalled();
});
it('queues subsequent messages and respects cancelable dismissal', () => {
  const dismissed = jest.fn();
  useAlertStore
    .getState()
    .show('First', '', undefined, { cancelable: true, onDismiss: dismissed });
  useAlertStore.getState().show('Second');
  useAlertStore.getState().dismiss();
  expect(dismissed).toHaveBeenCalledTimes(1);
  expect(useAlertStore.getState().queue[0].title).toBe('Second');
  useAlertStore.getState().dismiss();
  expect(useAlertStore.getState().queue).toHaveLength(1);
});
it('retains the native Alert implementation on Android', () => {
  const nativeAlert = jest.fn();
  Alert.alert = nativeAlert;
  jest.replaceProperty(Platform, 'OS', 'android');
  registerAlerts();
  expect(Alert.alert).toBe(nativeAlert);
  jest.restoreAllMocks();
});
