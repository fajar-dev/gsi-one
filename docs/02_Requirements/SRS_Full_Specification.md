# Software Requirements Specification (SRS)
## Proyek: GSI One Mobile Application
## Standar: ISO/IEC/IEEE 29148 (adaptasi)

---

## 1. Pendahuluan

### 1.1 Tujuan
Dokumen Software Requirements Specification (SRS) ini disusun untuk mendefinisikan seluruh kebutuhan fungsional dan non-fungsional dari aplikasi mobile **GSI One** yang dikembangkan untuk PT Graha Survei Indonesia (GSI). Dokumen ini berfungsi sebagai acuan teknis utama bagi tim pengembang (developer), penguji kualitas (QA), serta manajemen proyek dalam memahami alur kerja aplikasi (*Application Flow*), arsitektur Clean Architecture, serta integrasi sistem.

### 1.2 Lingkup Produk
GSI One adalah aplikasi mobile berbasis lintas platform (cross-platform) Android dan iOS menggunakan framework React Native dengan TypeScript. Aplikasi ini berfungsi sebagai gerbang interaksi digital terpadu antara pelanggan, teknisi lapangan, staf marketing, dan manajemen PT Graha Survei Indonesia untuk:
- Mengeksplorasi katalog 6 layanan teknis utama PT GSI (Structural Forensic, Risk Asset Integrity, Repair & Strengthening Design, Natural Hazard Risk Assessment, SHMS, dan EEWS).
- Mengakses studi kasus asesmen struktur teknis (Our Experience) berdasarkan kategori bangunan (Gedung, Jembatan, Dermaga/Jetty, Industri) serta visualisasi simulasi data telemetri sensor SHMS.
- Mengajukan permohonan survei lokasi (Site Survey Booking) secara langsung melalui form publik interaktif.
- Mengelola dan memproses aliran permohonan survei (Survey Request Pipeline) oleh staf Marketing dan Admin, termasuk penanganan klaim, persetujuan, penolakan, serta konversi otomatis permohonan survei menjadi proyek baru.
- Memantau dan mengelola proyek teknis (Project Tracking) secara real-time melalui linimasa tahapan, catatan progres lapangan (`stage_updates`), dan manajemen metadata dokumen inspeksi/laporan (`project_files`) pada bucket Storage `projects` privat.
- Mengelola akun pengguna secara terpusat oleh System Administrator (login autentikasi dengan Nomor Tiket / Email & Kata Sandi, pendaftaran akun terpusat melalui AdminRegisterModal tanpa fitur registrasi mandiri publik).

### 1.3 Definisi, Akronim, dan Singkatan
- **GSI**: PT Graha Survei Indonesia, perusahaan penyedia jasa audit struktur, NDT, dan monitoring bangunan.
- **SRS**: Software Requirements Specification (Spesifikasi Persyaratan Perangkat Lunak).
- **SHMS**: Structural Health Monitoring System (Sistem Pemantauan Kesehatan Struktur).
- **EEWS**: Early Earthquake Warning System (Sistem Peringatan Dini Gempa Bumi).
- **NDT / DT**: Non-Destructive Testing / Destructive Testing (Pengujian Non-Destruktif dan Destruktif).
- **RLS**: Row Level Security (Kebijakan Keamanan Tingkat Baris pada Supabase PostgreSQL).
- **AsyncStorage**: Penyimpanan data key-value lokal pada React Native untuk persistensi token autentikasi dan profil pengguna.
- **Zustand**: Library manajemen state global yang digunakan pada aplikasi (`authStore`, `projectStore`).
- **CORS**: Cross-Origin Resource Sharing (Mekanisme keamanan HTTP untuk membatasi origin request terdaftar pada backend Express).
- **JWT**: JSON Web Token (Standar enkripsi token untuk autentikasi dan otorisasi sesi pengguna).
- **RBAC**: Role-Based Access Control (Sistem pengontrolan hak akses terstruktur berdasarkan 4 peran: Admin, Marketing, Engineer, dan Client).
- **DTO**: Data Transfer Object (Pola objek pemetaan data terisolasi antara skema database dan entitas domain aplikasi via `projectMapper.ts`).
- **REST API**: Representational State Transfer Application Programming Interface (Antarmuka komunikasi HTTP terstruktur berbasis JSON).
- **BaaS**: Backend as a Service (Platform cloud backend terintegrasi Supabase untuk Database PostgreSQL, Auth, Realtime, dan Storage).
- **Helmet**: Middleware keamanan Express.js untuk mengonfigurasi HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, HSTS).
- **Multer**: Middleware Node.js/Express untuk menangani penanganan pengungahan berkas `multipart/form-data` (foto inspeksi & laporan PDF).
- **Signed URL**: URL akses berdurasi terbatas yang diterbitkan oleh Supabase Storage untuk mengunduh dokumen dari bucket privat `projects`.
- **Stage Updates**: Catatan harian aktivitas kemajuan pekerjaan proyek di lapangan yang diinput oleh Field Engineer.
- **Project Stages**: 4 tahapan linimasa standar dalam proyek GSI One (Inisiasi, Survei Lapangan, Analisis & Laporan, Selesai).
- **SLO**: Service Level Objective (Target tingkat kualitas performa layanan aplikasi mencakup latensi, error rate, dan availability).

