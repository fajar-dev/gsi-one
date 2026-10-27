import { ActionButton } from '../../components/ui/ActionButton';
import {
  palette,
  touchTarget,
  spacing,
  radius,
  typography,
} from '../../theme/tokens';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../../store/authStore';

const ClientRegisterBanner = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.iconCircle}>
          <Icon name="user-check" size={scale(18)} color="#0B7552" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {user ? 'Dashboard Client GSI' : 'Sudah Menjadi Client GSI?'}
          </Text>
          <Text style={styles.subtitle}>
            {user
              ? 'Pantau progres proyek dan unduh laporan hasil inspeksi Anda.'
              : 'Masuk untuk memantau progres proyek dan mengunduh laporan.'}
          </Text>
        </View>

        <ActionButton
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={() => {
            if (user) {
              navigation.navigate('AuthenticatedTabs');
            } else {
              navigation.navigate('Login');
            }
          }}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {user ? 'Buka Dashboard' : 'Masuk ke Akun'}
          </Text>
        </ActionButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scale(28),
    paddingHorizontal: scale(spacing.lg),
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#EBF5F1',
    borderWidth: 1,
    borderColor: '#CDE3D9',
    borderRadius: scale(radius.lg),
    padding: scale(spacing.md),
    alignItems: 'center',
  },
  iconCircle: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(spacing.md),
  },
  textContainer: {
    flex: 1,
    marginRight: scale(spacing.sm),
  },
  title: {
    fontSize: fontScale(12.5),
    fontWeight: 'bold',
    color: '#0D3A2F',
    marginBottom: scale(2),
  },
  subtitle: {
    fontSize: fontScale(typography.caption),
    color: '#4A5568',
    lineHeight: scale(16),
  },
  actionButton: {
    minHeight: touchTarget.minSize,
    minWidth: touchTarget.minSize,
    backgroundColor: '#0B7552',
    borderRadius: scale(radius.sm),
    paddingVertical: scale(spacing.sm),
    paddingHorizontal: scale(spacing.md),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: palette.white,
    fontSize: fontScale(typography.caption),
    fontWeight: 'bold',
  },
});

export default ClientRegisterBanner;
