import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, fontScale } from '../../utils/responsive';
import Icon from 'react-native-vector-icons/Feather';

const WhyChooseGsi = () => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Mengapa Memilih GSI?</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCol}>
                        <Icon name="award" size={scale(20)} color="#FFF" style={styles.statIcon} />
                        <Text style={styles.statValue}>1000+</Text>
                        <Text style={styles.statLabel}>Proyek Sukses</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statCol}>
                        <Icon name="user-check" size={scale(20)} color="#FFF" style={styles.statIcon} />
                        <Text style={styles.statValue}>Engineer</Text>
                        <Text style={styles.statLabel}>Tim Ahli Bersertifikat</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statCol}>
                        <Icon name="globe" size={scale(20)} color="#FFF" style={styles.statIcon} />
                        <Text style={styles.statValue}>Pengalaman</Text>
                        <Text style={styles.statLabel}>Indonesia & Luar Negri</Text>
                    </View>
                </View>

                <View style={styles.rowDivider} />

                <View style={styles.statsRow}>
                    <View style={styles.statCol}>
                        <View style={styles.iconCircle}>
                            <Icon name="cpu" size={scale(16)} color="#0B7552" />
                        </View>
                        <Text style={styles.statLabelLight}>Teknologi dan{'\n'}Metode Terkini</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statCol}>
                        <View style={styles.iconCircle}>
                            <Icon name="layers" size={scale(16)} color="#0B7552" />
                        </View>
                        <Text style={styles.statLabelLight}>Solusi{'\n'}Comprehensif</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statCol}>
                        <View style={styles.iconCircle}>
                            <Icon name="headphones" size={scale(16)} color="#0B7552" />
                        </View>
                        <Text style={styles.statLabelLight}>Komitmen Layanan{'\n'}Prima</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scale(28),
        paddingHorizontal: scale(16),
    },
    card: {
        backgroundColor: '#062A3F', 
        borderRadius: scale(16),
        paddingVertical: scale(20),
        paddingHorizontal: scale(16),
    },
    title: {
        fontSize: fontScale(13),
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: scale(18),
        letterSpacing: 0.5,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIcon: {
        marginBottom: scale(8),
        opacity: 0.9,
    },
    statValue: {
        fontSize: fontScale(12.5),
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: fontScale(9.5),
        color: '#A0AEC0',
        textAlign: 'center',
        marginTop: scale(2),
    },
    statLabelLight: {
        fontSize: fontScale(9.5),
        fontWeight: '600',
        color: '#E2E8F0',
        textAlign: 'center',
        lineHeight: scale(13),
    },
    iconCircle: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#E6F4EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(8),
    },
    divider: {
        width: 1,
        height: scale(40),
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    rowDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: scale(16),
    },
});

export default WhyChooseGsi;