### 1.4 Referensi
- ISO/IEC/IEEE 29148:2018 Systems and software engineering - Life cycle processes - Requirements engineering.
- Kode Sumber GSI One Mobile Repository (`src/`, `package.json`).
- Dokumen Arsitektur & SDLC GSI One Mobile (`docs/ARCHITECTURE_AND_SDLC.md`).

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk
GSI One Mobile beroperasi sebagai klien frontend React Native yang terhubung ke Supabase Cloud (PostgreSQL Database, Realtime WebSocket Subscription, Auth RLS, dan Cloud Storage) serta REST API backend Express.

```
+-----------------------------------------------------------------------+
|                         GSI One Mobile App                            |
|                           (React Native)                              |
+-----------------------------------------------------------------------+
    |               |                     |                     |
    | HTTPS         | Realtime WS         | Storage SDK         | Local Storage
    v               v                     v                     v
+-----------+  +-------------------+  +-----------------+  +---------------+
| Express   |  | Supabase Realtime |  | Supabase Storage|  | AsyncStorage  |
| REST API  |  | WebSocket Engine  |  | (Bucket Projects)|  | (Auth Session)|
+-----------+  +-------------------+  +-----------------+  +---------------+
    |                   |                     |
    +-------------------+---------------------+
                        |
                        v
         +-----------------------------+
         | Supabase PostgreSQL DB      |
         | (Row Level Security Active) |
         +-----------------------------+
```

### 2.2 Fungsi Produk Utama
Aplikasi GSI One menyediakan fungsi utama yang terbagi menjadi beberapa modul:
1. **Modul Publik & Eksplorasi Layanan**:
   - Katalog 6 Layanan Utama GSI (`LayananKamiScreen`, `LayananDetailScreen`).
   - Asesmen Struktur & Studi Kasus (`ServicesScreen`, `StructureDetailScreen`).
   - Artikel & Insight Teknis (`InsightListScreen`, `InsightDetailScreen`).
   - Formulir Pengajuan Survei Lokasi (`BookSurveyScreen`, `SuccessScreen`).
2. **Modul Autentikasi & Manajemen Akun**:
   - Login Akun dengan Nomor Tiket / Email (`LoginScreen`).
   - Lupa Kata Sandi (`ForgotPasswordScreen`).
   - Pendaftaran Akun Terpusat khusus Admin (`AdminRegisterModal`).
   - Manajemen Profil Pengguna & Keluar Sesi (`ProfileScreen`).
3. **Modul Multi-Role Dashboard**:
   - Dashboard Admin (`AdminDashboard.tsx`).
   - Dashboard Marketing (`MarketingDashboard.tsx`).
   - Dashboard Field Engineer (`EngineerDashboard.tsx`).
   - Dashboard Klien (`ClientDashboard.tsx`).
4. **Modul Manajemen Permohonan Survei (Survey Requests)**:
   - Pemantauan antrean pengajuan survei lokasi (`SurveyRequestsScreen`).
   - Pengklaiman, persetujuan, penolakan permohonan survei.
   - Konversi otomatis permohonan survei yang disetujui menjadi Proyek Baru (`CreateProjectScreen`).
5. **Modul Manajemen Proyek & Tracking (Project Life Cycle)**:
   - Pencarian, penyaringan, dan daftar proyek (`ProjectListScreen`).
   - Pembuatan proyek baru (`CreateProjectScreen`).
   - Pemantauan linimasa 4 tahapan proyek (`ProjectDetailScreen`).
   - Pembaruan status tahapan dan persentase progres.
   - Penginputan catatan progres pekerjaan lapangan (`stage_updates`).
   - Pengunggahan dan pengunduhan dokumen laporan inspeksi (`project_files` dan signed URL Storage).

