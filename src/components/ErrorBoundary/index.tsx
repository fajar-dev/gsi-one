import { ActionButton } from '../ui/ActionButton';
import {
  buttonMetrics,
  palette,
  touchTarget,
  spacing,
  typography,
  radius,
} from '../../theme/tokens';
import React, { ReactNode, Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (__DEV__) {
      console.error('Error caught by boundary:', error);
      console.error('Error info:', errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Terjadi Kesalahan</Text>
            <Text style={styles.message}>
              {__DEV__ && this.state.error
                ? this.state.error.toString()
                : 'Aplikasi mengalami kendala. Silakan coba lagi.'}
            </Text>

            <ActionButton
              style={styles.button}
              onPress={this.resetError}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Coba Lagi</Text>
            </ActionButton>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorContainer: {
    alignItems: 'center',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: 'bold',
    color: palette.black,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.body,
    color: '#666',
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: '#007AFF',
    paddingHorizontal: spacing.section,
    paddingVertical: buttonMetrics.paddingVertical,
    borderRadius: radius.sm,
  },
  buttonText: {
    color: palette.white,
    fontSize: typography.bodyLarge,
    fontWeight: '600',
  },
});
