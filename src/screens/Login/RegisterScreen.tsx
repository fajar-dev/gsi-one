import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert,
    ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../../assets/styles/Colors';
import { useAuthStore } from '../../store/authStore';
import { openWhatsAppConsultation } from '../../utils/whatsapp';

function RegisterScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { register, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRegister = async () => {
        if (!form.full_name || !form.email || !form.password || !form.confirm_password) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }
        if (!validateEmail(form.email)) {
            Alert.alert('Error', 'Format email tidak valid');
            return;
        }
        if (form.password.length < 8) {
            Alert.alert('Error', 'Password minimal 8 karakter');
            return;
        }
        if (form.password !== form.confirm_password) {
            Alert.alert('Error', 'Password tidak sama');
            return;
        }
        try {
            await register(form.email, form.password, form.full_name);
            Alert.alert(
                'Registrasi Berhasil!',
                'Akun berhasil dibuat. Silakan login.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga';
            Alert.alert('Info Pendaftaran', message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.title}>Pendaftaran Akun GSI</Text>
                    <Text style={styles.subtitle}>Daftar untuk mulai menggunakan GSI App</Text>

                    <View style={styles.infoBanner}>
                        <Text style={styles.infoBannerTitle}>💡 Informasi Pendaftaran</Text>
                        <Text style={styles.infoBannerText}>
                            Seluruh akun (Klien & Staf) dikelola dan didaftarkan langsung oleh Administrator GSI One untuk menjaga keamanan data proyek.
                        </Text>
                        <TouchableOpacity
                            style={styles.whatsappBannerBtn}
                            onPress={() => openWhatsAppConsultation('Halo Tim GSI, saya ingin meminta pembuatan akun pengguna baru GSI App.')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.whatsappBannerBtnText}>Hubungi Admin via WhatsApp</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>
                        Nama Lengkap <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan nama lengkap"
                        placeholderTextColor={colors.textSecondary}
                        value={form.full_name}
                        onChangeText={(v) => handleChange('full_name', v)}
                    />

                    <Text style={styles.label}>
                        Email <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan email"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(v) => handleChange('email', v)}
                    />

                    <Text style={styles.label}>
                        Password <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Minimal 8 karakter"
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry={!showPassword}
                            value={form.password}
                            onChangeText={(v) => handleChange('password', v)}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeButton}>
                            <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>
                        Konfirmasi Password <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Ulangi password"
                            placeholderTextColor={colors.textSecondary}
                            secureTextEntry={!showConfirmPassword}
                            value={form.confirm_password}
                            onChangeText={(v) => handleChange('confirm_password', v)}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeButton}>
                            <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '🙈'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}>
                        {isLoading
                            ? <ActivityIndicator color={colors.white} />
                            : <Text style={styles.buttonText}>Kirim Permohonan Akun</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.linkText}>
                            Sudah punya akun? <Text style={styles.link}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
        marginTop: 16,
    },
    required: { color: colors.secondary },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.backgroundSecondary,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.textPrimary,
    },
    eyeButton: { padding: 12 },
    eyeIcon: { fontSize: 20 },
    button: {
        backgroundColor: colors.secondary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 32,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: { backgroundColor: colors.grey },
    buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    infoBanner: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    infoBannerTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E40AF',
        marginBottom: 6,
    },
    infoBannerText: {
        fontSize: 13,
        color: '#1E3A8A',
        lineHeight: 18,
        marginBottom: 12,
    },
    whatsappBannerBtn: {
        backgroundColor: '#25D366',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
    },
    whatsappBannerBtnText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '700',
    },
    linkText: {
        textAlign: 'center',
        marginTop: 24,
        color: colors.textSecondary,
        fontSize: 14,
    },
    link: { color: colors.secondary, fontWeight: '600' },
});

export default RegisterScreen;