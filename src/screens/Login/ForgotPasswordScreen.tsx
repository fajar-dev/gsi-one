import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../../assets/styles/Colors';
import { useAuthStore } from '../../store/authStore';
import Icon from 'react-native-vector-icons/Feather';
import { scale } from '../../utils/responsive';

function ForgotPasswordScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { sendPasswordReset, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleSendReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Masukkan alamat email Anda');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Format email tidak valid');
            return;
        }
        try {
            await sendPasswordReset(email);
            setSent(true);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Tidak dapat mengirim email reset password';
            Alert.alert('Gagal', message);
        }
    };

    if (sent) {
        return (
            <View style={styles.container}>
                <View style={styles.successBox}>
                    <Text style={styles.successIcon}>&#10004;</Text>
                    <Text style={styles.successTitle}>Email Terkirim</Text>
                    <Text style={styles.successMessage}>
                        Kami telah mengirimkan tautan reset password ke:
                    </Text>
                    <Text style={styles.emailHighlight}>{email}</Text>
                    <Text style={styles.successNote}>
                        Periksa kotak masuk atau folder spam Anda. Gunakan tautan terbaru sebelum kedaluwarsa.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.buttonText}>Kembali ke Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled">
                <View style={styles.inner}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}>
                        <Icon name="arrow-left" size={scale(20)} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Lupa Password</Text>
                    <Text style={styles.subtitle}>
                        Masukkan email akun GSI Anda. Kami akan mengirimkan tautan untuk membuat password baru.
                    </Text>

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan email terdaftar"
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                        editable={!isLoading}
                    />

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSendReset}
                        disabled={isLoading}>
                        {isLoading
                            ? <ActivityIndicator color={colors.white} />
                            : <Text style={styles.buttonText}>Kirim Tautan Reset</Text>}
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
        backgroundColor: colors.white,
        justifyContent: 'center',
    },
    inner: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 56,
        left: 24,
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 22,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: colors.textPrimary,
        backgroundColor: colors.backgroundSecondary,
        marginBottom: 24,
    },
    button: {
        backgroundColor: colors.secondary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: { backgroundColor: colors.grey },
    buttonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
    successBox: {
        padding: 32,
        alignItems: 'center',
    },
    successIcon: {
        fontSize: 56,
        color: colors.secondary,
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    successMessage: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 8,
    },
    emailHighlight: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.secondary,
        marginBottom: 16,
    },
    successNote: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
});

export default ForgotPasswordScreen;
