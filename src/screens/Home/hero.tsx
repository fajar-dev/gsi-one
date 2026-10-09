import React, { memo } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

import { openWhatsAppConsultation } from '../../utils/whatsapp';

const Hero = memo(() => {
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.leftColumn}>
                    <Text style={styles.cardTitle}>
                        Konsultasikan{'\n'}Kebutuhan{'\n'}Struktur Anda
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        Dapatkan rekomendasi layanan langsung dari engineer GSI.
                    </Text>

                    <TouchableOpacity
                        style={styles.consultButton}
                        activeOpacity={0.8}
                        onPress={() => openWhatsAppConsultation('Halo GSI One, saya ingin konsultasi gratis mengenai kebutuhan struktur.')}
                    >
                        <Text style={styles.consultButtonText}>Konsultasi Gratis</Text>
                        <Icon name="arrow-right" size={scale(14)} color="#FFF" style={{ marginLeft: scale(6) }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.rightColumn}>
                    <Image
                        source={require('../../../assets/images/engineer_female.png')}
                        style={styles.engineerImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: scale(16),
        marginTop: -scale(40), 
        zIndex: 5,
    },
    cardContainer: {
        backgroundColor: '#FFF',
        borderRadius: scale(20),
        paddingHorizontal: scale(18),
        paddingVertical: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        minHeight: scale(160),
    },
    leftColumn: {
        flex: 0.58,
        justifyContent: 'center',
        paddingRight: scale(6),
    },
    cardTitle: {
        fontSize: fontScale(16.5),
        fontWeight: 'bold',
        color: '#0D3A2F',
        lineHeight: scale(21),
    },
    cardSubtitle: {
        fontSize: fontScale(10.5),
        color: '#718096',
        marginTop: scale(6),
        lineHeight: scale(14),
    },
    consultButton: {
        backgroundColor: '#0B7552',
        borderRadius: scale(12),
        paddingVertical: scale(10),
        paddingHorizontal: scale(14),
        alignSelf: 'flex-start',
        marginTop: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#0B7552',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    consultButtonText: {
        color: '#FFF',
        fontSize: fontScale(11.5),
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
    rightColumn: {
        flex: 0.42,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    engineerImage: {
        width: scale(125),
        height: scale(150),
    },
});

export default Hero;