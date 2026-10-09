import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/authStore';

type SuccessScreenRouteProp = RouteProp<RootStackParamList, 'SuccessScreen'>;

function SuccessScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<SuccessScreenRouteProp>();
    const { user } = useAuthStore();

    const isAuthenticated = route.params?.isAuthenticated ?? !!user;

    const isAuthRef = useRef(isAuthenticated);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAuthRef.current) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthenticatedTabs' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/icons/success.gif')}
                style={styles.icon}
                resizeMode="contain"
            />
            <Text style={styles.title}>Booking Berhasil!</Text>
            <Text style={styles.subtitle}>
                Terima kasih! Tim kami akan segera menghubungi Anda.
            </Text>
            <Text style={styles.timer}>
                {isAuthRef.current ? 'Kembali ke beranda dashboard...' : 'Kembali ke halaman utama...'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 32,
    },
    icon: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    timer: {
        fontSize: 12,
        color: '#999',
    },
});

export default SuccessScreen;