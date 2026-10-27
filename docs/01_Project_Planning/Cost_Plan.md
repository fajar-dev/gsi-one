# Rencana Anggaran dan Biaya (Cost Plan)
## Proyek: GSI One Mobile Application

---

## 1. Pendahuluan

Dokumen Rencana Anggaran dan Biaya (Cost Plan) ini disusun untuk memberikan perkiraan biaya yang komprehensif bagi pengembangan, peluncuran, dan operasional aplikasi GSI One Mobile. Rencana ini dibagi menjadi dua kategori utama:
1. **Capital Expenditure (CapEx)**: Biaya investasi awal untuk pengembangan perangkat lunak dan persiapan lisensi.
2. **Operational Expenditure (OpEx)**: Biaya operasional berulang untuk infrastruktur cloud, layanan pihak ketiga, dan pemeliharaan sistem.

Estimasi ini didasarkan pada arsitektur teknis yang direncanakan: aplikasi mobile berbasis React Native yang terintegrasi dengan Supabase (PostgreSQL, Auth, Storage, Realtime, dan Edge Functions).

---

## 2. Biaya Investasi Awal (Capital Expenditure - CapEx)

Biaya investasi awal mencakup seluruh aktivitas dari fase perencanaan hingga peluncuran aplikasi ke produksi.

### 2.1 Pengembangan Perangkat Lunak (Software Development)
Pengembangan aplikasi mobile dan layanan Supabase dilakukan secara mandiri / internal oleh pengembang internal. Oleh karena itu, komponen biaya SDM dialokasikan sebesar Rp 0.

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
Biaya konfigurasi server awal, konfigurasi PostgreSQL Supabase, dan setup lingkungan deployment (CI/CD pipeline).

| Aktivitas | Estimasi Biaya (IDR) |
| --- | --- |
| Konfigurasi Database & Edge Functions | Rp 1.500.000 |
| Setup SSL, Subdomain, & Security Hardening | Rp 1.000.000 |
| **Total Setup** | **Rp 2.500.000** |

---

## 3. Biaya Operasional

Arsitektur aktif memakai Supabase untuk PostgreSQL, Auth, Storage, Realtime, dan Edge Functions, serta hosting statis bila web didistribusikan. Anggaran infrastruktur perlu dihitung ulang dari pemakaian dan tagihan akun aktual. Estimasi infrastruktur terdahulu tidak berlaku untuk arsitektur ini.

Biaya lain meliputi distribusi Google Play/App Store, domain, email Auth, dan pemeliharaan. Gateway pesan merupakan opsi pengembangan, bukan layanan yang wajib dijalankan oleh aplikasi saat ini.


## 4. Proyeksi

Total operasional dan biaya tahunan belum dihitung ulang setelah penyederhanaan infrastruktur. Gunakan biaya akun developer dan setup di atas sebagai asumsi perencanaan historis, bukan harga layanan terkini.


## 5. Strategi Efisiensi Biaya

Beberapa pendekatan yang dapat dilakukan untuk meminimalkan pengeluaran khususnya pada tahap awal:
1. **Pemanfaatan Free Tier**: Memaksimalkan paket gratis dari Supabase, Brevo, dan Google Maps selama masa pengujian internal dan beta testing. Migrasi ke paket Pro hanya dilakukan menjelang peluncuran resmi.
2. **Pengembangan Bertahap (Incremental Development)**: Mengutamakan fitur penting (MVP) seperti Onboarding, Katalog Layanan, dan Form Booking Survei pada rilis awal. Fitur sekunder seperti Project Tracking detail dapat ditunda ke fase berikutnya.
3. **Layanan terkelola**: Pantau pemakaian Supabase dan hosting bundle web sesuai arsitektur aktif.
