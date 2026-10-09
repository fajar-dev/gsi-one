import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Modal,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

import { servicesData, ServiceTarget } from '../../data/services';

const ServicesSection = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelectService = (target: ServiceTarget) => {
        setIsModalVisible(false);
        if (target.type === 'service') {
            navigation.navigate(target.screen);
        } else {
            navigation.navigate('StructureDetail', { id: target.structureId });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Our Experience</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Services')}>
                    <Text style={styles.seeAllText}>Lihat Semua  ›</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {servicesData.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => handleSelectService(item.target)}
                    >
                        <ImageBackground
                            source={item.image}
                            style={styles.cardBg}
                            imageStyle={styles.cardImageStyle}
                        >
                            {}
                            <View style={styles.overlay} />

                            {}
                            <View style={styles.iconCircle}>
                                <Icon name={item.icon} size={scale(16)} color="#FFF" />
                            </View>

                            {}
                            <Text style={styles.cardLabel}>{item.name}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalDragHandle} />

                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleContainer}>
                                <Text style={styles.modalTitle}>Semua Layanan GSI</Text>
                                <Text style={styles.modalSubtitle}>
                                    Pilih layanan untuk melihat detail teknis dan cakupan pekerjaan.
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Icon name="x" size={scale(20)} color="#4A5568" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalListContent}
                        >
                            {servicesData.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.serviceItemCard}
                                    activeOpacity={0.8}
                                    onPress={() => handleSelectService(item.target)}
                                >
                                    <View style={styles.serviceItemIconCircle}>
                                        <Icon name={item.icon} size={scale(20)} color="#0B7552" />
                                    </View>
                                    <View style={styles.serviceItemBody}>
                                        <View style={styles.serviceTitleRow}>
                                            <Text style={styles.serviceItemTitle}>{item.title}</Text>
                                            <View style={styles.badgeContainer}>
                                                <Text style={styles.badgeText}>{item.badge}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.serviceItemDesc}>{item.desc}</Text>
                                    </View>
                                    <Icon name="chevron-right" size={scale(18)} color="#A0AEC0" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scale(28),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: scale(16),
        marginBottom: scale(14),
    },
    sectionTitle: {
        fontSize: fontScale(15),
        fontWeight: 'bold',
        color: '#1A202C',
    },
    seeAllText: {
        fontSize: fontScale(12),
        color: '#0B7552',
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingLeft: scale(16),
        paddingRight: scale(8),
    },
    card: {
        width: scale(105),
        height: scale(140),
        marginRight: scale(10),
        borderRadius: scale(16),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    cardBg: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: scale(12),
        paddingHorizontal: scale(4),
    },
    cardImageStyle: {
        borderRadius: scale(16),
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 42, 63, 0.45)', 
    },
    iconCircle: {
        width: scale(34),
        height: scale(34),
        borderRadius: scale(17),
        backgroundColor: 'rgba(11, 117, 82, 0.9)', 
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    cardLabel: {
        fontSize: fontScale(10.5),
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: scale(14),
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: scale(24),
        borderTopRightRadius: scale(24),
        paddingHorizontal: scale(20),
        paddingBottom: scale(32),
        maxHeight: '80%',
    },
    modalDragHandle: {
        width: scale(40),
        height: scale(4),
        borderRadius: scale(2),
        backgroundColor: '#CBD5E1',
        alignSelf: 'center',
        marginTop: scale(12),
        marginBottom: scale(12),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: scale(16),
    },
    modalTitleContainer: {
        flex: 1,
        marginRight: scale(12),
    },
    modalTitle: {
        fontSize: fontScale(18),
        fontWeight: 'bold',
        color: '#0F172A',
    },
    modalSubtitle: {
        fontSize: fontScale(12),
        color: '#64748B',
        marginTop: scale(4),
        lineHeight: scale(16),
    },
    closeButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalListContent: {
        paddingBottom: scale(12),
    },
    serviceItemCard: {
        backgroundColor: '#FFF',
        borderRadius: scale(16),
        padding: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    serviceItemIconCircle: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
        backgroundColor: '#F0FDF4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    serviceItemBody: {
        flex: 1,
        marginRight: scale(8),
    },
    serviceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(4),
    },
    serviceItemTitle: {
        fontSize: fontScale(13),
        fontWeight: 'bold',
        color: '#0F172A',
        flex: 1,
        marginRight: scale(6),
    },
    badgeContainer: {
        backgroundColor: '#E6F4EA',
        paddingHorizontal: scale(8),
        paddingVertical: scale(2),
        borderRadius: scale(6),
    },
    badgeText: {
        fontSize: fontScale(9.5),
        color: '#0B7552',
        fontWeight: 'bold',
    },
    serviceItemDesc: {
        fontSize: fontScale(11),
        color: '#64748B',
        lineHeight: scale(15),
    },
});

export default ServicesSection;