import { ImageSourcePropType } from 'react-native';

export type Method = {
  icon: string;
  label: string;
};

export type AimGoal = {
  label: string;
  description: string;
};

export type CaseStudy = {
  photo: ImageSourcePropType;
};

export type Step = {
  title: string;
  duration?: string;
};

export type StructureType = {
  id: string;
  name: string;
  headerTitle: string;
  icon: ImageSourcePropType;
  shortDescription: string;
  definition: string;
  methods?: Method[];
  aimGoals?: AimGoal[];
  reasons?: string[];
  benefits?: string[];
  whenNeeded?: string[];
  caseStudies: CaseStudy[];
  steps: Step[];
};

export const structures: StructureType[] = [
  {
    id: 'building',
    name: 'Building Assessment',
    headerTitle: 'Building Assessment',
    icon: require('../../assets/icons/building.png'),
    shortDescription:
      'Evaluasi kelayakan struktur gedung untuk memastikan keamanan penghuni dan kepatuhan terhadap standar bangunan.',
    definition:
      'Assessment struktur gedung adalah proses pemeriksaan dan evaluasi ' +
      'kondisi bangunan untuk mengetahui tingkat keamanan, keandalan, dan ' +
      'kelayakan struktur dalam mendukung beban yang bekerja selama masa layan.\n\n' +
      'Pemeriksaan dilakukan melalui kombinasi inspeksi visual, NDT, DT ' +
      'apabila diperlukan, serta analisis teknis untuk mengidentifikasi ' +
      'kerusakan, penurunan kualitas material, deformasi, korosi, retak, ' +
      'atau potensi kegagalan struktur lainnya.\n\n' +
      'Secara sederhana, assessment struktur berfungsi seperti "medical ' +
      'check-up" pada bangunan untuk memastikan kondisi gedung tetap aman digunakan.',
    reasons: [
      'Faktor usia dan kelelahan material',
      'Beban operasional yang terus meningkat',
      'Perubahan fungsi bangunan',
      'Gempa bumi, kebakaran, banjir, atau bencana lainnya',
      'Korosi pada elemen baja dan tulangan beton',
      'Kesalahan konstruksi atau kurangnya pemeliharaan',
    ],
    benefits: [
      'Menjamin Keselamatan Pengguna',
      'Mendeteksi Kerusakan Sejak Dini',
      'Mendukung Program Pemeliharaan Gedung',
      'Mengurangi Risiko Kegagalan Struktur',
      'Memperpanjang Umur Layanan Bangunan',
      'Mendukung Keputusan Investasi',
    ],
    caseStudies: [
      {
        photo: require('../../assets/images/projects/building-1.jpg'),
      },
      {
        photo: require('../../assets/images/projects/building-2.jpg'),
      },
      {
        photo: require('../../assets/images/projects/building-3.jpg'),
      },
      {
        photo: require('../../assets/images/projects/building-4.jpg'),
      },
      {
        photo: require('../../assets/images/projects/building-5.jpg'),
      },
    ],
    steps: [
      { title: 'Survey Visual' },
      { title: 'Pemeriksaan Khusus ' },
      { title: 'Analisis & Rekomendasi' },
      { title: 'Laporan\n Akhir' },
    ],
  },

  {
    id: 'bridge',
    name: 'Bridge Assessment',
    headerTitle: 'Bridge Assessment',
    icon: require('../../assets/icons/bridge.png'),
    shortDescription:
      'Inspeksi dan analisis kapasitas jembatan untuk menjaga keandalan struktur terhadap beban lalu lintas.',
    definition:
      'Assessment jembatan adalah proses pemeriksaan dan evaluasi kondisi ' +
      'struktur jembatan untuk mengetahui tingkat keamanan, keandalan, serta ' +
      'kapasitas aktual dalam mendukung beban lalu lintas selama masa layan.\n\n' +
      'Loading Test Jembatan adalah pengujian lapangan yang memberikan beban ' +
      'terkontrol untuk mengukur respons aktual struktur seperti lendutan, ' +
      'regangan, getaran, dan perilaku struktur lainnya.\n\n' +
      'Secara sederhana, assessment mengetahui kondisi kesehatan jembatan, ' +
      'sedangkan loading test membuktikan secara langsung kemampuan jembatan ' +
      'dalam menahan beban yang direncanakan.',
    benefits: [
      'Menjamin Keselamatan Pengguna Jalan',
      'Mengetahui Kondisi Aktual Struktur',
      'Memverifikasi Kapasitas Struktur',
      'Mendukung Program Pemeliharaan dan Rehabilitasi',
      'Mengurangi Risiko Kegagalan Struktur',
      'Mendukung Pengambilan Keputusan',
    ],
    caseStudies: [
      {
        photo: require('../../assets/images/projects/bridge-1.jpg'),
      },
      {
        photo: require('../../assets/images/projects/bridge-2.jpg'),
      },
      {
        photo: require('../../assets/images/projects/bridge-3.jpg'),
      },
      {
        photo: require('../../assets/images/projects/bridge-4.jpg'),
      },
      {
        photo: require('../../assets/images/projects/bridge-5.jpg'),
      },
    ],
    steps: [
      { title: 'Survey Visual' },
      { title: 'Pemeriksaan Khusus' },
      { title: 'Analisis & Rekomendasi' },
      { title: 'Laporan\n Akhir' },
    ],
  },

  {
    id: 'jetty',
    name: 'Jetty Assessment',
    headerTitle: 'Jetty Assessment',
    icon: require('../../assets/icons/marine.png'),
    shortDescription:
      'Pemeriksaan struktur dermaga dan tiang pancang untuk operasional bongkar muat yang aman.',
    definition:
      'Assessment struktur jetty adalah proses pemeriksaan dan evaluasi ' +
      'kondisi fasilitas jetty atau dermaga untuk mengetahui tingkat keamanan, ' +
      'keandalan, dan kelayakan struktur dalam mendukung aktivitas operasional ' +
      'seperti sandar kapal, bongkar muat, dan transfer material.\n\n' +
      'Pemeriksaan dilakukan melalui inspeksi visual, NDT, underwater ' +
      'inspection, pengukuran ketebalan material, pengujian sistem proteksi ' +
      'korosi, serta evaluasi kondisi struktur berdasarkan standar teknik berlaku.\n\n' +
      'Secara sederhana, assessment jetty memastikan dermaga masih aman ' +
      'digunakan dan mampu mendukung operasional tanpa risiko kegagalan struktur.',
    benefits: [
      'Menjamin Keselamatan Operasional',
      'Mendeteksi Kerusakan Sejak Dini',
      'Mengurangi Risiko Downtime Operasional',
      'Mendukung Program Asset Integrity Management',
      'Memperpanjang Umur Layanan Jetty',
      'Mengoptimalkan Investasi dan Anggaran Pemeliharaan',
    ],
    whenNeeded: [
      'Struktur telah beroperasi lebih dari 10 tahun',
      'Terlihat indikasi korosi, keretakan, atau kerusakan beton',
      'Akan dilakukan peningkatan kapasitas operasional',
      'Akan digunakan oleh kapal dengan ukuran atau beban lebih besar',
      'Terjadi benturan kapal yang berpotensi merusak struktur',
      'Setelah kejadian cuaca ekstrem, gempa bumi, atau insiden operasional',
      'Sebagai bagian dari program inspeksi dan pemeliharaan berkala',
    ],
    caseStudies: [
      {
        photo: require('../../assets/images/projects/jetty-1.jpg'),
      },
      {
        photo: require('../../assets/images/projects/jetty-2.jpg'),
      },
      {
        photo: require('../../assets/images/projects/jetty-3.jpg'),
      },
      {
        photo: require('../../assets/images/projects/jetty-4.jpg'),
      },
      {
        photo: require('../../assets/images/projects/jetty-5.jpg'),
      },
    ],
    steps: [
      { title: 'Survey Visual' },
      { title: 'Pemeriksaan Khusus' },
      { title: 'Analisis & Rekomendasi' },
      { title: 'Laporan\n Akhir' },
    ],
  },

  {
    id: 'industrial',
    name: 'Industrial Assessment',
    headerTitle: 'Industrial Assessment',
    icon: require('../../assets/icons/industrial.png'),
    shortDescription:
      'Asesmen struktur dan pengelolaan integritas aset bangunan industri untuk menjaga keamanan dan kelancaran operasional.',
    definition:
      'Assessment dan Asset Integrity Gedung Industri adalah proses pemeriksaan, ' +
      'evaluasi, serta pengelolaan kondisi aset bangunan industri untuk memastikan ' +
      'struktur tetap aman, andal, dan mampu mendukung operasional secara berkelanjutan.\n\n' +
      'Assessment berfokus pada identifikasi kondisi aktual struktur, sedangkan ' +
      'Asset Integrity Management (AIM) merupakan pendekatan yang lebih komprehensif ' +
      'untuk menjaga keandalan aset sepanjang umur layan melalui inspeksi berkala, ' +
      'pemantauan kondisi, evaluasi risiko, dan program pemeliharaan yang terencana.\n\n' +
      'Secara sederhana, assessment bertujuan mengetahui kondisi aset saat ini, ' +
      'sedangkan asset integrity memastikan aset tersebut tetap aman dan produktif ' +
      'di masa mendatang.',
    methods: [
      { icon: '👁️', label: 'Inspeksi Visual' },
      { icon: '〰️', label: 'Analisis Vibrasi' },
      { icon: '🌡️', label: 'Thermal Imaging' },
      { icon: '⚖️', label: 'Cek Beban Struktur' },
    ],
    reasons: [
      'Mesin dan peralatan berat',
      'Crane dan hoist system',
      'Getaran akibat proses produksi',
      'Paparan bahan kimia korosif',
      'Suhu tinggi pada area proses industri',
      'Beban dinamis akibat aktivitas operasional',
    ],
    benefits: [
      'Menjamin Keselamatan Personel dan Operasional',
      'Mendeteksi Kerusakan Sejak Dini',
      'Mengurangi Risiko Gangguan Produksi',
      'Mengoptimalkan Program Pemeliharaan',
      'Memperpanjang Umur Layanan Aset',
      'Mendukung Kepatuhan terhadap Regulasi',
    ],
    aimGoals: [
      {
        label: 'Aman (Safe)',
        description:
          'Tidak menimbulkan risiko terhadap pekerja, lingkungan, maupun operasional.',
      },
      {
        label: 'Andal (Reliable)',
        description:
          'Mampu berfungsi sesuai kapasitas desain selama masa operasional.',
      },
      {
        label: 'Tersedia (Available)',
        description:
          'Mengurangi risiko downtime yang dapat menghambat proses produksi.',
      },
      {
        label: 'Berkelanjutan (Sustainable)',
        description:
          'Memaksimalkan umur layanan aset dengan biaya pemeliharaan yang lebih efisien.',
      },
    ],
    caseStudies: [
      {
        photo: require('../../assets/images/projects/industrial-1.jpg'),
      },
      {
        photo: require('../../assets/images/projects/industrial-2.jpg'),
      },
      {
        photo: require('../../assets/images/projects/industrial-3.jpg'),
      },
      {
        photo: require('../../assets/images/projects/industrial-4.jpg'),
      },
      {
        photo: require('../../assets/images/projects/industrial-5.jpg'),
      },
    ],
    steps: [
      { title: 'Survey Visual' },
      { title: 'Pemeriksaan Khusus' },
      { title: 'Analisis & Rekomendasi' },
      { title: 'Laporan\n Akhir' },
    ],
  },

  {
    id: 'dam',
    name: 'DAM Assessment',
    headerTitle: 'DAM Assessment',
    icon: require('../../assets/icons/dam.png'),
    shortDescription:
      'Evaluasi keandalan struktur bendungan untuk mitigasi risiko di sekitar area waduk.',
    definition:
      'Assessment bendungan adalah proses pemeriksaan, evaluasi, dan analisis ' +
      'kondisi struktur bendungan untuk memastikan keamanan, keandalan, dan ' +
      'kemampuan dalam menjalankan fungsinya sesuai desain yang berlaku.\n\n' +
      'Pemeriksaan dilakukan secara menyeluruh terhadap komponen utama seperti ' +
      'tubuh bendungan, spillway, intake tower, outlet works, lereng, fondasi, ' +
      'hingga kondisi geoteknik dan hidrologi yang mempengaruhi kinerja bendungan.\n\n' +
      'Secara sederhana, assessment bendungan merupakan "pemeriksaan kesehatan" ' +
      'yang memastikan bendungan tetap aman dalam menahan dan mengendalikan ' +
      'volume air yang sangat besar.',
    benefits: [
      'Menjamin Keselamatan Bendungan',
      'Mendeteksi Potensi Kerusakan Sejak Dini',
      'Mengurangi Risiko Kegagalan Bendungan',
      'Mendukung Program Operasi dan Pemeliharaan',
      'Memperpanjang Umur Layanan Bendungan',
      'Mendukung Kepatuhan Regulasi',
    ],
    caseStudies: [
      {
        photo: require('../../assets/images/projects/DAM-1.jpg'),
      },
      {
        photo: require('../../assets/images/projects/DAM-2.jpg'),
      },
    ],
    steps: [
      { title: 'Survey Visual' },
      { title: 'Pemeriksaan Khusus' },
      { title: 'Analisis & Rekomendasi' },
      { title: 'Laporan\n Akhir' },
    ],
  },

  {
    id: 'tunnel',
    name: 'Tunnel Assessment',
    headerTitle: 'Tunnel Assessment',
    icon: require('../../assets/icons/tunnel.png'),
    shortDescription:
      'Pemeriksaan kondisi terowongan untuk menjamin keamanan lalu lintas dan mencegah keruntuhan.',
    definition:
      'Assessment terowongan adalah proses pemeriksaan, evaluasi, dan analisis ' +
      'kondisi struktur terowongan untuk memastikan keamanan, keandalan, dan ' +
      'kelayakan operasional selama masa layan.\n\n' +
      'Pemeriksaan dilakukan terhadap seluruh komponen terowongan mulai dari ' +
      'lining beton, shotcrete, sistem drainase, sistem penyangga, deformasi ' +
      'struktur, hingga kondisi geoteknik di sekitar terowongan.\n\n' +
      'Secara sederhana, assessment terowongan memastikan terowongan tetap aman ' +
      'digunakan, mampu menahan tekanan tanah dan air, serta mendukung ' +
      'operasional secara optimal.',
    benefits: [
      'Menjamin Keselamatan Pengguna',
      'Mendeteksi Kerusakan Sejak Dini',
      'Mengurangi Risiko Gangguan Operasional',
      'Mendukung Program Pemeliharaan',
      'Memperpanjang Umur Layanan Terowongan',
      'Mendukung Kepatuhan Regulasi dan Keselamatan',
    ],
    caseStudies: [
      {
        photo: require('../../assets/images/projects/Tunnel-1.jpg'),
      },
      {
        photo: require('../../assets/images/projects/Tunnel-2.jpg'),
      },
    ],
    steps: [
      { title: 'Survey Visual' },
      { title: 'Pemeriksaan Khusus' },
      { title: 'Analisis & Rekomendasi' },
      { title: 'Laporan\n Akhir' },
    ],
  },
];
