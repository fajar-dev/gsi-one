import { ActionButton } from '../../../components/ui/ActionButton';
import {
  palette,
  touchTarget,
  spacing,
  typography,
} from '../../../theme/tokens';
import { JSX, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AuthenticatedNavigationProp } from '../../../types/navigation';
import { colors, overlay, neutral } from '../../../theme/colors';
import { scale, fontScale } from '../../../utils/responsive';
import { useAuthStore } from '../../../store/authStore';
import { useNotificationStore } from '../../../store/notificationStore';

interface DashboardHeaderProps {
  gradientColors: readonly [string, string];
  userName: string;
  initials: string;
  greetingLabel?: string;
  roleLabel: string;
  roleIcon: string;
  rolePillStyle?: object;
  subtitle: string;
  companyName?: string;
}

function DashboardHeader({
  gradientColors: _gradientColors,
  userName,
  initials,
  greetingLabel = 'Selamat Datang,',
  roleLabel,
  roleIcon,
  rolePillStyle,
  subtitle,
  companyName,
}: DashboardHeaderProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<AuthenticatedNavigationProp>();
  const { user } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id, user.role);
    }
  }, [user, fetchNotifications]);

  return (
    <View style={styles.headerWrapper}>
      <Image
        source={require('../../../../assets/images/beranda_depan.png')}
        style={styles.headerBackgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(1, 24, 27, 0.92)', 'rgba(2, 115, 122, 0.82)']}
        style={[
          styles.headerGradientOverlay,
          { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(16) },
        ]}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 0.9 }}
      >
        <View style={styles.topRow}>
          <View style={styles.brand}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../../../assets/icons/gsi-logo.png')}
                style={styles.logo}
              />
            </View>
            <Text style={styles.brandName}>GSI One</Text>
          </View>

          <View style={styles.actions}>
            <ActionButton
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityRole="button"
              accessibilityLabel="Notifikasi"
            >
              <Icon name="bell" size={scale(18)} color={palette.white} />
              {unreadCount > 0 && <View style={styles.notificationDot} />}
            </ActionButton>
            <ActionButton
              style={styles.avatarButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profile')}
              accessibilityRole="button"
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </ActionButton>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{greetingLabel}</Text>
          <Text style={styles.userName}>{userName}</Text>
          {companyName ? (
            <Text style={styles.companyName}>{companyName}</Text>
          ) : null}
          <View style={styles.badgeRow}>
            <View style={[styles.rolePill, rolePillStyle]}>
              <Icon
                name={roleIcon}
                size={12}
                color={palette.white}
                style={styles.rolePillIcon}
              />
              <Text style={styles.rolePillText}>{roleLabel}</Text>
            </View>
          </View>
          <Text style={styles.welcomeSub}>{subtitle}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: scale(28),
    borderBottomRightRadius: scale(28),
  },
  headerBackgroundImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerGradientOverlay: {
    paddingBottom: scale(36),
    paddingHorizontal: scale(spacing.xl),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(spacing.xl),
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: scale(spacing.sm),
    overflow: 'hidden',
  },
  logo: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    resizeMode: 'cover',
    transform: [{ scale: 1.35 }],
  },
  brandName: {
    fontSize: fontScale(typography.bodyLarge),
    fontWeight: '700',
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(spacing.md),
  },
  iconButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#5CAF4E',
    position: 'absolute',
    top: scale(6),
    right: scale(8),
    borderWidth: 1.5,
    borderColor: palette.brand,
  },
  avatarButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
  },
  avatar: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: fontScale(13),
    fontWeight: '700',
    color: neutral[900],
  },
  greetingSection: {
    marginTop: scale(spacing.sm),
  },
  greetingText: {
    fontSize: fontScale(typography.body),
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userName: {
    fontSize: fontScale(typography.heading),
    fontWeight: '800',
    color: colors.white,
    marginTop: scale(2),
  },
  companyName: {
    fontSize: fontScale(15),
    fontWeight: '700',
    color: '#FF9E6B',
    marginTop: scale(spacing.xs),
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(6),
    marginBottom: scale(spacing.xs),
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: overlay.white20,
    paddingHorizontal: scale(10),
    paddingVertical: scale(spacing.xs),
    borderRadius: scale(14),
    borderWidth: 1,
    borderColor: overlay.white30,
  },
  rolePillIcon: { marginRight: scale(spacing.xs) },
  rolePillText: {
    color: colors.white,
    fontSize: fontScale(typography.caption),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  welcomeSub: {
    fontSize: fontScale(typography.caption),
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: scale(6),
  },
});

export default DashboardHeader;
