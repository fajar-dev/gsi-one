import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, RootStackNavigationProp } from '../../types/navigation';
import { insightsData } from '../../data/insights';
import { scale, fontScale } from '../../utils/responsive';

type InsightDetailRouteProp = RouteProp<RootStackParamList, 'InsightDetail'>;

const InsightDetailScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute<InsightDetailRouteProp>();
    const insets = useSafeAreaInsets();
    const { id } = route.params || {};

    const article = insightsData.find((item) => item.id === id) || insightsData[0];

    const handleConsultation = () => {
        navigation.navigate('BookSurvey');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#002239" />

            <LinearGradient
                colors={['#002239', '#0F9F67']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.header,
                    { paddingTop: insets.top > 0 ? insets.top + scale(10) : scale(16) },
                ]}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-left" size={scale(22)} color="#FFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    Insight Struktur
                </Text>

                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.imageContainer}>
                    <Image source={article.image} style={styles.heroImage} resizeMode="contain" />
                </View>

                <View style={styles.articleHeader}>
                    <View style={styles.badgeRow}>
                        <View style={styles.categoryBadge}>
                            <Icon name="book-open" size={scale(12)} color="#0B7552" />
                            <Text style={styles.categoryBadgeText}>Insight Struktur</Text>
                        </View>
                        <Text style={styles.metaText}>{article.readTime}</Text>
                    </View>

                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.dateText}>{article.date} • Dipublikasikan oleh Tim GSI</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.sectionContainer}>
                    {article.intro.map((p, idx) => (
                        <Text key={idx} style={styles.paragraphText}>
                            {p}
                        </Text>
                    ))}
                </View>

                {article.sections.map((section, sIdx) => (
                    <View key={sIdx} style={styles.sectionCard}>
                        <Text style={styles.sectionHeading}>{section.heading}</Text>
                        {section.body.map((bText, bIdx) => (
                            <Text key={bIdx} style={styles.paragraphText}>
                                {bText}
                            </Text>
                        ))}
                        {section.listItems && section.listItems.length > 0 && (
                            <View style={styles.listContainer}>
                                {section.listItems.map((item, lIdx) => (
                                    <View key={lIdx} style={styles.listItemRow}>
                                        <View style={styles.bulletDot} />
                                        <Text style={styles.listItemText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                <View style={styles.conclusionCard}>
                    <LinearGradient
                        colors={['#0F766E', '#0B7552']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.conclusionGradient}
                    >
                        <View style={styles.conclusionHeaderRow}>
                            <Icon name="shield" size={scale(22)} color="#FFF" style={{ marginRight: scale(10) }} />
                            <Text style={styles.conclusionTitle}>{article.conclusion.heading}</Text>
                        </View>

                        {article.conclusion.body.map((cText, cIdx) => (
                            <Text key={cIdx} style={styles.conclusionText}>
                                {cText}
                            </Text>
                        ))}

                        <TouchableOpacity
                            style={styles.consultButton}
                            activeOpacity={0.85}
                            onPress={handleConsultation}
                        >
                            <Text style={styles.consultButtonText}>Konsultasi Sekarang</Text>
                            <Icon name="chevron-right" size={scale(18)} color="#0B7552" />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                <View style={{ height: scale(40) }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F8F7',
    },
    header: {
        paddingBottom: scale(16),
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: scale(20),
        borderBottomRightRadius: scale(20),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    backButton: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontScale(17),
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        flex: 1,
    },
    placeholder: {
        width: scale(38),
    },
    scrollContent: {
        paddingHorizontal: scale(16),
        paddingTop: scale(16),
    },
    imageContainer: {
        width: '100%',
        height: scale(180),
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(16),
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    heroImage: {
        width: '85%',
        height: '85%',
    },
    articleHeader: {
        marginBottom: scale(16),
        backgroundColor: '#FFF',
        padding: scale(14),
        borderRadius: scale(14),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(10),
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F4EA',
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: scale(20),
    },
    categoryBadgeText: {
        fontSize: fontScale(11),
        fontWeight: 'bold',
        color: '#0B7552',
        marginLeft: scale(6),
    },
    metaText: {
        fontSize: fontScale(11.5),
        color: '#64748B',
        fontWeight: '500',
    },
    articleTitle: {
        fontSize: fontScale(17),
        fontWeight: 'bold',
        color: '#0F172A',
        lineHeight: scale(24),
        marginBottom: scale(8),
    },
    dateText: {
        fontSize: fontScale(11),
        color: '#94A3B8',
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: scale(16),
    },
    sectionContainer: {
        marginBottom: scale(16),
        backgroundColor: '#FFF',
        padding: scale(14),
        borderRadius: scale(14),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    paragraphText: {
        fontSize: fontScale(13),
        color: '#334155',
        lineHeight: scale(21),
        marginBottom: scale(12),
    },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(14),
        padding: scale(14),
        marginBottom: scale(16),
        borderLeftWidth: 3,
        borderLeftColor: '#0B7552',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    sectionHeading: {
        fontSize: fontScale(14.5),
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: scale(10),
        lineHeight: scale(20),
    },
    listContainer: {
        marginTop: scale(6),
        paddingLeft: scale(4),
    },
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(6),
    },
    bulletDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: '#0B7552',
        marginRight: scale(10),
    },
    listItemText: {
        fontSize: fontScale(12.5),
        color: '#475569',
        fontWeight: '500',
    },
    conclusionCard: {
        borderRadius: scale(18),
        overflow: 'hidden',
        marginTop: scale(12),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    conclusionGradient: {
        padding: scale(18),
    },
    conclusionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    conclusionTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
    },
    conclusionText: {
        fontSize: fontScale(12.5),
        color: '#E2E8F0',
        lineHeight: scale(19),
        marginBottom: scale(10),
    },
    consultButton: {
        backgroundColor: '#FFF',
        borderRadius: scale(12),
        paddingVertical: scale(12),
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(8),
    },
    consultButtonText: {
        fontSize: fontScale(13),
        fontWeight: 'bold',
        color: '#0B7552',
        marginRight: scale(4),
    },
});

export default InsightDetailScreen;
