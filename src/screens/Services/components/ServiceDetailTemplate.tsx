import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    ImageSourcePropType,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { scale, fontScale } from '../../../utils/responsive';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
}

export interface ServiceMethodItem {
    image: ImageSourcePropType;
    label: string;
}

export interface ServiceMethodDetail {
    title: string;
    description: string;
    parameters?: string[];
}

export interface ServiceDetailTemplateProps {
    title: string;
    aboutText: React.ReactNode | string;
    methods?: ServiceMethodItem[];
    methodDetails?: ServiceMethodDetail[];
    benefits?: string[];
    ctaText?: string;
    onCtaPress?: () => void;
}

export const ServiceDetailTemplate: React.FC<ServiceDetailTemplateProps> = ({
    title,
    aboutText,
    methods = [],
    methodDetails,
    benefits = [],
    ctaText = 'Ajukan Survei Sekarang',
    onCtaPress,
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const insets = useSafeAreaInsets();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    const handleCta = () => {
        if (onCtaPress) {
            onCtaPress();
        } else {
            navigation.navigate('BookSurvey');
        }
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
                    activeOpacity={0.7}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={scale(22)} color="#FFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{title}</Text>

                <View style={styles.placeholder} />
            </LinearGradient>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cardSection}>
                    <Text style={styles.sectionTitle}>Tentang Layanan</Text>
                    {typeof aboutText === 'string' ? (
                        <Text style={styles.sectionText}>{aboutText}</Text>
                    ) : (
                        aboutText
                    )}
                </View>

                {methods.length > 0 && (
                    <View style={styles.cardSection}>
                        <Text style={styles.sectionTitle}>Metode Pengujian</Text>
                        <View style={styles.methodsGrid}>
                            {methods.map((item, index) => (
                                <View key={index} style={styles.methodCard}>
                                    <View style={styles.methodIcon}>
                                        <Image
                                            source={item.image}
                                            style={styles.methodImage}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <Text style={styles.methodLabel} numberOfLines={2}>
                                        {item.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {methodDetails && methodDetails.length > 0 && (
                    <View style={styles.cardSection}>
                        <Text style={styles.sectionTitle}>Detail Pengujian</Text>
                        {methodDetails.map((detail, index) => {
                            const isExpanded = expandedIndex === index;
                            return (
                                <View key={index} style={styles.accordionCard}>
                                    <TouchableOpacity
                                        style={styles.accordionHeader}
                                        activeOpacity={0.7}
                                        onPress={() => toggleAccordion(index)}
                                    >
                                        <Text style={styles.accordionTitle}>{detail.title}</Text>
                                        <Icon
                                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                            size={scale(18)}
                                            color="#0F9F67"
                                        />
                                    </TouchableOpacity>

                                    {isExpanded && (
                                        <View style={styles.accordionBody}>
                                            <Text style={styles.accordionDesc}>{detail.description}</Text>
                                            {detail.parameters && detail.parameters.length > 0 && (
                                                <View style={styles.paramSection}>
                                                    <Text style={styles.paramHeading}>Parameter yang Diukur:</Text>
                                                    {detail.parameters.map((param, pIdx) => (
                                                        <View key={pIdx} style={styles.paramRow}>
                                                            <View style={styles.paramBullet} />
                                                            <Text style={styles.paramText}>{param}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {benefits.length > 0 && (
                    <View style={styles.cardSection}>
                        <Text style={styles.sectionTitle}>Keunggulan</Text>
                        {benefits.map((item, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <View style={styles.bulletIconCircle}>
                                    <Icon name="check" size={scale(12)} color="#0B7552" />
                                </View>
                                <Text style={styles.benefitText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.ctaButton}
                    activeOpacity={0.85}
                    onPress={handleCta}
                >
                    <Text style={styles.ctaButtonText}>{ctaText}</Text>
                </TouchableOpacity>
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
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: scale(16),
        paddingBottom: scale(32),
    },
    cardSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(14),
        padding: scale(16),
        marginBottom: scale(14),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: fontScale(15),
        fontWeight: '700',
        color: '#002239',
        marginBottom: scale(10),
    },
    sectionText: {
        fontSize: fontScale(13),
        color: '#555555',
        lineHeight: scale(20),
    },
    methodsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -scale(4),
    },
    methodCard: {
        width: '33.33%',
        paddingHorizontal: scale(4),
        marginBottom: scale(12),
        alignItems: 'center',
    },
    methodIcon: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(12),
        backgroundColor: '#F0F5F3',
        overflow: 'hidden',
        marginBottom: scale(6),
    },
    methodImage: {
        width: '100%',
        height: '100%',
    },
    methodLabel: {
        fontSize: fontScale(11),
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
        lineHeight: scale(15),
    },
    accordionCard: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: scale(10),
        marginBottom: scale(10),
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scale(12),
        backgroundColor: '#F8FAFC',
    },
    accordionTitle: {
        fontSize: fontScale(13),
        fontWeight: '700',
        color: '#002239',
        flex: 1,
    },
    accordionBody: {
        padding: scale(12),
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    accordionDesc: {
        fontSize: fontScale(12),
        color: '#4A5568',
        lineHeight: scale(18),
        marginBottom: scale(10),
    },
    paramSection: {
        marginTop: scale(6),
        paddingTop: scale(8),
        borderTopWidth: 1,
        borderTopColor: '#EDF2F7',
    },
    paramHeading: {
        fontSize: fontScale(12),
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: scale(6),
    },
    paramRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(4),
    },
    paramBullet: {
        width: scale(5),
        height: scale(5),
        borderRadius: scale(2.5),
        backgroundColor: '#0F9F67',
        marginRight: scale(8),
    },
    paramText: {
        fontSize: fontScale(11),
        color: '#4A5568',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    bulletIconCircle: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: '#E6F4EE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10),
    },
    benefitText: {
        fontSize: fontScale(13),
        color: '#333333',
        flex: 1,
    },
    ctaButton: {
        backgroundColor: '#0F9F67',
        borderRadius: scale(12),
        paddingVertical: scale(14),
        alignItems: 'center',
        marginTop: scale(8),
        elevation: 3,
        shadowColor: '#0F9F67',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    ctaButtonText: {
        fontSize: fontScale(14),
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
