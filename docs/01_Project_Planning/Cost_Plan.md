# Rencana Anggaran dan Biaya (Cost Plan)
## Proyek: GSI One Mobile Application

---

## 1. Pendahuluan

Dokumen Rencana Anggaran dan Biaya (Cost Plan) ini disusun untuk memberikan perkiraan biaya yang komprehensif bagi pengembangan, peluncuran, dan operasional aplikasi GSI One Mobile. Rencana ini dibagi menjadi dua kategori utama:
1. **Capital Expenditure (CapEx)**: Biaya investasi awal untuk pengembangan perangkat lunak dan persiapan lisensi.
2. **Operational Expenditure (OpEx)**: Biaya operasional berulang untuk infrastruktur cloud, layanan pihak ketiga, dan pemeliharaan sistem.

Estimasi ini didasarkan pada arsitektur teknis yang direncanakan: aplikasi mobile berbasis React Native yang terintegrasi dengan backend Node.js (Express.js) dan database Supabase (PostgreSQL + Storage).

---

## 2. Biaya Investasi Awal (Capital Expenditure - CapEx)

Biaya investasi awal mencakup seluruh aktivitas dari fase perencanaan hingga peluncuran aplikasi ke produksi.

### 2.1 Pengembangan Perangkat Lunak (Software Development)
Pengembangan aplikasi mobile dan backend dilakukan secara mandiri / internal oleh pengembang internal. Oleh karena itu, komponen biaya SDM dialokasikan sebesar Rp 0.

| Peran | Estimasi Durasi | Biaya Bulanan (IDR) | Total Biaya (IDR) |
| --- | --- | --- | --- |
| Pengembang Internal | - | Rp 0 | Rp 0 |
| **Total Biaya SDM** | | | **Rp 0** |

### 2.2 Lisensi dan Akun Developer
Biaya pendaftaran akun resmi pada Google Play Store dan Apple App Store untuk publikasi aplikasi.

| Komponen | Frekuensi | Biaya (USD) | Estimasi Biaya (IDR) |
| --- | --- | --- | --- |
| Google Play Console Developer Account | Sekali seumur hidup | $25 | Rp 410.000 |
| Apple Developer Program Membership | Tahunan | $99 | Rp 1.630.000 |
| **Total Lisensi** | | | **Rp 2.040.000** |

*Kurs konversi diasumsikan $1 USD = Rp 16.400.*

### 2.3 Setup Infrastruktur Awal
Biaya konfigurasi server awal, migrasi database SQLite lokal ke Supabase PostgreSQL, dan setup lingkungan deployment (CI/CD pipeline).

| Aktivitas | Estimasi Biaya (IDR) |
| --- | --- |
| Konfigurasi Cloud Database & Backend Server | Rp 1.500.000 |
| Setup SSL, Subdomain, & Security Hardening | Rp 1.000.000 |
| **Total Setup** | **Rp 2.500.000** |

---

## 3. Biaya Operasional Berulang (Operational Expenditure - OpEx)

Biaya ini dikeluarkan secara bulanan atau tahunan untuk memastikan aplikasi tetap berjalan secara optimal di lingkungan produksi.

### 3.1 Layanan Infrastruktur Cloud (Hosting & Database)
Untuk mendukung performa terbaik dan kedaulatan data di Indonesia (sesuai UU PDP), kita dapat memilih salah satu dari dua skenario infrastruktur berikut dengan memanfaatkan Biznet Gio Cloud:

#### Opsi A: Skema Biznet Gio 100% (Rekomendasi Lokal & Hemat)
Seluruh backend, database PostgreSQL, dan penyimpanan berkas (object storage) di-host di Biznet Gio Cloud (Indonesia). Database PostgreSQL diinstal dan dikelola mandiri di dalam VPS.

| Layanan | Skema / Paket | Biaya Bulanan (IDR) | Biaya Tahunan (IDR) |
| --- | --- | --- | --- |
| **VPS Backend & DB (NEO Lite SS 2.1)** | 1 Core vCPU, 2 GB RAM, 60 GB SSD | Rp 80.000 | Rp 960.000 |
| **NEO Object Storage** | S3-Compatible Storage (50 GB) | Rp 20.000 | Rp 240.000 |
| **Domain Name Renewal (.com)** | Perpanjangan tahunan | - | Rp 200.000 |
| **Total Infrastruktur Opsi A** | | **Rp 100.000** | **Rp 1.400.000** |

#### Opsi B: Skema Hybrid (Biznet Gio VPS + Supabase Pro)
Server API Express di-host di Biznet Gio VPS, sedangkan database & otentikasi menggunakan layanan managed cloud Supabase Pro.

