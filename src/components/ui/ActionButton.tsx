import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { buttonMetrics, touchTarget } from '../../theme/tokens';

type ActionButtonProps = TouchableOpacityProps & { compact?: boolean };

/** Centers labels and gives compact actions extra hitSlop. */
export const ActionButton = forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ActionButtonProps
>(function ActionButton(
  {
    style,
    accessibilityRole = 'button',
    accessibilityState,
    disabled,
    compact = false,
    hitSlop,
    ...props
  },
  ref,
) {
  return (
    <TouchableOpacity
      {...props}
      ref={ref}
      hitSlop={hitSlop ?? (compact ? buttonMetrics.compactHitSlop : undefined)}
      accessibilityRole={
        props.accessible === false ? undefined : accessibilityRole
      }
      accessibilityState={{ ...accessibilityState, disabled: !!disabled }}
      disabled={disabled}
      style={[styles.target, style, compact && styles.compact]}
    />
  );
});
const styles = StyleSheet.create({
  compact: {
    minWidth: buttonMetrics.compactMinSize,
    minHeight: buttonMetrics.compactMinSize,
  },
  target: {
    minWidth: touchTarget.minSize,
    minHeight: touchTarget.minSize,
    justifyContent: 'center',
  },
});
