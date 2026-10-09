import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../assets/styles/Colors';

function AboutUsSection(): React.ReactElement {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Us</Text>

            <Text style={styles.paragraph}>
                PT. Graha Survei Indonesia telah melakukan lebih dari 1000 penilaian dan pengujian struktur pada Bangunan Gedung, Jembatan, Jetty, Terowongan, Bendungan & Fasilitas Industri baik di dalam maupun luar negeri.
            </Text>

            <Text style={styles.paragraph}>
                Ketika suatu struktur mulai menua, penilaian bangunan Gedung, Jembatan, Jetty, Bendungan dan fasilitas industri menjadi semakin penting. Engineer GSI menyediakan Keahlian Teknis untuk melakukan penilaian kondisi struktur bangunan yang ada. Tim rekayasa struktural kami dilatih dan dilengkapi dengan instrumen pengujian yang berkualitas tinggi untuk melakukan pengujian non-destruktif pada baja, beton dan komposit.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: '#1A1A1A',
    },
    paragraph: {
        fontSize: 13,
        color: '#444',
        textAlign: 'justify',
        lineHeight: 20,
        marginBottom: 10,
    },
});

export default AboutUsSection;