### 2.3 Karakteristik Pengguna
Aplikasi ini mendukung 4 peran pengguna utama:
- **System Administrator (Admin)**: Memiliki akses penuh untuk mengelola pengguna, mendaftarkan akun staf/klien baru, membuat proyek, menyetujui permohonan survei, dan mengkonfigurasi sistem.
- **Marketing Staff**: Mengelola antrean permohonan survei (`bookings`), mengklaim permohonan, memproses persetujuan/penolakan, dan menginisiasi konversi permohonan menjadi proyek baru.
- **Field Engineer (Insinyur Lapangan)**: Memperbarui status tahapan proyek, memasukkan persentase kemajuan, menambahkan catatan progres (`stage_updates`), dan mengunggah berkas foto inspeksi serta laporan teknis (`project_files`).
- **Client / Klien GSI**: Mengakses aplikasi via login kredensial untuk memantau progres linimasa proyek secara real-time, melihat status monitoring sensor SHMS, membaca log harian, dan mengunduh laporan teknis inspeksi.

---

## 3. Persyaratan Spesifik

### 3.1 Persyaratan Fungsional (Functional Requirements)

#### 3.1.1 Autentikasi & Pengelolaan Sesi (FR-AUTH)
- **FR-AUTH-01: Login Pengguna via Nomor Tiket / Email**
  Sistem harus memungkinkan pengguna masuk menggunakan Nomor Tiket atau Email beserta Kata Sandi. Kredensial divalidasi melalui layanan autentikasi Supabase dan/atau REST API Backend.
- **FR-AUTH-02: Pendaftaran Akun Terpusat (Admin-Only)**
  Sistem hanya mengizinkan akun bertipe `admin` untuk membuat akun pengguna baru (Klien, Marketing, Engineer) melalui `AdminRegisterModal`. Registrasi mandiri oleh publik ditiadakan demi keamanan.
- **FR-AUTH-03: Persistensi Sesi Lokal**
  Sistem harus menyimpan token autentikasi dan profil pengguna pada `AsyncStorage` secara otomatis setelah login berhasil, dan memuat ulang sesi saat aplikasi dibuka kembali.
- **FR-AUTH-04: Penanganan Lupa Kata Sandi**
  Sistem harus menyediakan mekanisme permintaan reset kata sandi ke email terdaftar pada `ForgotPasswordScreen`.
- **FR-AUTH-05: Logout / Keluar Sesi**
  Sistem harus menghapus seluruh data sesi dari `AsyncStorage` dan mengembalikan state navigasi ke halaman awal saat pengguna memilih Keluar.

#### 3.1.2 Layanan Publik & Pemesanan Survei (FR-PUBLIC & FR-BOOK)
- **FR-PUBLIC-01: Katalog Layanan Resmi GSI**
  Sistem harus menampilkan 6 katalog layanan teknis resmi PT GSI (Structural Forensic, Risk Asset Integrity, Repair & Strengthening Design, Natural Hazard Risk Assessment, SHMS, dan EEWS).
- **FR-PUBLIC-02: Detail Layanan &CTA Booking**
  Sistem harus menyediakan detail komprehensif tiap layanan mencakup ringkasan, risikonya, solusi GSI, manfaat, output, dan tombol aksi pengajuan survei.
- **FR-PUBLIC-03: Studi Kasus Kategori Struktur (Our Experience)**
  Sistem harus menyajikan studi kasus asesmen per jenis struktur (Gedung, Jembatan, Dermaga/Jetty, Industri) beserta visualisasi sensor SHMS.
- **FR-BOOK-01: Formulir Pengajuan Survei Lokasi**
  Sistem harus menyediakan form pengajuan survei yang mengumpulkan nama, email, nomor telepon, nama perusahaan, jenis layanan, lokasi survei, perkiraan tanggal, deskripsi struktur, dan catatan.
- **FR-BOOK-02: Konfirmasi Pengajuan Sukses**
  Setelah pengajuan survei berhasil dikirim, sistem mengarahkan pengguna ke `SuccessScreen` dengan menyajikan rangkuman data pengajuan.

#### 3.1.3 Manajemen Permohonan Survei (FR-SURVEY-MGMT)
- **FR-SURVEY-MGMT-01: Daftar Permohonan Survei**
  Sistem harus menampilkan daftar permohonan survei masuk bagi peran Admin dan Marketing pada `SurveyRequestsScreen`.
- **FR-SURVEY-MGMT-02: Klaim Permohonan Survei**
  Staf Marketing/Admin dapat mengklaim permohonan survei yang berstatus `pending` sehingga terikat pada akun staf terkait.
- **FR-SURVEY-MGMT-03: Persetujuan & Penolakan Permohonan**
  Staf Marketing/Admin dapat mengubah status permohonan menjadi `approved` atau `rejected` beserta alasan penolakan.
- **FR-SURVEY-MGMT-04: Konversi Permohonan ke Proyek**
  Permohonan survei yang berstatus `approved` dapat dikonversi secara langsung menjadi proyek baru melalui `CreateProjectScreen` dengan parameter terisi otomatis.

