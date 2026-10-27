import { ActionButton } from '../ui/ActionButton';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  palette,
  spacing,
  touchTarget,
  radius,
  typography,
} from '../../theme/tokens';
interface Props {
  message: string | null;
  onRetry?: () => void;
}
export function ErrorNotice({
  message,
  onRetry,
}: Props): React.ReactElement | null {
  if (!message) return null;
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <ActionButton
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retry}
        >
          <Text style={styles.label}>Coba Lagi</Text>
        </ActionButton>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3F2',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  message: { color: palette.error, fontSize: typography.body, lineHeight: 20 },
  retry: {
    alignItems: 'center',
    minHeight: touchTarget.minSize,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  label: { color: palette.error, fontWeight: '700', fontSize: typography.body },
});
