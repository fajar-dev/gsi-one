import React, { JSX } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { scale, fontScale } from '../../utils/responsive';
import { colors } from '../../../assets/styles/Colors';
import { useStructureDetail } from './hooks/useStructureDetail';
import { StructureCarousel } from './components/StructureCarousel';

function StructureDetail(): JSX.Element {
    const insets = useSafeAreaInsets();
    const {
        data,
        navigation,
        carouselRef,
        activeIndex,
        handleConsultation,
    } = useStructureDetail();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#002239" />

            <LinearGradient
                colors={['#002239', '#0F9F67']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.header,
                    { paddingTop: insets.top > 0 ? insets.top + scale(10) : scale(16) }
                ]}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={scale(22)} color="#FFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{data.headerTitle}</Text>

                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}>

                <View style={styles.detailHeader}>
                    <View style={styles.titleIconChip}>
                        <Image
                            source={data.icon}
                            style={styles.titleIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.titleBlock}>
                        <Text style={styles.titleText}>{data.name}</Text>
                        <Text style={styles.subText}>{data.shortDescription}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.eyebrow}>
                        <View style={styles.eyebrowDot} />
                        <Text style={styles.eyebrowLabel}>Mengenal Assessment Ini</Text>
                        <View style={styles.eyebrowLine} />
                    </View>

                    {data.definition.split('\n\n').map((para: string, i: number) => (
                        <Text key={i} style={[
                            styles.definition,
                            i < data.definition.split('\n\n').length - 1 && styles.definitionSpaced,
                        ]}>
                            {para}
                        </Text>
                    ))}
                </View>

                {data.reasons && data.reasons.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.eyebrow}>
                            <View style={styles.eyebrowDot} />
                            <Text style={styles.eyebrowLabel}>Mengapa Assessment Penting?</Text>
                            <View style={styles.eyebrowLine} />
                        </View>
                        <Text style={styles.reasonsIntro}>
                            Seiring bertambahnya usia, kualitas struktur dapat menurun akibat:
                        </Text>
                        <View style={styles.bulletList}>
                            {data.reasons.map((item: string, index: number) => (
                                <View key={index} style={styles.bulletItem}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {data.benefits && data.benefits.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.eyebrow}>
                            <View style={styles.eyebrowDot} />
                            <Text style={styles.eyebrowLabel}>Manfaat</Text>
                            <View style={styles.eyebrowLine} />
                        </View>
                        <View style={styles.benefitsGrid}>
                            {data.benefits.map((item: string, index: number) => (
                                <View key={index} style={styles.benefitItem}>
                                    <Text style={styles.benefitCheck}>✓</Text>
                                    <Text style={styles.benefitText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {data.aimGoals && data.aimGoals.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.eyebrow}>
                            <View style={styles.eyebrowDot} />
                            <Text style={styles.eyebrowLabel}>Asset Integrity Management</Text>
                            <View style={styles.eyebrowLine} />
                        </View>
                        <Text style={styles.reasonsIntro}>
                            Strategi pengelolaan aset yang menjaga bangunan industri tetap:
                        </Text>
                        {data.aimGoals.map((goal: { label: string; description: string }, index: number) => (
                            <View key={index} style={styles.aimCard}>
                                <Text style={styles.aimLabel}>✔ {goal.label}</Text>
                                <Text style={styles.aimDescription}>{goal.description}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {data.whenNeeded && data.whenNeeded.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.eyebrow}>
                            <View style={styles.eyebrowDot} />
                            <Text style={styles.eyebrowLabel}>Kapan Perlu Dilakukan?</Text>
                            <View style={styles.eyebrowLine} />
                        </View>
                        <View style={styles.bulletList}>
                            {data.whenNeeded.map((item: string, index: number) => (
                                <View key={index} style={styles.bulletItem}>
                                    <Text style={styles.bulletDot}>•</Text>
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <View style={styles.eyebrow}>
                        <View style={styles.eyebrowDot} />
                        <Text style={styles.eyebrowLabel}>Project Experiences</Text>
                        <View style={styles.eyebrowLine} />
                    </View>
                    <StructureCarousel
                        carouselRef={carouselRef}
                        caseStudies={data.caseStudies}
                        activeIndex={activeIndex}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.eyebrow}>
                        <View style={styles.eyebrowDot} />
                        <Text style={styles.eyebrowLabel}>Proses Pengerjaan</Text>
                        <View style={styles.eyebrowLine} />
                    </View>
                    <View style={styles.stepRow}>
                        {data.steps.map((step: { title: string; duration?: string }, index: number) => (
                            <React.Fragment key={index}>
                                <View style={styles.stepItem}>
                                    <View style={styles.stepNumCircle}>
                                        <Text style={styles.stepNumText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepTitle}>{step.title}</Text>
                                    <Text style={styles.stepDuration}>{step.duration}</Text>
                                </View>
                                {index < data.steps.length - 1 && (
                                    <View style={styles.stepConnector} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.ctaButton} onPress={handleConsultation}>
                    <Text style={styles.ctaButtonText}>Konsultasi {data.name}</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontScale(17),
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: { width: scale(38) },
    content: { flex: 1 },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    titleIconChip: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    titleIcon: { width: 32, height: 32 },
    titleBlock: { flex: 1 },
    titleText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    subText: {
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    eyebrow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    eyebrowDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginRight: 7,
    },
    eyebrowLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginRight: 7,
    },
    eyebrowLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.borderLight,
    },
    definition: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
        textAlign: 'justify',
    },
    definitionSpaced: {
        marginBottom: 10,
    },
    reasonsIntro: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'justify',
        marginBottom: 10,
        lineHeight: 20,
    },
    bulletList: { marginTop: 4 },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bulletDot: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 8,
        lineHeight: 20,
        fontWeight: '700',
    },
    bulletText: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    aimCard: {
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
    },
    aimLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    aimDescription: {
        fontSize: 12,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    benefitsGrid: { marginTop: 4 },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    benefitCheck: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        marginRight: 10,
        lineHeight: 20,
    },
    benefitText: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    stepItem: {
        flex: 1,
        alignItems: 'center',
    },
    stepNumCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#E6F4EE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    stepNumText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
    stepTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: 2,
    },
    stepDuration: {
        fontSize: 10,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    stepConnector: {
        width: 16,
        height: 1,
        backgroundColor: colors.borderLight,
        marginTop: 14,
    },
    ctaButton: {
        backgroundColor: '#0F9F67',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 24,
    },
    ctaButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
    },
    bottomSpacer: { height: 40 },
});

export default StructureDetail;