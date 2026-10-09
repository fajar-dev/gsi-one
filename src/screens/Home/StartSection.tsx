import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

import { openWhatsAppConsultation } from '../../utils/whatsapp';
import { useAuthStore } from '../../store/authStore';

const StartSection = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useAuthStore();

    const menuItems = [
        {
            id: 1,
            label: 'Pilih\nLayanan',
            icon: 'list',
            onPress: () => navigation.navigate('LayananKami'),
        },
        {
            id: 2,
            label: 'Ajukan\nSurvei',
            icon: 'file-plus',
            onPress: () => navigation.navigate('BookSurvey'),
        },
        {
            id: 3,
            label: 'Konsultasi',
            icon: 'headphones',
            onPress: () => openWhatsAppConsultation('Halo GSI One, saya ingin konsultasi mengenai layanan & inspeksi struktur.'),
        },
        {
            id: 4,
            label: 'Cek\nStatus',
            icon: 'clock',
            onPress: () => {
                if (user) {
                    navigation.navigate('AuthenticatedTabs');
                } else {
                    navigation.navigate('Login');
                }
            },
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Mulai dari Sini</Text>
            <View style={styles.gridRow}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={item.onPress}
                    >
                        <View style={styles.iconCircle}>
                            <Icon name={item.icon} size={scale(22)} color="#0B7552" />
                        </View>
                        <Text style={styles.cardLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scale(24),
        paddingHorizontal: scale(16),
    },
    sectionTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: scale(14),
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: '23%',
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        paddingVertical: scale(14),
        paddingHorizontal: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    iconCircle: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
        backgroundColor: '#F0FDF4', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    cardLabel: {
        fontSize: fontScale(10.5),
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'center',
        lineHeight: scale(14),
    },
});

export default StartSection;
