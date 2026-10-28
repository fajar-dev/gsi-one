import { Alert, Platform } from 'react-native';
import { useAlertStore } from '../store/alertStore';
export function registerAlerts(): void {
  if (Platform.OS === 'web') Alert.alert = useAlertStore.getState().show;
}
