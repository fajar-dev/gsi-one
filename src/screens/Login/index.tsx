import { ActionButton } from '../../components/ui/ActionButton';
import { styles } from './index.styles';
import { palette } from '../../theme/tokens';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import { scale } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setRememberSession } from '../../config/authPersistence';

function Login(): React.ReactElement {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { login, isLoading, user, isPasswordRecovery } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (user && !isPasswordRecovery) {
      navigation.reset({ index: 0, routes: [{ name: 'AuthenticatedTabs' }] });
    }
  }, [user, navigation, isPasswordRecovery]);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Nomor tiket/email dan kata sandi harus diisi');
      return;
    }

    if (email.includes('@') && !validateEmail(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    try {
      await setRememberSession(rememberMe);
      await login(email, password);
      navigation.reset({ index: 0, routes: [{ name: 'AuthenticatedTabs' }] });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan tidak terduga';
      Alert.alert('Login Gagal', message);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#024734" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../assets/images/beranda_depan.png')}
            style={styles.headerBackgroundImage}
            resizeMode="cover"
          />

          <LinearGradient
            colors={['rgba(1, 24, 27, 0.94)', 'rgba(2, 115, 122, 0.75)']}
            style={styles.headerGradientOverlay}
            start={{ x: 0, y: 0.1 }}
            end={{ x: 1, y: 0.9 }}
          >
            <ActionButton
              style={[
                styles.backButton,
                { top: insets.top > 0 ? insets.top + scale(8) : scale(16) },
              ]}
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityRole="button"
              accessibilityLabel="Kembali"
            >
              <Icon name="arrow-left" size={scale(22)} color={palette.white} />
            </ActionButton>

            <View style={styles.brandRow}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../assets/icons/gsi-logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandName}>GSI One</Text>
            </View>

            <Text style={styles.headerTitle}>Selamat Datang Kembali</Text>
            <Text style={styles.headerSubtitle}>
              Masukkan nomor tiket dan kata sandi{'\n'}yang diberikan oleh GSI.
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Masuk ke Akun Client</Text>

          <Text style={styles.inputLabel}>Nomor Tiket</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="clipboard"
              size={scale(20)}
              color="#8A9A95"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="GSI-XXXX-XXXXXX"
              placeholderTextColor="#8A9A95"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="GSI-XXXX-XXXXXX"
            />
          </View>

          <Text style={styles.inputLabel}>Kata Sandi</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="lock"
              size={scale(20)}
              color="#8A9A95"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="••••••••••••"
              placeholderTextColor="#8A9A95"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="••••••••••••"
            />
            <ActionButton
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              accessibilityRole="button"
            >
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={scale(20)}
                color="#8A9A95"
              />
            </ActionButton>
          </View>

          <View style={styles.actionsRow}>
            <ActionButton
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxActive]}
              >
                {rememberMe && (
                  <Icon name="check" size={scale(12)} color={palette.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Ingat Saya</Text>
            </ActionButton>

            <ActionButton
              onPress={() => navigation.navigate('ForgotPassword')}
              accessibilityRole="button"
            >
              <Text style={styles.helpLink}>Butuh Bantuan?</Text>
            </ActionButton>
          </View>

          <ActionButton
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.9}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.loginButtonText}>Masuk</Text>
            )}
          </ActionButton>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.infoPanel}>
            <View style={styles.infoIconContainer}>
              <Icon
                name="check-square"
                size={scale(20)}
                color={palette.white}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Belum Menerima Nomor Tiket?</Text>
              <Text style={styles.infoDescription}>
                Nomor tiket dan kata sandi diberikan oleh tim GSI setelah proyek
                terdaftar.
              </Text>
            </View>
            <ActionButton
              style={styles.hubungiButton}
              onPress={() =>
                Alert.alert(
                  'Hubungi GSI',
                  'Silakan hubungi WhatsApp GSI di nomor kontak yang tertera pada website resmi.',
                )
              }
              accessibilityRole="button"
            >
              <Text style={styles.hubungiText}>Hubungi GSI</Text>
              <Icon name="chevron-right" size={scale(14)} color="#0B7552" />
            </ActionButton>
          </View>

          <ActionButton
            style={styles.guestButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.9}
            accessibilityRole="button"
          >
            <Icon
              name="log-in"
              size={scale(18)}
              color="#0B7552"
              style={styles.guestIcon}
            />
            <Text style={styles.guestButtonText}>Kembali sebagai Tamu</Text>
          </ActionButton>

          <View style={styles.securityContainer}>
            <Icon
              name="shield"
              size={scale(20)}
              color="#0B7552"
              style={styles.securityIcon}
            />
            <Text style={styles.securityText}>
              Data dan dokumen proyek Anda dilindungi dengan sistem keamanan
              GSI.
            </Text>
          </View>

          <View style={styles.footerLinksRow}>
            <ActionButton
              onPress={() =>
                Alert.alert('Kebijakan Privasi', 'Kebijakan Privasi GSI')
              }
              accessibilityRole="button"
            >
              <Text style={styles.footerLink}>Kebijakan Privasi</Text>
            </ActionButton>
            <Text style={styles.footerDivider}>•</Text>
            <ActionButton
              onPress={() => Alert.alert('Bantuan', 'Bantuan Layanan GSI')}
              accessibilityRole="button"
            >
              <Text style={styles.footerLink}>Bantuan</Text>
            </ActionButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Login;
