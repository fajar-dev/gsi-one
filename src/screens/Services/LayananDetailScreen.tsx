import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { RootStackParamList } from '../../types/navigation';
import { meLayananData, LayananItem } from '../../data/layanan';
import { scale, fontScale } from '../../utils/responsive';

type LayananDetailRouteProp = RouteProp<RootStackParamList, 'LayananDetail'>;

function LayananDetailScreen(): React.ReactElement {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<LayananDetailRouteProp>();
    const insets = useSafeAreaInsets();

    const { id } = route.params || {};
    const item: LayananItem | undefined = meLayananData.find((l) => l.id === id) || meLayananData[0];

    if (!item) {
        return (
            <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Layanan tidak ditemukan</Text>
                <TouchableOpacity style={styles.backBtnBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtnText}>Kembali</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#062A3F" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <ImageBackground source={item.bannerImage} style={styles.heroBanner} imageStyle={styles.heroImageStyle}>
                    <View style={styles.heroOverlay} />

                    <View style={[styles.headerRow, { paddingTop: insets.top > 0 ? insets.top + scale(8) : scale(16) }]}>
                        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                            <Icon name="arrow-left" size={scale(20)} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                    </View>

                    <View style={styles.heroBody}>
                        <View style={styles.iconCircle}>
                            <Icon name={item.icon} size={scale(22)} color="#FFF" />
                        </View>
                        <Text style={styles.heroTitle}>{item.title}</Text>
                    </View>
                </ImageBackground>

                <View style={styles.contentBody}>

                    <View style={styles.sectionCard}>
                        <Text style={styles.sectionTitle}>Deskripsi Layanan</Text>
                        <Text style={styles.descText}>{item.desc}</Text>
                    </View>

                    {item.detailImage && (
                        <View style={styles.illustrationCard}>
                            <Text style={styles.sectionTitle}>Ilustrasi & Cakupan Kerja</Text>
                            <Image source={item.detailImage} style={styles.detailImage} resizeMode="contain" />
                        </View>
                    )}

                    {item.whenNeededItems && item.whenNeededItems.length > 0 && (
                        <View style={styles.sectionCard}>
                            <View style={styles.cardHeaderRow}>
                                <Icon name="help-circle" size={scale(18)} color="#0B7552" style={styles.cardHeaderIcon} />
                                <Text style={styles.sectionTitle}>{item.whenNeededTitle}</Text>
                            </View>
                            {item.whenNeededItems.map((bullet, idx) => (
                                <View key={idx} style={styles.bulletRow}>
                                    <View style={styles.bulletDot} />
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {item.risksItems && item.risksItems.length > 0 && (
                        <View style={styles.sectionCardWarning}>
                            <View style={styles.cardHeaderRow}>
                                <Icon name="alert-circle" size={scale(18)} color="#DC2626" style={styles.cardHeaderIcon} />
                                <Text style={styles.sectionTitleWarning}>{item.risksTitle}</Text>
                            </View>
                            {item.risksItems.map((bullet, idx) => (
                                <View key={idx} style={styles.bulletRow}>
                                    <Icon name="x-circle" size={scale(14)} color="#EF4444" style={styles.iconMargin} />
                                    <Text style={styles.bulletTextWarning}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {item.solutionsItems && item.solutionsItems.length > 0 && (
                        <View style={styles.sectionCard}>
                            <View style={styles.cardHeaderRow}>
                                <Icon name="layers" size={scale(18)} color="#0284C7" style={styles.cardHeaderIcon} />
                                <Text style={styles.sectionTitle}>{item.solutionsTitle}</Text>
                            </View>
                            {item.solutionsItems.map((bullet, idx) => (
                                <View key={idx} style={styles.bulletRow}>
                                    <Icon name="check" size={scale(14)} color="#0284C7" style={styles.iconMargin} />
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {item.benefits && item.benefits.length > 0 && (
                        <View style={styles.sectionCardSuccess}>
                            <View style={styles.cardHeaderRow}>
                                <Icon name="check-circle" size={scale(18)} color="#0B7552" style={styles.cardHeaderIcon} />
                                <Text style={styles.sectionTitleSuccess}>Manfaat Layanan</Text>
                            </View>
                            {item.benefits.map((bullet, idx) => (
                                <View key={idx} style={styles.bulletRow}>
                                    <Icon name="check-circle" size={scale(14)} color="#0B7552" style={styles.iconMargin} />
                                    <Text style={styles.bulletTextSuccess}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {item.outputs && item.outputs.length > 0 && (
                        <View style={styles.sectionCard}>
                            <View style={styles.cardHeaderRow}>
                                <Icon name="file-text" size={scale(18)} color="#6366F1" style={styles.cardHeaderIcon} />
                                <Text style={styles.sectionTitle}>Output yang Diterima Client</Text>
                            </View>
                            <View style={styles.outputGrid}>
                                {item.outputs.map((out, idx) => (
                                    <View key={idx} style={styles.outputTag}>
                                        <Icon name="award" size={scale(13)} color="#4F46E5" style={{ marginRight: scale(6) }} />
                                        <Text style={styles.outputTagText}>{out}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.ctaBox}>
                        <Text style={styles.ctaTitle}>Konsultasikan Kebutuhan Proyek Anda</Text>
                        <Text style={styles.ctaDesc}>
                            Tim teknis dan insinyur GSI siap membantu investigasi, evaluasi, hingga penyusunan rekomendasi teknis.
                        </Text>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('BookSurvey')}
                        >
                            <Text style={styles.ctaButtonText}>Jadwalkan Survei / Konsultasi</Text>
                            <Icon name="calendar" size={scale(16)} color="#FFF" style={{ marginLeft: scale(8) }} />
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: scale(32),
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    notFoundText: {
        fontSize: fontScale(16),
        color: '#64748B',
        marginBottom: scale(16),
    },
    backBtnBtn: {
        backgroundColor: '#0B7552',
        paddingHorizontal: scale(20),
        paddingVertical: scale(10),
        borderRadius: scale(8),
    },
    backBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    heroBanner: {
        height: scale(230),
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingBottom: scale(18),
    },
    heroImageStyle: {
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 42, 63, 0.70)',
        borderBottomLeftRadius: scale(24),
        borderBottomRightRadius: scale(24),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
    },
    backButton: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeContainer: {
        backgroundColor: '#0B7552',
        paddingHorizontal: scale(12),
        paddingVertical: scale(5),
        borderRadius: scale(12),
    },
    badgeText: {
        fontSize: fontScale(11),
        fontWeight: 'bold',
        color: '#FFF',
        textTransform: 'uppercase',
    },
    heroBody: {
        zIndex: 2,
    },
    iconCircle: {
        width: scale(42),
        height: scale(42),
        borderRadius: scale(21),
        backgroundColor: 'rgba(11, 117, 82, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    heroTitle: {
        fontSize: fontScale(18),
        fontWeight: 'bold',
        color: '#FFF',
        lineHeight: scale(24),
    },
    contentBody: {
        paddingHorizontal: scale(16),
        paddingTop: scale(16),
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: scale(14),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sectionCardWarning: {
        backgroundColor: '#FEF2F2',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: scale(14),
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    sectionCardSuccess: {
        backgroundColor: '#F0FDF4',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: scale(14),
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    cardHeaderIcon: {
        marginRight: scale(8),
    },
    sectionTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#0F172A',
    },
    sectionTitleWarning: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#991B1B',
    },
    sectionTitleSuccess: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#166534',
    },
    descText: {
        fontSize: fontScale(13),
        color: '#475569',
        lineHeight: scale(20),
        marginTop: scale(6),
    },
    illustrationCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(16),
        marginBottom: scale(14),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    detailImage: {
        width: '100%',
        height: scale(200),
        marginTop: scale(12),
        borderRadius: scale(12),
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: scale(8),
    },
    bulletDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: '#0B7552',
        marginTop: scale(7),
        marginRight: scale(10),
    },
    iconMargin: {
        marginRight: scale(8),
        marginTop: scale(2),
    },
    bulletText: {
        fontSize: fontScale(12.5),
        color: '#334155',
        flex: 1,
        lineHeight: scale(18),
    },
    bulletTextWarning: {
        fontSize: fontScale(12.5),
        color: '#7F1D1D',
        flex: 1,
        lineHeight: scale(18),
    },
    bulletTextSuccess: {
        fontSize: fontScale(12.5),
        color: '#14532D',
        flex: 1,
        lineHeight: scale(18),
    },
    outputGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: scale(4),
    },
    outputTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        paddingHorizontal: scale(10),
        paddingVertical: scale(6),
        borderRadius: scale(8),
        marginRight: scale(8),
        marginBottom: scale(8),
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    outputTagText: {
        fontSize: fontScale(11.5),
        fontWeight: '600',
        color: '#3730A3',
    },
    ctaBox: {
        backgroundColor: '#062A3F',
        borderRadius: scale(18),
        padding: scale(18),
        marginTop: scale(8),
    },
    ctaTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: scale(6),
    },
    ctaDesc: {
        fontSize: fontScale(12),
        color: '#94A3B8',
        lineHeight: scale(17),
        marginBottom: scale(14),
    },
    ctaButton: {
        backgroundColor: '#0B7552',
        borderRadius: scale(12),
        paddingVertical: scale(12),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ctaButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: fontScale(13),
    },
});

export default LayananDetailScreen;
