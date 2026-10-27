import { ImageSourcePropType } from 'react-native';

export interface InsightSection {
  heading: string;
  body: string[];
  listItems?: string[];
}

export interface InsightArticle {
  id: string;
  title: string;
  shortDesc: string;
  image: ImageSourcePropType;
  date: string;
  readTime: string;
  intro: string[];
  sections: InsightSection[];
  conclusion: {
    heading: string;
    body: string[];
    listItems?: string[];
  };
}

export const insightsData: InsightArticle[] = [
  {
    id: '5-tanda-assessment',
    title: '5 Tanda Struktur Perlu Dilakukan Assessment',
    shortDesc:
      'Kerusakan struktur sering kali tidak terjadi secara tiba-tiba. Ketahui 5 tanda awal sebelum kondisi menjadi serius.',
    image: require('../../assets/images/insight/5_tanda_assessment.png'),
    date: '27 Juli 2026',
    readTime: '3 min baca',
    intro: [
      'Kerusakan struktur sering kali tidak terjadi secara tiba-tiba. Sebelum kondisi menjadi serius, biasanya bangunan, jembatan, jetty, atau fasilitas industri telah menunjukkan tanda-tanda awal. Sayangnya, tanda tersebut sering dianggap sebagai kerusakan biasa sehingga tidak segera diperiksa.',
      'Berikut lima kondisi yang menunjukkan bahwa struktur perlu segera dilakukan assessment.',
    ],
    sections: [
      {
        heading: '1. Muncul Retak pada Beton',
        body: [
          'Retak pada kolom, balok, lantai, dinding, atau sambungan struktur perlu diperhatikan, terutama jika retak semakin panjang, melebar, atau muncul kembali setelah diperbaiki.',
          'Retak dapat menjadi indikasi adanya pergerakan struktur, beban berlebih, penurunan fondasi, atau penurunan kualitas material.',
        ],
      },
      {
        heading: '2. Struktur Terlihat Melendut atau Berubah Bentuk',
        body: [
          'Lantai terasa turun, balok terlihat melendut, atap berubah bentuk, atau pintu dan jendela mulai sulit dibuka dapat menjadi tanda adanya deformasi pada struktur.',
          'Kondisi ini sering terjadi secara perlahan sehingga pengguna bangunan tidak menyadari bahwa perubahan tersebut berkaitan dengan kinerja struktur.',
        ],
      },
      {
        heading: '3. Terjadi Korosi dan Beton Mengelupas',
        body: [
          'Besi tulangan yang terlihat berkarat, beton mengelupas, atau terdapat noda karat pada permukaan merupakan tanda bahwa perlindungan terhadap tulangan sudah mulai berkurang.',
          'Apabila dibiarkan, korosi dapat mengurangi kekuatan tulangan dan mempercepat kerusakan struktur.',
        ],
      },
      {
        heading: '4. Bangunan Mengalami Perubahan Fungsi atau Penambahan Beban',
        body: [
          'Perubahan fungsi ruangan, pemasangan mesin baru, penambahan lantai, gudang penyimpanan, panel surya, videotron, tangki, atau peralatan berat dapat meningkatkan beban struktur.',
          'Meskipun struktur terlihat baik, kapasitasnya belum tentu sesuai dengan beban baru yang direncanakan.',
        ],
      },
      {
        heading:
          '5. Struktur Sudah Berusia Lama atau Pernah Mengalami Kejadian Khusus',
        body: [
          'Struktur yang sudah lama digunakan, pernah terkena banjir, gempa, kebakaran, benturan, getaran mesin, atau paparan lingkungan agresif perlu diperiksa secara berkala.',
          'Kerusakan internal tidak selalu terlihat dari permukaan, tetapi dapat memengaruhi keamanan dan umur layan struktur.',
        ],
      },
    ],
    conclusion: {
      heading: 'Jangan Menunggu Kerusakan Menjadi Serius',
      body: [
        'Banyak pemilik aset baru melakukan pemeriksaan setelah kerusakan terlihat cukup parah. Padahal, assessment yang dilakukan lebih awal dapat membantu mengetahui kondisi aktual struktur, menentukan tingkat keamanan, serta merencanakan perbaikan secara lebih tepat dan efisien.',
        'Apabila Anda menemukan salah satu tanda di atas, konsultasikan kondisi struktur Anda bersama PT Graha Survei Indonesia.',
        'Tim GSI siap membantu melalui inspeksi visual, pengujian struktur, analisis teknis, serta rekomendasi perbaikan dan perkuatan sesuai kondisi aktual di lapangan.',
        'Konsultasikan kebutuhan assessment struktur Anda melalui GSI One atau hubungi tim PT Graha Survei Indonesia.',
      ],
    },
  },
  {
    id: 'jangan-tambah-lantai',
    title: 'Jangan Tambah Lantai Sebelum Memeriksa 8 Hal Ini!',
    shortDesc:
      'Menambah lantai meningkatkan beban struktur bangunan. Pastikan memeriksa 8 poin krusial ini sebelum renovasi.',
    image: require('../../assets/images/insight/jangan_tambah_lantai.png'),
    date: '27 Juli 2026',
    readTime: '6 min baca',
    intro: [
      'Menambah lantai sering dianggap sebagai solusi praktis untuk memperoleh ruang tambahan tanpa harus membeli lahan baru. Namun, penambahan lantai juga berarti menambah beban pada struktur bangunan yang sudah ada.',
      'Masalahnya, tidak semua bangunan sejak awal dirancang untuk menerima tambahan lantai. Bangunan yang terlihat kokoh dan tidak mengalami kerusakan belum tentu memiliki kapasitas yang cukup untuk menahan beban baru.',
      'Sebelum pekerjaan penambahan lantai dimulai, beberapa hal berikut perlu diperiksa.',
    ],
    sections: [
      {
        heading: '1. Kondisi Struktur Eksisting',
        body: [
          'Pemeriksaan awal dilakukan terhadap elemen-elemen utama bangunan, seperti kolom, balok, pelat lantai, fondasi, sambungan struktur, dan struktur atap.',
          'Engineer akan memeriksa apakah terdapat retak, korosi, beton mengelupas, lendutan, perubahan bentuk, penurunan bangunan, atau kerusakan lain yang dapat memengaruhi keamanan struktur. Kerusakan yang terlihat kecil dapat menjadi lebih serius ketika bangunan menerima tambahan beban.',
        ],
        listItems: [
          'Kolom & Balok',
          'Pelat lantai & Fondasi',
          'Sambungan struktur',
          'Struktur atap',
        ],
      },
      {
        heading: '2. Mutu Material Struktur',
        body: [
          'Mutu beton dan baja tulangan perlu diketahui untuk memastikan kekuatan aktual struktur eksisting.',
          'Hasil pengujian membantu engineer mengetahui apakah mutu material aktual masih memenuhi kebutuhan struktur untuk menerima tambahan beban.',
        ],
        listItems: [
          'Hammer Test',
          'Ultrasonic Pulse Velocity Test',
          'Rebar Scan',
          'Core Drill Test',
          'Pengujian baja tulangan',
        ],
      },
      {
        heading: '3. Ukuran dan Detail Tulangan',
        body: [
          'Ukuran kolom atau balok saja belum cukup untuk menentukan kapasitas struktur. Jumlah, diameter, jarak, dan posisi tulangan di dalam beton juga sangat berpengaruh terhadap kekuatan elemen struktur.',
          'Apabila gambar struktur lama tidak tersedia, pemeriksaan dapat dilakukan menggunakan rebar scanner dan verifikasi lapangan.',
        ],
        listItems: [
          'Posisi & Jumlah tulangan',
          'Diameter & Jarak tulangan',
          'Ketebalan selimut beton',
        ],
      },
      {
        heading: '4. Kondisi dan Kapasitas Fondasi',
        body: [
          'Tambahan lantai akan meningkatkan beban yang diteruskan dari kolom menuju fondasi, kemudian diteruskan ke tanah.',
          'Apabila gambar fondasi tidak tersedia, dapat dilakukan investigasi melalui test pit atau penggalian terbatas pada titik tertentu.',
          'Struktur atas yang kuat belum tentu aman apabila fondasi dan tanah di bawahnya tidak mampu menerima tambahan beban.',
        ],
      },
      {
        heading: '5. Soil Test dan Daya Dukung Tanah',
        body: [
          'Selain memeriksa fondasi, kondisi tanah juga perlu dievaluasi. Fondasi hanya dapat bekerja dengan baik apabila tanah di bawahnya memiliki daya dukung yang mencukupi.',
          'Data tanah lama sering kali tidak tersedia, tidak lengkap, atau sudah tidak sesuai dengan kondisi aktual. Soil test bertujuan untuk memperoleh informasi mengenai jenis & susunan lapisan tanah, kedalaman tanah keras, serta daya dukung tanah.',
        ],
        listItems: [
          'Cone Penetration Test (sondir)',
          'Standard Penetration Test (SPT)',
          'Pengeboran & Sampel tanah',
          'Pengujian lab & Muka air tanah',
        ],
      },
      {
        heading: '6. Beban Tambahan yang Direncanakan',
        body: [
          'Engineer perlu mengetahui fungsi dan penggunaan lantai baru yang akan dibangun (kantor, gudang, ruang rapat, tangki air, dll).',
          'Semakin besar beban yang direncanakan, semakin besar pula kapasitas struktur dan fondasi yang dibutuhkan.',
        ],
      },
      {
        heading: '7. Gambar dan Dokumen Struktur',
        body: [
          'Dokumen bangunan perlu dikumpulkan dan diperiksa sebelum assessment dilakukan, seperti gambar struktur, arsitektur, fondasi, detail penulangan, mutu material, dan riwayat kerusakan/renovasi.',
        ],
      },
      {
        heading: '8. Analisis Struktur dan Fondasi',
        body: [
          'Setelah data lapangan dan pengujian diperoleh, engineer akan membuat model dan melakukan analisis struktur untuk memastikan pelat, balok, kolom, fondasi, dan tanah mampu menahan tambahan beban secara aman.',
        ],
      },
      {
        heading: 'Apakah Bangunan Selalu Harus Diperkuat?',
        body: [
          'Tidak selalu. Apabila kapasitas struktur, fondasi, dan daya dukung tanah masih mencukupi, penambahan lantai dapat langsung dilakukan.',
          'Namun apabila terdapat elemen yang tidak memenuhi persyaratan, engineer dapat memberikan rekomendasi perkuatan seperti perbesaran dimensi, penambahan struktur baja/FRP, atau perkuatan fondasi.',
        ],
      },
      {
        heading: 'Jangan Menentukan Keamanan Hanya dari Kondisi Visual',
        body: [
          'Bangunan yang tidak mengalami retak belum tentu aman untuk ditambah lantai. Keputusan penambahan lantai harus didasarkan pada kondisi aktual struktur, pengujian material, investigasi fondasi, soil test, serta analisis teknis.',
        ],
      },
    ],
    conclusion: {
      heading: 'Konsultasikan Sebelum Pekerjaan Dimulai',
      body: [
        'Melakukan assessment sebelum menambah lantai dapat membantu pemilik bangunan mengetahui kapasitas aktual struktur, kondisi fondasi, menghindari risiko penurunan/kegagalan struktur, dan menyusun anggaran secara lebih tepat.',
        'Apabila Anda berencana menambah lantai, konsultasikan terlebih dahulu bersama PT Graha Survei Indonesia melalui GSI One.',
      ],
    },
  },
  {
    id: 'bangunan-pabrik-bergetar',
    title: 'Bangunan Pabrik Terasa Bergetar? Jangan Anggap Selalu Normal.',
    shortDesc:
      'Getaran mesin produksi pada bangunan industri dapat memengaruhi keselamatan struktur dan keandalan mesin jika diabaikan.',
    image: require('../../assets/images/insight/bangunan_pabrik_bergetar.png'),
    date: '27 Juli 2026',
    readTime: '8 min baca',
    intro: [
      'Getaran merupakan kondisi yang umum ditemukan pada bangunan industri. Mesin produksi, generator, compressor, pump, blower, conveyor, dan crane dapat menghasilkan gaya dinamis selama beroperasi.',
      'Namun, getaran yang dianggap sebagai hal biasa belum tentu berada dalam batas aman. Getaran yang semakin kuat atau muncul tiba-tiba dapat menjadi tanda adanya masalah pada mesin, fondasi, maupun struktur bangunan.',
      'Apabila terus diabaikan, getaran dapat memengaruhi keselamatan struktur, keandalan mesin, kenyamanan pekerja, dan kelangsungan operasional perusahaan.',
    ],
    sections: [
      {
        heading: 'Mengapa Mesin Dapat Menyebabkan Bangunan Bergetar?',
        body: [
          'Mesin yang beroperasi menghasilkan gaya berulang yang diteruskan menuju dudukan mesin, fondasi, lantai, balok, dan kolom.',
          'Sumber getaran dapat berasal dari ketidakseimbangan komponen mesin, misalignment shaft, kerusakan bearing, baut angkur longgar, dudukan tidak stabil, hingga resonansi.',
        ],
      },
      {
        heading: '1. Risiko Terjadinya Resonansi',
        body: [
          'Resonansi terjadi ketika frekuensi gaya dari mesin mendekati frekuensi alami lantai, fondasi, atau bangunan. Kondisi ini menyebabkan amplitudo getaran meningkat tajam.',
          'ISO 4866 menjelaskan evaluasi dampak getaran pada struktur. Resonansi yang dibiarkan dapat merusak sambungan, memunculkan retak, dan mengurangi umur layanan struktur.',
        ],
      },
      {
        heading: '2. Retak Akibat Beban Berulang',
        body: [
          'Getaran menghasilkan pembebanan siklik berulang yang dapat menyebabkan keretakan fatigue pada pelat lantai, balok penyangga, pedestal mesin, atau sambungan las.',
          'Menutup retak dengan sealant tanpa menyelesaikan sumber getarannya hanya memberikan solusi sementara.',
        ],
      },
      {
        heading: '3. Penurunan Kondisi Fondasi Mesin',
        body: [
          'Fondasi mesin menahan beban statis sekaligus gaya dinamis. Getaran berlebih dapat menurunkan kondisi tanah di bawah fondasi, melonggarkan baut angkur, atau merusak grouting.',
        ],
      },
      {
        heading: '4. Baut, Sambungan, dan Komponen Longgar',
        body: [
          'Getaran terus menerus menyebabkan baut angkur, base plate, clamp, dan sambungan pipa menjadi cepat longgar atau retak.',
        ],
      },
      {
        heading: '5. Kerusakan Menyebar ke Struktur Lain',
        body: [
          'Getaran dapat merambat melalui lantai dan tanah menuju ruang kontrol, instrumen presisi, atau gedung kantor di sekitarnya.',
          'Standar ISO 4866 dan ISO 20816 memberikan panduan pengukuran getaran mesin dan struktur pendukungnya.',
        ],
      },
      {
        heading: '6. Gangguan Operasional & Kenyamanan Pekerja',
        body: [
          'Getaran yang berlebih menyebabkan hasil produksi tidak presisi, kerusakan bearing berulang, hingga mengganggu konsentrasi pekerja di area produksi.',
        ],
      },
      {
        heading: 'Apa yang Perlu Dilakukan?',
        body: [
          'Tahapan pemeriksaan teknis meliputi:',
          '1. Inspeksi visual pada mesin, base plate, baut, grout, dan elemen struktur.',
          '2. Pengukuran getaran (vibration measurement) sesuai ISO 20816-3:2022.',
          '3. Operational Modal Analysis (OMA) / Experimental Modal Analysis (EMA).',
          '4. Pengujian NDT (Hammer, UPV, Rebar scan, Crack mapping).',
          '5. Analisis Struktur Dinamis untuk menghitung respons dan kebutuhan isolasi/perkuatan.',
        ],
      },
    ],
    conclusion: {
      heading: 'Jangan Menganggap Getaran sebagai Kondisi Normal',
      body: [
        'Getaran yang berubah atau meningkat tidak boleh dianggap normal hanya karena mesin masih beroperasi.',
        'Assessment dini oleh PT Graha Survei Indonesia membantu menemukan sumber getaran, mencegah shutdown, serta menentukan solusi perkuatan yang tepat.',
        'Konsultasikan kondisi mesin dan struktur industri Anda melalui GSI One.',
      ],
    },
  },
];
