import React, { JSX } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ServiceDetailTemplate, ServiceMethodItem } from './components/ServiceDetailTemplate';
import { fontScale, scale } from '../../utils/responsive';

const methods: ServiceMethodItem[] = [
    {
        image: require('../../../assets/images/methods/3D Laser Scanner.jpeg'),
        label: '3D Laser Scanner',
    },
    {
        image: require('../../../assets/images/methods/DJI Matrice 350 RTK.jpeg'),
        label: 'DJI Matrice 350 RTK',
    },
    {
        image: require('../../../assets/images/methods/Dryfilm Thickness.jpeg'),
        label: 'Dryfilm Thickness',
    },
    {
        image: require('../../../assets/images/methods/Dye penetrant test.jpeg'),
        label: 'Dye penetrant test',
    },
    {
        image: require('../../../assets/images/methods/Ground Penetrating Radar GPR.jpeg'),
        label: 'Ground Penetrating Radar GPR',
    },
    {
        image: require('../../../assets/images/methods/Hammer Test.jpeg'),
        label: 'Hammer Test',
    },
    {
        image: require('../../../assets/images/methods/Hardness Test.jpeg'),
        label: 'Hardness Test',
    },
    {
        image: require('../../../assets/images/methods/Inclinometer Test.jpeg'),
        label: 'Inclinometer Test',
    },
    {
        image: require('../../../assets/images/methods/UltrasonicPulseVelocity.jpeg'),
        label: 'Ultrasonic Pulse Velocity (UPV)',
    },
    {
        image: require('../../../assets/images/methods/CoreDrill.jpeg'),
        label: 'Core Drill',
    },
    {
        image: require('../../../assets/images/methods/LivePunditArray.jpeg'),
        label: 'Live Pundit Array',
    },
    {
        image: require('../../../assets/images/methods/MagneticParticleInspection(MPI).jpeg'),
        label: 'Magnetic Particle Inspection (MPI)',
    },
    {
        image: require('../../../assets/images/methods/TotalStation.jpeg'),
        label: 'Total Station',
    },
    {
        image: require('../../../assets/images/methods/RebarScannerCoverMeter.jpeg'),
        label: 'Rebar Scanner & Cover Meter',
    },
    {
        image: require('../../../assets/images/methods/UPETestUltrasonicPulseEcho.jpeg'),
        label: 'Ultrasonic Pulse Echo (UPE)',
    },
    {
        image: require('../../../assets/images/Underwater Inspection/METOCEAN SURVEY.jpeg'),
        label: 'METOCEAN SURVEY',
    },
    {
        image: require('../../../assets/images/Underwater Inspection/Soil Investigation.jpeg'),
        label: 'Soil Investigation',
    },
];

const benefits = [
    'Peralatan Lengkap dan Terkini',
    'Memiliki sertifikat kalibrasi',
    'Akurasi tinggi',
    'Dapat dilakukan saat operasi berjalan',
    'Dokumen hasil pengujian lengkap',
];

function ServiceNDT(): JSX.Element {
    return (
        <ServiceDetailTemplate
            title="Inspection Services"
            aboutText={
                <Text style={styles.aboutText}>
                    Layanan Ini merupakan inspeksi menyeluruh untuk mengevaluasi kondisi, kualitas, dan integritas aset menggunakan metode visual, NDT, DT, Soil Test, Metocean Survey serta teknologi inspeksi modern lainnya.
                </Text>
            }
            methods={methods}
            benefits={benefits}
        />
    );
}

const styles = StyleSheet.create({
    aboutText: {
        fontSize: fontScale(13),
        color: '#555555',
        lineHeight: scale(20),
    },
    boldText: {
        fontWeight: '700',
        color: '#002239',
    },
});

export default ServiceNDT;
