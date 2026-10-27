import { ImageSourcePropType } from 'react-native';

export type ServiceTarget =
  | {
      type: 'service';
      screen:
        | 'ServiceNDT'
        | 'ServiceLoadingTest'
        | 'ServiceUnderwater'
        | 'ServiceSHMS';
    }
  | {
      type: 'structure';
      structureId:
        | 'building'
        | 'bridge'
        | 'jetty'
        | 'industrial'
        | 'dam'
        | 'tunnel';
    };

export interface ServiceItem {
  id: string;
  name: string;
  title: string;
  category: 'assessment' | 'testing';
  desc: string;
  image: ImageSourcePropType;
  icon: string;
  badge: string;
  target: ServiceTarget;
}

export const servicesData: ServiceItem[] = [
  {
    id: 'building',
    name: 'Building\nAssessment',
    title: 'Building Assessment',
    category: 'assessment',
    desc: 'Evaluasi kelayakan dan keandalan struktur gedung untuk keamanan penghuni dan kepatuhan standar.',
    image: require('../../assets/images/our_experience/building.png'),
    icon: 'home',
    badge: 'Gedung',
    target: { type: 'structure', structureId: 'building' },
  },
  {
    id: 'bridge',
    name: 'Bridge\nAssessment',
    title: 'Bridge Assessment',
    category: 'assessment',
    desc: 'Inspeksi dan analisis kapasitas struktur jembatan terhadap beban lalu lintas operasional.',
    image: require('../../assets/images/our_experience/bridge.png'),
    icon: 'navigation',
    badge: 'Jembatan',
    target: { type: 'structure', structureId: 'bridge' },
  },
  {
    id: 'jetty',
    name: 'Jetty\nAssessment',
    title: 'Jetty Assessment',
    category: 'assessment',
    desc: 'Pemeriksaan struktur dermaga dan tiang pancang untuk operasional bongkar muat laut yang aman.',
    image: require('../../assets/images/our_experience/jetty.png'),
    icon: 'anchor',
    badge: 'Dermaga',
    target: { type: 'structure', structureId: 'jetty' },
  },
  {
    id: 'industrial',
    name: 'Industrial\nAssessment',
    title: 'Industrial Assessment',
    category: 'assessment',
    desc: 'Asesmen struktur dan integritas aset gedung industri untuk menjaga kelancaran operasional.',
    image: require('../../assets/images/our_experience/industrial.png'),
    icon: 'tool',
    badge: 'Industri',
    target: { type: 'structure', structureId: 'industrial' },
  },
  {
    id: 'dam',
    name: 'DAM\nAssessment',
    title: 'DAM Assessment',
    category: 'assessment',
    desc: 'Evaluasi keandalan fisik dan geoteknik bendungan untuk mitigasi risiko di area waduk.',
    image: require('../../assets/images/our_experience/dam.png'),
    icon: 'layers',
    badge: 'Bendungan',
    target: { type: 'structure', structureId: 'dam' },
  },
  {
    id: 'tunnel',
    name: 'Tunnel\nAssessment',
    title: 'Tunnel Assessment',
    category: 'assessment',
    desc: 'Pemeriksaan struktur lining terowongan untuk menjamin keamanan lalu lintas transportasi.',
    image: require('../../assets/images/our_experience/tunnel.png'),
    icon: 'maximize-2',
    badge: 'Terowongan',
    target: { type: 'structure', structureId: 'tunnel' },
  },
  {
    id: 'ndt',
    name: 'Inspection\nServices',
    title: 'Inspection Services',
    category: 'testing',
    desc: 'Pemeriksaan fisik non-destructive & destructive test untuk menilai kualitas dan kekuatan material.',
    image: require('../../assets/images/our_experience/ndt.png'),
    icon: 'activity',
    badge: 'Inspection',
    target: { type: 'service', screen: 'ServiceNDT' },
  },
  {
    id: 'loading',
    name: 'Static & Dynamic\nLoading Test',
    title: 'Static & Dynamic Loading Test',
    category: 'testing',
    desc: 'Pengujian kapasitas beban statis dan dinamis pada struktur jembatan, gedung, dan infrastruktur.',
    image: require('../../assets/images/our_experience/loading.png'),
    icon: 'box',
    badge: 'Uji Beban',
    target: { type: 'service', screen: 'ServiceLoadingTest' },
  },
  {
    id: 'underwater',
    name: 'Underwater\nInspection',
    title: 'Underwater Inspection & Survey',
    category: 'testing',
    desc: 'Inspeksi struktur bawah air, batimetri, metocean survey, dan pemantauan ROV.',
    image: require('../../assets/images/our_experience/underwater.png'),
    icon: 'droplet',
    badge: 'Bawah Air',
    target: { type: 'service', screen: 'ServiceUnderwater' },
  },
  {
    id: 'shms',
    name: 'SHMS &\nEEWS',
    title: 'SHMS & EEWS',
    category: 'testing',
    desc: 'Sistem sensor dan pemantauan kesehatan kondisi fisik struktur secara kontinu & real-time.',
    image: require('../../assets/images/our_experience/shms.png'),
    icon: 'cpu',
    badge: 'Real-time',
    target: { type: 'service', screen: 'ServiceSHMS' },
  },
];
