import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '../../store/authStore';

const ClientRegisterBanner = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

                <TouchableOpacity
                    style={styles.actionButton}
                    activeOpacity={0.8}
                    onPress={() => {
                        if (user) {
                            navigation.navigate('AuthenticatedTabs');
                        } else {
                            navigation.navigate('Login');
                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {user ? 'Buka Dashboard' : 'Masuk ke Akun'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scale(28),
        paddingHorizontal: scale(16),
    },
    banner: {
        flexDirection: 'row',
        backgroundColor: '#EBF5F1', 
        borderWidth: 1,
        borderColor: '#CDE3D9',
        borderRadius: scale(16),
        padding: scale(12),
        alignItems: 'center',
    },
    iconCircle: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    textContainer: {
        flex: 1,
        marginRight: scale(8),
    },
    title: {
        fontSize: fontScale(12.5),
        fontWeight: 'bold',
        color: '#0D3A2F',
        marginBottom: scale(2),
    },
    subtitle: {
        fontSize: fontScale(10),
        color: '#4A5568',
        lineHeight: scale(13),
    },
    actionButton: {
        backgroundColor: '#0B7552',
        borderRadius: scale(8),
        paddingVertical: scale(8),
        paddingHorizontal: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: fontScale(10.5),
        fontWeight: 'bold',
    },
});

export default ClientRegisterBanner;
