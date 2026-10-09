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

import { servicesData, ServiceTarget } from '../../data/services';

function ServicesScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();

    const handleSelectService = (target: ServiceTarget) => {
        if (target.type === 'service') {
            navigation.navigate(target.screen);
        } else {
            navigation.navigate('StructureDetail', { id: target.structureId });
        }
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
                        <Text style={styles.bannerTitle}>Our Experience</Text>
                        <View style={styles.headerPlaceholder} />
                    </View>

                    <Text style={styles.bannerSubtitle}>
                        Pengalaman rekayasa teknis dan asesmen keandalan berbagai jenis struktur serta infrastruktur strategis.
                    </Text>
                </View>

                <View style={styles.listContainer}>
                    {servicesData.map((item) => (
                        <TouchableOpacity
                                key={item.id}
                                style={styles.serviceCard}
                                activeOpacity={0.88}
                                onPress={() => handleSelectService(item.target)}
                            >
                                <ImageBackground
                                    source={item.image}
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
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                </View>

                <View style={styles.ctaCard}>
                    <View style={styles.ctaTextContainer}>
                        <Text style={styles.ctaTitle}>Butuh Survei Lokasi Proyek?</Text>
                        <Text style={styles.ctaDesc}>
                            Konsultasikan kebutuhan inspeksi dan jadwalkan survei lapangan langsung bersama tim ahli GSI.
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
        marginBottom: scale(14),
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
        fontSize: fontScale(17),
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    headerPlaceholder: {
        width: scale(36),
    },
    bannerSubtitle: {
        fontSize: fontScale(12),
        color: '#94A3B8',
        lineHeight: scale(17),
        marginBottom: scale(14),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        paddingHorizontal: scale(12),
        height: scale(44),
    },
    searchIcon: {
        marginRight: scale(8),
    },
    searchInput: {
        flex: 1,
        fontSize: fontScale(13),
        color: '#0F172A',
    },
    listContainer: {
        paddingHorizontal: scale(16),
        marginTop: scale(16),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: scale(40),
    },
    emptyTitle: {
        fontSize: fontScale(16),
        fontWeight: 'bold',
        color: '#334155',
        marginTop: scale(12),
    },
    emptySubtitle: {
        fontSize: fontScale(12),
        color: '#64748B',
        marginTop: scale(4),
    },
    serviceCard: {
        height: scale(170),
        borderRadius: scale(18),
        overflow: 'hidden',
        marginBottom: scale(14),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
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
        backgroundColor: 'rgba(6, 42, 63, 0.60)',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badgeContainer: {
        backgroundColor: 'rgba(11, 117, 82, 0.9)',
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: scale(8),
    },
    badgeText: {
        fontSize: fontScale(10.5),
        color: '#FFFFFF',
        fontWeight: 'bold',
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
        marginTop: 'auto',
    },
    cardTitle: {
        fontSize: fontScale(16),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: scale(4),
    },
    cardDesc: {
        fontSize: fontScale(11),
        color: '#E2E8F0',
        lineHeight: scale(15),
        marginBottom: scale(8),
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailActionText: {
        fontSize: fontScale(11.5),
        fontWeight: 'bold',
        color: '#38BDF8',
        marginRight: scale(6),
    },
    ctaCard: {
        backgroundColor: '#0B7552',
        marginHorizontal: scale(16),
        marginTop: scale(8),
        borderRadius: scale(18),
        padding: scale(18),
    },
    ctaTextContainer: {
        marginBottom: scale(12),
    },
    ctaTitle: {
        fontSize: fontScale(16),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: scale(4),
    },
    ctaDesc: {
        fontSize: fontScale(12),
        color: '#E6F4EA',
        lineHeight: scale(17),
    },
    ctaButton: {
        backgroundColor: '#062A3F',
        borderRadius: scale(10),
        paddingVertical: scale(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontScale(13),
    },
});

export default ServicesScreen;
