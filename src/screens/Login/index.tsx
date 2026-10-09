import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, Image,
    KeyboardAvoidingView, Platform, ScrollView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';
import { scale, fontScale, SCREEN_WIDTH } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Login(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const { login, isLoading, user } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    useEffect(() => {
        if (user) {
            navigation.reset({ index: 0, routes: [{ name: 'AuthenticatedTabs' }] });
        }
    }, [user, navigation]);

    const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
            await login(email, password);
            navigation.reset({ index: 0, routes: [{ name: 'AuthenticatedTabs' }] });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga';
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
            style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#024734" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>

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
                        end={{ x: 1, y: 0.9 }}>

                        <TouchableOpacity
                            style={[
                                styles.backButton,
                                { top: insets.top > 0 ? insets.top + scale(8) : scale(16) }
                            ]}
                            onPress={handleBack}
                            activeOpacity={0.7}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                            <Icon name="arrow-left" size={scale(22)} color="#FFF" />
                        </TouchableOpacity>

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
                        <MCIcon name="ticket-outline" size={scale(20)} color="#8A9A95" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="GSI-XXXX-XXXXXX"
                            placeholderTextColor="#8A9A95"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <Text style={styles.inputLabel}>Kata Sandi</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={scale(20)} color="#8A9A95" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="••••••••••••"
                            placeholderTextColor="#8A9A95"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                            <Icon name={showPassword ? "eye" : "eye-off"} size={scale(20)} color="#8A9A95" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.8}>
                            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                                {rememberMe && <Icon name="check" size={scale(12)} color="#FFF" />}
                            </View>
                            <Text style={styles.checkboxLabel}>Ingat Saya</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.helpLink}>Butuh Bantuan?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.9}>
                        {isLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>Masuk</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomSection}>

                    <View style={styles.infoPanel}>
                        <View style={styles.infoIconContainer}>
                            <MCIcon name="ticket-confirmation-outline" size={scale(20)} color="#FFF" />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoTitle}>Belum Menerima Nomor Tiket?</Text>
                            <Text style={styles.infoDescription}>
                                Nomor tiket dan kata sandi diberikan oleh tim GSI setelah proyek terdaftar.
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.hubungiButton}
                            onPress={() => Alert.alert('Hubungi GSI', 'Silakan hubungi WhatsApp GSI di nomor kontak yang tertera pada website resmi.')}>
                            <Text style={styles.hubungiText}>Hubungi GSI</Text>
                            <Icon name="chevron-right" size={scale(14)} color="#0B7552" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.guestButton}
                        onPress={() => navigation.navigate('Home')}
                        activeOpacity={0.9}>
                        <Icon name="log-in" size={scale(18)} color="#0B7552" style={styles.guestIcon} />
                        <Text style={styles.guestButtonText}>Kembali sebagai Tamu</Text>
                    </TouchableOpacity>

                    <View style={styles.securityContainer}>
                        <MCIcon name="shield-check" size={scale(20)} color="#0B7552" style={styles.securityIcon} />
                        <Text style={styles.securityText}>
                            Data dan dokumen proyek Anda dilindungi dengan sistem keamanan GSI.
                        </Text>
                    </View>

                    <View style={styles.footerLinksRow}>
                        <TouchableOpacity onPress={() => Alert.alert('Kebijakan Privasi', 'Kebijakan Privasi GSI')}>
                            <Text style={styles.footerLink}>Kebijakan Privasi</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerDivider}>•</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Bantuan', 'Bantuan Layanan GSI')}>
                            <Text style={styles.footerLink}>Bantuan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: scale(32),
    },
    headerContainer: {
        height: scale(320),
        position: 'relative',
        overflow: 'hidden',
        borderBottomLeftRadius: scale(28),
        borderBottomRightRadius: scale(28),
    },
    headerBackgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: SCREEN_WIDTH,
        height: scale(320),
    },
    headerGradientOverlay: {
        flex: 1,
        paddingHorizontal: scale(20),
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: scale(16),
        zIndex: 999,
        elevation: 10,
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(20),
        marginBottom: scale(16),
    },
    logoContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.6)',
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
        fontSize: fontScale(20),
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: scale(10),
    },
    headerTitle: {
        fontSize: fontScale(24),
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: scale(8),
    },
    headerSubtitle: {
        fontSize: fontScale(13),
        color: '#CBE5DD',
        textAlign: 'center',
        lineHeight: scale(18),
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderRadius: scale(24),
        marginHorizontal: scale(16),
        marginTop: -scale(36),
        paddingHorizontal: scale(20),
        paddingVertical: scale(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    cardTitle: {
        fontSize: fontScale(18),
        fontWeight: 'bold',
        color: '#0D3A2F',
        marginBottom: scale(20),
    },
    inputLabel: {
        fontSize: fontScale(13),
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: scale(8),
        marginTop: scale(14),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: scale(12),
        backgroundColor: '#FCFDFD',
        paddingHorizontal: scale(12),
        height: scale(48),
    },
    inputIcon: {
        marginRight: scale(10),
    },
    textInput: {
        flex: 1,
        fontSize: fontScale(14),
        color: '#2D3748',
        paddingVertical: 0,
    },
    eyeButton: {
        padding: scale(6),
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: scale(16),
        marginBottom: scale(24),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: scale(18),
        height: scale(18),
        borderRadius: scale(4),
        borderWidth: 1.5,
        borderColor: '#0B7552',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(8),
    },
    checkboxActive: {
        backgroundColor: '#0B7552',
    },
    checkboxLabel: {
        fontSize: fontScale(13),
        color: '#4A5568',
        fontWeight: '500',
    },
    helpLink: {
        fontSize: fontScale(13),
        color: '#0B7552',
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#0B7552',
        borderRadius: scale(12),
        height: scale(48),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0B7552',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    loginButtonDisabled: {
        backgroundColor: '#A0AEC0',
        shadowOpacity: 0,
        elevation: 0,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: fontScale(15),
        fontWeight: 'bold',
    },
    bottomSection: {
        paddingHorizontal: scale(16),
        marginTop: scale(20),
    },
    infoPanel: {
        flexDirection: 'row',
        backgroundColor: '#EBF5F1',
        borderWidth: 1,
        borderColor: '#CDE3D9',
        borderRadius: scale(16),
        padding: scale(14),
        alignItems: 'center',
        marginBottom: scale(16),
    },
    infoIconContainer: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#0B7552',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    infoTextContainer: {
        flex: 1,
        marginRight: scale(8),
    },
    infoTitle: {
        fontSize: fontScale(13),
        fontWeight: 'bold',
        color: '#0D3A2F',
        marginBottom: scale(2),
    },
    infoDescription: {
        fontSize: fontScale(10),
        color: '#4A5568',
        lineHeight: scale(14),
    },
    hubungiButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hubungiText: {
        fontSize: fontScale(11),
        color: '#0B7552',
        fontWeight: 'bold',
        marginRight: scale(2),
    },
    guestButton: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#0B7552',
        borderRadius: scale(12),
        height: scale(48),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(24),
    },
    guestIcon: {
        marginRight: scale(8),
    },
    guestButtonText: {
        color: '#0B7552',
        fontSize: fontScale(14),
        fontWeight: 'bold',
    },
    securityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(20),
        marginBottom: scale(20),
    },
    securityIcon: {
        marginRight: scale(8),
    },
    securityText: {
        flex: 1,
        fontSize: fontScale(10),
        color: '#718096',
        lineHeight: scale(14),
    },
    footerLinksRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLink: {
        fontSize: fontScale(12),
        color: '#0B7552',
        fontWeight: '500',
    },
    footerDivider: {
        fontSize: fontScale(12),
        color: '#A0AEC0',
        marginHorizontal: scale(12),
    },
});

export default Login;