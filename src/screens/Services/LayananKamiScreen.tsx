import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import BottomNav from '../../components/BottomNav';
import { scale, fontScale } from '../../utils/responsive';

import { meLayananData, LayananItem } from '../../data/layanan';

function LayananKamiScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    const handleSelectLayanan = (item: LayananItem) => {
        navigation.navigate('LayananDetail', { id: item.id });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#062A3F" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View
                    style={[
                        styles.bannerContainer,
                        { paddingTop: insets.top > 0 ? insets.top + scale(12) : scale(16) },
                    ]}
                >
                    <View style={styles.topHeaderRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            activeOpacity={0.7}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-left" size={scale(20)} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.bannerTitle}>Layanan Kami</Text>
                        <View style={styles.headerPlaceholder} />
                    </View>

                    <Text style={styles.bannerSubtitle}>
                        Solusi komprehensif investigasi teknik, asesmen keandalan aset, desain perbaikan struktur, SHMS, hingga EEWS.
                    </Text>
                </View>

                <View style={styles.listContainer}>
                    {meLayananData.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.serviceCard}
                            activeOpacity={0.88}
                            onPress={() => handleSelectLayanan(item)}
                        >
                            <ImageBackground
                                source={item.bannerImage}
                                style={styles.cardImageBg}
                                imageStyle={styles.cardImageStyle}
                            >
                                <View style={styles.cardOverlay} />
                                <View style={styles.cardHeaderRow}>
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{item.badge}</Text>
                                    </View>
                                    <View style={styles.iconCircle}>
                                        <Icon name={item.icon} size={scale(16)} color="#FFF" />
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardDesc} numberOfLines={2}>
                                        {item.desc}
                                    </Text>
                                    <View style={styles.actionRow}>
                                        <Text style={styles.actionText}>Lihat Detail Layanan</Text>
                                        <Icon name="chevron-right" size={scale(14)} color="#38BDF8" />
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.ctaCard}>
                    <View style={styles.ctaTextContainer}>
                        <Text style={styles.ctaTitle}>Butuh Konsultasi & Survei Lokasi?</Text>
                        <Text style={styles.ctaDesc}>
                            Diskusikan kebutuhan audit, inspeksi, dan investigasi struktur bersama tim ahli GSI.
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('BookSurvey')}
                    >
                        <Text style={styles.ctaButtonText}>Book Survey Now</Text>
                        <Icon name="calendar" size={scale(16)} color="#FFF" style={{ marginLeft: scale(6) }} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    scrollContent: {
        paddingBottom: scale(28),
    },
    bannerContainer: {
        backgroundColor: '#062A3F',
        paddingHorizontal: scale(16),
        paddingBottom: scale(20),
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    topHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(12),
    },
    backButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerTitle: {
        fontSize: fontScale(18),
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    headerPlaceholder: {
        width: scale(36),
    },
    bannerSubtitle: {
        fontSize: fontScale(12.5),
        color: '#CBD5E0',
        lineHeight: scale(18),
        marginTop: scale(4),
    },
    listContainer: {
        paddingHorizontal: scale(16),
        paddingTop: scale(16),
    },
    serviceCard: {
        height: scale(180),
        borderRadius: scale(18),
        marginBottom: scale(16),
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    cardImageBg: {
        flex: 1,
        justifyContent: 'space-between',
        padding: scale(14),
    },
    cardImageStyle: {
        borderRadius: scale(18),
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 42, 63, 0.65)',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeContainer: {
        backgroundColor: 'rgba(11, 117, 82, 0.9)',
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: scale(12),
    },
    badgeText: {
        color: '#FFF',
        fontSize: fontScale(10),
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    iconCircle: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFooter: {
        zIndex: 1,
    },
    cardTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: scale(4),
    },
    cardDesc: {
        fontSize: fontScale(11.5),
        color: '#E2E8F0',
        lineHeight: scale(16),
        marginBottom: scale(6),
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: fontScale(11),
        fontWeight: 'bold',
        color: '#38BDF8',
        marginRight: scale(4),
    },
    ctaCard: {
        marginHorizontal: scale(16),
        marginTop: scale(8),
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    ctaTextContainer: {
        marginBottom: scale(12),
    },
    ctaTitle: {
        fontSize: fontScale(14),
        fontWeight: 'bold',
        color: '#1A202C',
        marginBottom: scale(4),
    },
    ctaDesc: {
        fontSize: fontScale(11.5),
        color: '#718096',
        lineHeight: scale(16),
    },
    ctaButton: {
        backgroundColor: '#0B7552',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(10),
        borderRadius: scale(10),
    },
    ctaButtonText: {
        color: '#FFF',
        fontSize: fontScale(12.5),
        fontWeight: 'bold',
    },
});

export default LayananKamiScreen;
