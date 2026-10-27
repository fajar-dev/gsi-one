import { JSX } from 'react';
import {
  ServiceDetailTemplate,
  ServiceMethodItem,
} from './components/ServiceDetailTemplate';

const methods: ServiceMethodItem[] = [
  {
    image: require('../../../assets/images/shms/Accelerometer Sensor.jpeg'),
    label: 'Accelerometer Sensor',
  },
  {
    image: require('../../../assets/images/shms/Strain Gauge.jpg'),
    label: 'Strain Gauge',
  },
  {
    image: require('../../../assets/images/shms/Tiltmeter.jpeg'),
    label: 'Tiltmeter',
  },
  {
    image: require('../../../assets/images/shms/DAQ.jpeg'),
    label: 'Data Acquisition System',
  },
];

const benefits = [
  'Monitoring kondisi struktur 24 jam real-time',
  'Deteksi dini kerusakan sebelum mencapai kondisi kritis',
  'Peringatan dini otomatis saat terjadi gempa',
  'Data historis untuk analisis tren jangka panjang',
  'Dapat dipantau jarak jauh melalui dashboard',
];

function ServiceSHMS(): JSX.Element {
  return (
    <ServiceDetailTemplate
      title="SHMS & EEWS"
      aboutText="Structural Health Monitoring System (SHMS) dan Early Earthquake Warning System (EEWS) adalah sistem pemantauan kondisi struktur secara real-time menggunakan jaringan sensor terpasang permanen. Sistem ini mampu mendeteksi perubahan perilaku struktur sedini mungkin, termasuk memberikan peringatan dini saat terjadi gempa bumi, sehingga risiko kegagalan struktur dapat diantisipasi sebelum menjadi kritis."
      methods={methods}
      benefits={benefits}
    />
  );
}

export default ServiceSHMS;
