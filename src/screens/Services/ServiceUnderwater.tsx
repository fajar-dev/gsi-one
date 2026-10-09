import React, { JSX } from 'react';
import { ServiceDetailTemplate, ServiceMethodItem } from './components/ServiceDetailTemplate';

const methods: ServiceMethodItem[] = [
    {
        image: require('../../../assets/images/Underwater Inspection/Ultrasonic Thickness.jpeg'),
        label: 'Underwater Ultrasonic Thickness',
    },
    {
        image: require('../../../assets/images/Underwater Inspection/Chathodic Protection.jpeg'),
        label: 'Cathodic Protection Survey',
    },
    {
        image: require('../../../assets/images/Underwater Inspection/Visual Survey Underwater.jpg'),
        label: 'Visual Survey Underwater',
    },
];

const benefits = [
    'Dilakukan oleh diver bersertifikat internasional',
    'Dokumentasi visual & video real-time',
    'Dapat menjangkau area sulit dengan ROV',
    'Minim gangguan terhadap operasional struktur',
];

function ServiceUnderwater(): JSX.Element {
    return (
        <ServiceDetailTemplate
            title="Underwater Inspection"
            aboutText="Layanan inspeksi bawah air untuk mengevaluasi kondisi struktur yang berada di dalam laut maupun perairan, seperti pondasi jetty, dermaga, dan pipa bawah laut. Inspeksi dilakukan oleh tim diver bersertifikat maupun ROV (Remotely Operated Vehicle) untuk memastikan integritas struktur tanpa mengganggu operasional yang sedang berjalan."
            methods={methods}
            benefits={benefits}
        />
    );
}

export default ServiceUnderwater;