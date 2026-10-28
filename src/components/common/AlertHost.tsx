import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useAlertStore } from '../../store/alertStore';
import { ActionButton } from '../ui/ActionButton';
import { palette, spacing, radius, typography } from '../../theme/tokens';
export function AlertHost(): React.ReactElement | null {
  const current = useAlertStore(state => state.queue[0]);
  const choose = useAlertStore(state => state.choose);
  const dismiss = useAlertStore(state => state.dismiss);
  if (!current) return null;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismiss}>
      <Pressable style={styles.overlay} onPress={dismiss} accessible={false}>
        <Pressable
          style={styles.card}
          onPress={event => event.stopPropagation()}
          accessible={false}
        >
          <View accessibilityRole="alert">
            <Text style={styles.title}>{current.title}</Text>
            {!!current.message && (
              <Text style={styles.message}>{current.message}</Text>
            )}
          </View>
          <View style={styles.actions}>
            {current.buttons.map((button, index) => (
              <ActionButton
                key={`${index}-${button.text}`}
                style={styles.button}
                accessibilityRole="button"
                onPress={() => choose(index)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === 'destructive' && styles.destructive,
                  ]}
                >
                  {button.text || 'OK'}
                </Text>
              </ActionButton>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: palette.white,
  },
  title: {
    fontSize: typography.heading,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: typography.body,
    lineHeight: 22,
    color: palette.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  button: { paddingHorizontal: spacing.md },
  buttonText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: palette.brand,
  },
  destructive: { color: palette.error },
});
