import React, { JSX } from 'react';
import { ServiceDetailTemplate, ServiceMethodItem, ServiceMethodDetail } from './components/ServiceDetailTemplate';

const methods: ServiceMethodItem[] = [
    {
        image: require('../../../assets/images/Loading Test Static & Dynamic/Static Loading.jpeg'),
        label: 'Static Load Test',
    },
    {
        image: require('../../../assets/images/Loading Test Static & Dynamic/Dynamic Loading.jpeg'),
        label: 'Dynamic Load Test',
    },
];

const methodDetails: ServiceMethodDetail[] = [
    {
        title: 'Static Loading Test',
        description:
            'Pengujian dengan memberikan beban statis menggunakan truk atau kendaraan uji yang ditempatkan pada posisi tertentu di atas jembatan. Mengevaluasi lendutan, regangan, distribusi beban, dan kekakuan struktur serta memverifikasi bahwa perilaku jembatan masih sesuai dengan desain dan batas yang diizinkan.',
        parameters: [
            'Lendutan (deflection)',
            'Regangan (strain)',
            'Perpindahan (displacement)',
            'Elastisitas — kemampuan struktur kembali ke kondisi semula setelah beban dilepas',
        ],
    },
    {
        title: 'Dynamic Loading Test',
        description:
            'Pengujian dengan memanfaatkan beban bergerak, biasanya kendaraan uji yang melintas pada kecepatan tertentu atau dilakukan impact load untuk mengevaluasi respons dinamis jembatan terhadap getaran selama operasional.',
        parameters: [
            'Frekuensi alami (natural frequency)',
            'Percepatan getaran (acceleration)',
            'Rasio redaman (damping ratio)',
            'Faktor amplifikasi dinamis (Dynamic Amplification Factor / DAF)',
            'Respons getaran akibat kendaraan yang melintas',
        ],
    },
];

const benefits = [
    'Akurasi pengukuran tinggi',
    'Validasi performa struktur real-time',
    'Analisa keamanan beban maksimum',
    'Dokumentasi hasil pengujian lengkap',
];

function ServiceLoadingTest(): JSX.Element {
    return (
        <ServiceDetailTemplate
            title="Loading Test Service"
            aboutText="Layanan Static dan Dynamic Loading Test untuk mengevaluasi kapasitas dan respons struktur jembatan terhadap beban statis maupun dinamis. Pengujian dilakukan menggunakan alat terkalibrasi untuk memverifikasi bahwa perilaku struktur masih sesuai dengan desain dan standar teknis yang berlaku."
            methods={methods}
            methodDetails={methodDetails}
            benefits={benefits}
        />
    );
}

export default ServiceLoadingTest;