import { ActionButton } from '../../components/ui/ActionButton';
import { palette, touchTarget, spacing, typography } from '../../theme/tokens';
import { memo } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { scale, fontScale } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';

const Header = memo(() => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  return (
    <View style={styles.headerWrapper}>
      <Image
        source={require('../../../assets/images/beranda_depan.png')}
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
          <ActionButton
            style={styles.brandContainer}
            activeOpacity={0.8}
            onPress={() => {
              if (user) {
                navigation.navigate('AuthenticatedTabs');
              } else {
                navigation.navigate('Home');
              }
            }}
            accessibilityRole="button"
          >
            <View style={styles.logoCircle}>
              <Image
                source={require('../../../assets/icons/gsi-logo.png')}
                style={styles.logo}
              />
            </View>
            <Text style={styles.brandName}>GSI One</Text>
          </ActionButton>

          <View style={styles.actionContainer}>
            <ActionButton
              style={styles.iconButton}
              activeOpacity={0.7}
              accessibilityLabel="Notifikasi"
              onPress={() =>
                navigation.navigate(user ? 'Notifications' : 'Login')
              }
              accessibilityRole="button"
            >
              <Icon name="bell" size={scale(20)} color={palette.white} />
            </ActionButton>
            <ActionButton
              style={styles.iconButton}
              activeOpacity={0.7}
              accessibilityLabel="Bantuan"
              onPress={() =>
                Alert.alert(
                  'Bantuan GSI One',
                  'Masuk memakai email atau nomor tiket dari administrator. Untuk meminta survei, pilih Ajukan Survei. Anda dapat meminta bantuan melalui menu Konsultasi.',
                  [
                    { text: 'Tutup', style: 'cancel' },
                    {
                      text: 'Ajukan Survei',
                      onPress: () => navigation.navigate('BookSurvey'),
                    },
                  ],
                )
              }
              accessibilityRole="button"
            >
              <Icon name="help-circle" size={scale(20)} color={palette.white} />
            </ActionButton>
            {user ? (
              <ActionButton
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('AuthenticatedTabs')}
                accessibilityRole="button"
              >
                <Text style={styles.loginButtonText}>Dashboard</Text>
              </ActionButton>
            ) : (
              <ActionButton
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
              >
                <Text style={styles.loginButtonText}>Masuk</Text>
              </ActionButton>
            )}
          </View>
        </View>

        <View style={styles.greetingSection}>
          {user ? (
            <Text style={styles.welcomeText}>
              Halo,{'\n'}
              <Text style={styles.highlightText}>
                {user.full_name || 'Client GSI'}
              </Text>
            </Text>
          ) : (
            <Text style={styles.welcomeText}>
              Selamat Datang{'\n'}di{' '}
              <Text style={styles.highlightText}>GSI One</Text>
            </Text>
          )}
          <Text style={styles.subtitleText}>
            Solusi assessment dan keamanan struktur dalam satu aplikasi.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
});

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
    top: scale(-115),
    width: '100%',
    height: '140%',
  },
  headerGradientOverlay: {
    paddingBottom: scale(64),
    paddingHorizontal: scale(spacing.xl),
  },
  topRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(spacing.xxl),
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: scale(10),
    overflow: 'hidden',
  },
  logo: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    resizeMode: 'cover',
    transform: [{ scale: 1.35 }],
  },
  brandName: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    color: palette.white,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    alignItems: 'center',
    padding: scale(6),
    marginRight: scale(spacing.sm),
    position: 'relative',
  },

  loginButton: {
    alignItems: 'center',
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    borderWidth: 1.5,
    borderColor: palette.white,
    borderRadius: scale(10),
    paddingHorizontal: scale(14),
    paddingVertical: scale(5),
    marginLeft: scale(spacing.xs),
  },
  loginButtonText: {
    color: palette.white,
    fontSize: fontScale(typography.caption),
    fontWeight: 'bold',
  },
  greetingSection: {
    marginTop: scale(spacing.xs),
  },
  welcomeText: {
    fontSize: fontScale(26),
    fontWeight: 'bold',
    color: palette.white,
    lineHeight: scale(34),
  },
  highlightText: {
    color: '#4ade80',
  },
  subtitleText: {
    fontSize: fontScale(13),
    color: '#D1E6DF',
    marginTop: scale(10),
    lineHeight: scale(18),
    maxWidth: '85%',
  },
});

export default Header;
