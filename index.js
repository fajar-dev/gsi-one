import { registerAlerts } from './src/platform/registerAlerts';
import { registerFonts } from './src/platform/registerFonts';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  registerFonts();
  registerAlerts();
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
  });
}
