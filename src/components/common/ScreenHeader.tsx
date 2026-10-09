import React, { JSX, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { scale, fontScale } from '../../utils/responsive';
import { overlay } from '../../../assets/styles/Colors';
import { useRoleTheme } from '../../theme/roleTheme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
  gradientColors?: readonly [string, string];
}

function ScreenHeader({
  title,
  subtitle,
  showBackButton = false,
  rightAction,
  gradientColors,
}: ScreenHeaderProps): JSX.Element {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { gradient } = useRoleTheme();

  const resolvedColors = gradientColors ?? gradient;

  return (
    <LinearGradient
      colors={resolvedColors as [string, string]}
      style={[
        styles.gradient,
        { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.topRow}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={scale(20)} color="#FFF" />
          </TouchableOpacity>
        ) : (
          rightAction ? <View style={styles.spacer} /> : null
        )}

        <Text
          style={[
            styles.title,
            showBackButton && styles.titleCentered,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {rightAction ?? (showBackButton ? <View style={styles.spacer} /> : null)}
      </View>

      {subtitle ? (
        <Text style={[styles.subtitle, showBackButton && styles.subtitleCentered]}>
          {subtitle}
        </Text>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(6),
  },
  backBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: overlay.white20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: scale(36),
  },
  title: {
    fontSize: fontScale(18),
    fontWeight: '800',
    color: '#FFF',
    flex: 1,
  },
  titleCentered: {
    textAlign: 'center',
    marginHorizontal: scale(8),
  },
  subtitle: {
    fontSize: fontScale(12),
    color: overlay.white85,
  },
  subtitleCentered: {
    textAlign: 'center',
  },
});

export default ScreenHeader;