#### 3.1.4 Manajemen Proyek & Tracking (FR-PROJ & FR-STAGE)
- **FR-PROJ-01: Pembuatan Proyek Baru**
  Admin atau staf berwenang dapat membuat proyek baru dengan mengisi nama proyek, klien terdaftar, lokasi, jenis layanan, tanggal mulai/selesai, dan penugasan insinyur lapangan.
- **FR-PROJ-02: Daftar Proyek Multi-Role**
  Sistem harus menyajikan daftar proyek yang disesuaikan dengan peran pengguna (Klien hanya melihat proyek miliknya, Engineer melihat proyek yang ditugaskan, Admin/Marketing melihat seluruh proyek).
- **FR-STAGE-01: Linimasa 4 Tahapan Proyek**
  Sistem harus mengelola linimasa 4 tahapan standar proyek: (1) Inisiasi & Persiapan, (2) Survei & Inspeksi Lapangan, (3) Analisis & Laporan, (4) Selesai.
- **FR-STAGE-02: Pembaharuan Status & Progres Tahapan**
  Field Engineer dan Admin dapat memperbarui status tahapan (`pending`, `in_progress`, `done`) dan persentase progres total proyek.
- **FR-LOG-01: Catatan Log Harian Lapangan**
  Field Engineer dapat menambahkan entri catatan progres (`stage_updates`) berisi aktivitas, persentase progres, kendala lapangan, dan catatan teknis.
- **FR-DOC-01: Manajemen Dokumen Inspection & Laporan PDF**
  Field Engineer dan Admin dapat mengunggah berkas dokumen (foto inspeksi, laporan PDF) ke bucket Supabase Storage `projects`; metadata disimpan di `project_files` dan Klien berhak mengaksesnya melalui signed URL.

#### 3.1.5 Dashboard Multi-Role (FR-DASH)
- **FR-DASH-01: Admin Dashboard**
  Menampilkan ringkasan metrik sistem (total proyek, permohonan survei aktif, jumlah klien/engineer), tombol aksi cepat (Buat Akun, Buat Proyek, Kelola Survei), serta daftar proyek aktif terbaru.
- **FR-DASH-02: Marketing Dashboard**
  Menampilkan metrik permohonan survei, status klaim permohonan, dan jalan pintas ke manajemen permohonan survei.
- **FR-DASH-03: Engineer Dashboard**
  Menampilkan proyek-proyek yang ditugaskan kepada engineer, linimasa tahapan berjalan, entri cepat log harian, dan pengunggahan berkas.
- **FR-DASH-04: Client Dashboard**
  Menampilkan status proyek klien, persentase progres total, status monitoring sensor SHMS, serta berkas laporan terbaru.

---

### 3.2 Persyaratan Non-Fungsional (Non-Functional Requirements)

#### 3.2.1 Keamanan (Security)
- Seluruh komunikasi data menggunakan HTTPS terenkripsi TLS 1.3.
- Akses database dikontrol secara langsung melalui Supabase Row Level Security (RLS) berdasarkan role pengguna (`admin`, `marketing`, `field_engineer`, `client`).
- Pendaftaran akun dikontrol penuh secara terpusat oleh Admin. Registrasi mandiri publik ditiadakan.

#### 3.2.2 Kinerja & Keandalan (Performance & Reliability)
- Waktu tanggap antarmuka lokal kurang dari 100ms.
- Waktu muat data dari Supabase PostgreSQL menggunakan caching Zustand dan custom hooks teroptimasi.
- Skalabilitas visual antarmuka pengguna berbasis modul `responsive.ts` dengan titik acuan acuan acuan acuan basis acuan acuan acuan acuan 390px (iPhone 14 / standar modern Android).

#### 3.2.3 Arsitektur & Kualitas Kode (Maintainability & Testability)
- Penerapan Clean Architecture dengan pemisahan tegas antara Presentation Layer, Custom Hooks & Store Layer, Domain Entity Layer, Service & Repository Layer, dan Database Layer.
- Kualifikasi Maintainability Score A dengan ukuran file terkontrol (< 250 baris per file pasca-refactoring).
- Automated Testing Suite menggunakan Jest dengan minimal 8 test suites dan 49 unit tests passed.

---

## 4. Matriks Kompatibilitas Perangkat
- **Android**: Android 5.0 (API Level 21) hingga Android 14+ (API Level 34+).
- **iOS**: iOS 13.0 hingga iOS 17+.
- **Resolusi Layar**: Mendukung berbagai ukuran layar perangkat mobile (Phone & Tablet) dengan responsivitas dinamis.
