import { ActionButton } from '../ui/ActionButton';
import { palette, touchTarget, spacing, typography } from '../../theme/tokens';
import {
  useNavigation,
  useRoute,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { scale, fontScale } from '../../utils/responsive';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/Feather';

const BottomNav = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const focusedChildName = getFocusedRouteNameFromRoute(route);
  const activeRouteName =
    route.name === 'AuthenticatedTabs'
      ? focusedChildName ?? 'Dashboard'
      : route.name;

  const isBerandaActive =
    activeRouteName === 'Dashboard' || activeRouteName === 'Home';
  const isLayananActive = activeRouteName === 'LayananKami';
  const isPortofolioActive = activeRouteName === 'Partners';
  const isProyekActive = activeRouteName === 'Projects';
  const isProfilActive = activeRouteName === 'Profile';
  const isBookActive = activeRouteName === 'BookSurvey';
  const isAkunActive = activeRouteName === 'Login';

  if (user) {
    return (
      <View
        style={[
          styles.container,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : scale(8) },
        ]}
      >
        <View style={styles.topBorder} />

        <View style={styles.tabContainer}>
          <ActionButton
            style={styles.tab}
            onPress={() =>
              navigation.navigate('AuthenticatedTabs', { screen: 'Dashboard' })
            }
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Icon
              name="grid"
              size={scale(22)}
              color={isBerandaActive ? '#0B7552' : '#A0AEC0'}
            />
            <Text
              style={[
                styles.tabLabel,
                isBerandaActive && styles.tabLabelActive,
              ]}
            >
              Beranda
            </Text>
          </ActionButton>

          <ActionButton
            style={styles.tab}
            onPress={() =>
              navigation.navigate('AuthenticatedTabs', { screen: 'Projects' })
            }
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Icon
              name="briefcase"
              size={scale(22)}
              color={isProyekActive ? '#0B7552' : '#A0AEC0'}
            />
            <Text
              style={[styles.tabLabel, isProyekActive && styles.tabLabelActive]}
            >
              Proyek
            </Text>
          </ActionButton>

          <ActionButton
            style={styles.tab}
            onPress={() =>
              navigation.navigate('AuthenticatedTabs', { screen: 'Profile' })
            }
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Icon
              name="user"
              size={scale(22)}
              color={isProfilActive ? '#0B7552' : '#A0AEC0'}
            />
            <Text
              style={[styles.tabLabel, isProfilActive && styles.tabLabelActive]}
            >
              Profil
            </Text>
          </ActionButton>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : scale(8) },
      ]}
    >
      <View style={styles.topBorder} />

      <View style={styles.tabContainer}>
        <ActionButton
          style={styles.tab}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Icon
            name="home"
            size={scale(22)}
            color={isBerandaActive ? '#0B7552' : '#A0AEC0'}
          />
          <Text
            style={[styles.tabLabel, isBerandaActive && styles.tabLabelActive]}
          >
            Beranda
          </Text>
        </ActionButton>

        <ActionButton
          style={styles.tab}
          onPress={() => navigation.navigate('LayananKami')}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Icon
            name="grid"
            size={scale(22)}
            color={isLayananActive ? '#0B7552' : '#A0AEC0'}
          />
          <Text
            style={[styles.tabLabel, isLayananActive && styles.tabLabelActive]}
          >
            Layanan
          </Text>
        </ActionButton>

        <View style={styles.floatingButtonContainer}>
          <ActionButton
            style={[styles.floatingButton, isBookActive && styles.staticStyle1]}
            onPress={() => navigation.navigate('BookSurvey')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Tambah"
          >
            <Icon name="plus" size={scale(24)} color={palette.white} />
          </ActionButton>
        </View>

        <ActionButton
          style={styles.tab}
          onPress={() => navigation.navigate('Partners')}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Icon
            name="briefcase"
            size={scale(22)}
            color={isPortofolioActive ? '#0B7552' : '#A0AEC0'}
          />
          <Text
            style={[
              styles.tabLabel,
              isPortofolioActive && styles.tabLabelActive,
            ]}
          >
            Portofolio
          </Text>
        </ActionButton>

        <ActionButton
          style={styles.tab}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Icon
            name="user"
            size={scale(22)}
            color={isAkunActive ? '#0B7552' : '#A0AEC0'}
          />
          <Text
            style={[styles.tabLabel, isAkunActive && styles.tabLabelActive]}
          >
            Akun
          </Text>
        </ActionButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  staticStyle1: { backgroundColor: '#095d41' },

  container: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    elevation: 16,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    position: 'relative',
    zIndex: 999,
  },
  topBorder: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scale(6),
  },
  tab: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: scale(spacing.xs),
  },
  tabLabel: {
    fontSize: fontScale(typography.caption),
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: scale(spacing.xs),
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#0B7552',
    fontWeight: 'bold',
  },
  floatingButtonContainer: {
    width: scale(56),
    height: scale(56),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(spacing.xs),
    position: 'relative',
    overflow: 'visible',
    zIndex: 1000,
  },
  floatingButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    position: 'absolute',
    top: -scale(22),
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#0B7552',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0B7552',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 1001,
  },
});

export default BottomNav;