| Layanan | Skema / Paket | Biaya Bulanan (IDR) | Biaya Tahunan (IDR) |
| --- | --- | --- | --- |
| **VPS Backend (NEO Lite SS 2.1)** | 1 Core vCPU, 2 GB RAM, 60 GB SSD | Rp 80.000 | Rp 960.000 |
| **Supabase Pro Tier** | Managed Database PostgreSQL | Rp 410.000 ($25) | Rp 4.920.000 |
| **Supabase Storage** | Kuota penyimpanan berkas tambahan | Rp 50.000 | Rp 600.000 |
| **Domain Name Renewal (.com)** | Perpanjangan tahunan | - | Rp 200.000 |
| **Total Infrastruktur Opsi B** | | **Rp 540.000** | **Rp 6.680.000** |

### 3.2 Layanan Pihak Ketiga (Third-Party Services)
Integrasi layanan eksternal untuk notifikasi.

| Layanan | Kegunaan | Estimasi Biaya Bulanan (IDR) | Estimasi Biaya Tahunan (IDR) |
| --- | --- | --- | --- |
| **WhatsApp Gateway (Fonnte/Wablas)** | Notifikasi real-time update project & booking | Rp 120.000 | Rp 1.440.000 |
| **Email Gateway (Brevo / Mailgun)** | Autentikasi akun & OTP | Rp 0 (Free Tier 300 email/hari) | Rp 0 |
| **Total Layanan Ketiga** | | **Rp 120.000** | **Rp 1.440.000** |

### 3.3 Pemeliharaan dan Dukungan Teknis (Maintenance & Support)
Pemeliharaan sistem paska-pengembangan seperti penanganan bug kecil, pembaruan keamanan, kompatibilitas OS Android/iOS, dan pemantauan server dilakukan secara internal oleh pengembang mandiri.

- **Biaya Bulanan**: Rp 0
- **Total Tahunan**: Rp 0

---

## 4. Rangkuman Proyeksi Anggaran (Cost Summary)

Berikut adalah perbandingan total anggaran tahun pertama dan tahun-tahun berikutnya antara Opsi A (100% Biznet Gio) dan Opsi B (Hybrid Biznet + Supabase) dengan kondisi tanpa biaya SDM eksternal.

### 4.1 Perbandingan Tahun Pertama (Inisiasi & Operasional)

| Komponen Biaya | Opsi A (100% Biznet Gio) | Opsi B (Hybrid) |
| --- | --- | --- |
| **CapEx (Investasi Awal)** | | |
| - Pengembangan Aplikasi | Rp 0 | Rp 0 |
| - Registrasi Google Play & Apple Developer | Rp 2.040.000 | Rp 2.040.000 |
| - Setup Awal & Deployment | Rp 2.500.000 | Rp 2.500.000 |
| **OpEx (Operasional 1 Tahun)** | | |
| - Infrastruktur Cloud & Domain | Rp 1.400.000 | Rp 6.680.000 |
| - WhatsApp Gateway (12 bulan) | Rp 1.440.000 | Rp 1.440.000 |
| - Pemeliharaan Teknis | Rp 0 | Rp 0 |
| **Total Tahun Pertama** | **Rp 7.380.000** | **Rp 12.660.000** |

### 4.2 Proyeksi Tahun Kedua dan Seterusnya (Hanya OpEx Tahunan)

Untuk tahun kedua dan selanjutnya, biaya investasi awal ditiadakan. Proyeksi biaya langganan tahunan adalah:

| Komponen Biaya | Opsi A (100% Biznet Gio) | Opsi B (Hybrid) |
| --- | --- | --- |
| - Infrastruktur Cloud & Domain | Rp 1.400.000 / tahun | Rp 6.680.000 / tahun |
| - WhatsApp Gateway | Rp 1.440.000 / tahun | Rp 1.440.000 / tahun |
| - Registrasi Apple Developer | Rp 1.630.000 / tahun | Rp 1.630.000 / tahun |
| - Pemeliharaan Teknis | Rp 0 / tahun | Rp 0 / tahun |
| **Total Estimasi Tahunan** | **Rp 4.470.000 / tahun** | **Rp 9.750.000 / tahun** |
| **Rata-rata per Bulan** | **Rp 372.500 / bulan** | **Rp 812.500 / bulan** |

---

## 5. Strategi Efisiensi Biaya

Beberapa pendekatan yang dapat dilakukan untuk meminimalkan pengeluaran khususnya pada tahap awal:
1. **Pemanfaatan Free Tier**: Memaksimalkan paket gratis dari Supabase, Brevo, dan Google Maps selama masa pengujian internal dan beta testing. Migrasi ke paket Pro hanya dilakukan menjelang peluncuran resmi.
2. **Pengembangan Bertahap (Incremental Development)**: Mengutamakan fitur penting (MVP) seperti Onboarding, Katalog Layanan, dan Form Booking Survei pada rilis awal. Fitur sekunder seperti Project Tracking detail dapat ditunda ke fase berikutnya.
3. **VPS vs Serverless**: Evaluasi berkala apakah backend Express.js dapat dimigrasikan sepenuhnya ke Supabase Edge Functions untuk menghemat biaya langganan VPS backend bulanan.
