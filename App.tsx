import React from 'react';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { useAppSession } from './src/hooks/useAppSession';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { layout, palette } from './src/theme/tokens';

function Application(): React.ReactElement {
  useAppSession();
  const isInitialized = useAuthStore(state => state.isInitialized);
  return (
    <View style={[styles.frame, Platform.OS === 'web' && styles.webFrame]}>
      {isInitialized ? (
        <AppNavigator />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator
            accessibilityLabel="Aplikasi sedang dimuat"
            size="large"
            color={palette.brand}
          />
        </View>
      )}
    </View>
  );
}
export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <Application />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
const styles = StyleSheet.create({
  frame: { flex: 1, backgroundColor: palette.background },
  webFrame: {
    width: '100%',
    maxWidth: layout.webMaxWidth,
    alignSelf: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.backgroundSecondary,
  },
});
